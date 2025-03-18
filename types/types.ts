export interface CategoryWithId {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  createdAt: string;
}

export interface Category {
  name: string;
  slug: string;
  imageUrl: string;
  createdAt: string | null;
}

export interface Posts {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  authorId: string;
  authorName: string;
  authorEmail: string | null;
  authorPhotoURL?: string | null;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  imagePublicId?: string;
  likeCount: number;
  likedBy: string[];
  dislikedBy: string[];
  favoritedBy: string[];
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  createdAt: string;
  updatedAt: string;
  favoritePostIds: string[];
}
