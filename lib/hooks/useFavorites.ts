import { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../contexts/AuthContext";
import { Posts } from "../../types/types";
import toast from "react-hot-toast";

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Posts[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setFavoriteIds([]);
      return;
    }

    setLoading(true);

    const userRef = doc(db, "users", user.uid);
    const unsubscribeUser = onSnapshot(
      userRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          const ids = userData.favoritePostIds || [];
          setFavoriteIds(ids);
        } else {
          setFavoriteIds([]);
        }
      },
      (error) => {
        console.error("Error listening to user favorites:", error);
        setError("Failed to listen to favorites changes");
        setLoading(false);
      }
    );

    return () => unsubscribeUser();
  }, [user]);

  useEffect(() => {
    if (!user || favoriteIds.length === 0) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const fetchFavoritePosts = async () => {
      try {
        const favoritePosts: Posts[] = [];

        for (let i = 0; i < favoriteIds.length; i += 10) {
          const batch = favoriteIds.slice(i, i + 10);
          if (batch.length === 0) continue;

          const postsRef = collection(db, "posts");
          const q = query(postsRef, where("__name__", "in", batch));
          const querySnapshot = await getDocs(q);

          querySnapshot.forEach((doc) => {
            const data = doc.data();
            favoritePosts.push({
              id: doc.id,
              title: data.title || "",
              description: data.description || "",
              categoryId: data.categoryId || "",
              categoryName: data.categoryName || "",
              categorySlug: data.categorySlug || "",
              authorId: data.authorId || "unknown",
              authorName: data.authorName || "Anonymous",
              authorEmail: data.authorEmail || null,
              authorPhotoURL: data.authorPhotoURL || null,
              createdAt: data.createdAt || new Date().toISOString(),
              updatedAt: data.updatedAt || new Date().toISOString(),
              published: data.published || false,
              imagePublicId: data.imagePublicId || "",
              likeCount: data.likeCount || 0,
              likedBy: data.likedBy || [],
              dislikedBy: data.dislikedBy || [],
              favoritedBy: data.favoritedBy || [],
            });
          });
        }

        const sortedPosts = favoritePosts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setFavorites(sortedPosts);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setError("Failed to load favorite posts");
        toast.error("Failed to load favorites");
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritePosts();
  }, [user, favoriteIds]);

  return { favorites, loading, error };
};
