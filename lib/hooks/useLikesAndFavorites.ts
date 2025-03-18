import { useState, useEffect } from "react";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  getDoc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

export const useLikesAndFavorites = (postId: string) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!user || !postId) return;

    // Set up real-time listeners for post and user
    const postRef = doc(db, "posts", postId);
    const userRef = doc(db, "users", user.uid);

    const unsubscribePost = onSnapshot(
      postRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const postData = docSnapshot.data();
          setLikeCount(postData.likeCount || 0);
          setIsLiked(postData.likedBy?.includes(user.uid) || false);
          setIsDisliked(postData.dislikedBy?.includes(user.uid) || false);
        }
      },
      (error) => {
        console.error("Error listening to post changes:", error);
      }
    );

    const unsubscribeUser = onSnapshot(
      userRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setIsFavorited(userData.favoritePostIds?.includes(postId) || false);
        }
      },
      (error) => {
        console.error("Error listening to user changes:", error);
      }
    );

    return () => {
      unsubscribePost();
      unsubscribeUser();
    };
  }, [user, postId]);

  const toggleLike = async () => {
    if (!user) {
      toast.error("You must be logged in to like posts");
      return;
    }

    if (isProcessing) return;

    setIsProcessing(true);

    try {
      const postRef = doc(db, "posts", postId);

      if (isLiked) {
        await updateDoc(postRef, {
          likedBy: arrayRemove(user.uid),
          likeCount: increment(-1),
        });
      } else {
        let updates;

        if (isDisliked) {
          updates = {
            likedBy: arrayUnion(user.uid),
            dislikedBy: arrayRemove(user.uid),
            likeCount: increment(2),
          };
        } else {
          updates = {
            likedBy: arrayUnion(user.uid),
            likeCount: increment(1),
          };
        }

        await updateDoc(postRef, updates);
      }
      // No need to update state here as the snapshot listener will handle it
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update like status");
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleDislike = async () => {
    if (!user) {
      toast.error("You must be logged in to dislike posts");
      return;
    }

    if (isProcessing) return;

    setIsProcessing(true);

    try {
      const postRef = doc(db, "posts", postId);

      if (isDisliked) {
        await updateDoc(postRef, {
          dislikedBy: arrayRemove(user.uid),
          likeCount: increment(1),
        });
      } else {
        let updates;

        if (isLiked) {
          updates = {
            dislikedBy: arrayUnion(user.uid),
            likedBy: arrayRemove(user.uid),
            likeCount: increment(-2),
          };
        } else {
          updates = {
            dislikedBy: arrayUnion(user.uid),
            likeCount: increment(-1),
          };
        }

        await updateDoc(postRef, updates);
      }
      // No need to update state here as the snapshot listener will handle it
    } catch (error) {
      console.error("Error toggling dislike:", error);
      toast.error("Failed to update dislike status");
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast.error("You must be logged in to favorite posts");
      return;
    }

    if (isProcessing) return;

    setIsProcessing(true);

    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        if (isFavorited) {
          await updateDoc(userRef, {
            favoritePostIds: arrayRemove(postId),
            updatedAt: new Date().toISOString(),
          });
        } else {
          await updateDoc(userRef, {
            favoritePostIds: arrayUnion(postId),
            updatedAt: new Date().toISOString(),
          });
        }
      } else {
        await setDoc(userRef, {
          uid: user.uid,
          displayName: user.displayName || user.email?.split("@")[0] || "User",
          email: user.email || "",
          photoURL: user.photoURL || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          favoritePostIds: isFavorited ? [] : [postId],
        });
      }

      const postRef = doc(db, "posts", postId);
      if (isFavorited) {
        await updateDoc(postRef, {
          favoritedBy: arrayRemove(user.uid),
        });
      } else {
        await updateDoc(postRef, {
          favoritedBy: arrayUnion(user.uid),
        });
      }

      toast.success(
        isFavorited ? "Removed from favorites" : "Added to favorites"
      );
      // No need to update state here as the snapshot listener will handle it
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorite status");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isLiked,
    isDisliked,
    isFavorited,
    likeCount,
    isProcessing,
    toggleLike,
    toggleDislike,
    toggleFavorite,
  };
};
