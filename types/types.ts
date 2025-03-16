export interface Category {
  name: string;
  slug: string;
  imageUrl: string;
  createdAt?: string;
}

export interface CategoryWithId extends Category {
  id: string;
}