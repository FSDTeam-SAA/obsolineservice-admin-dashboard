export type ProductFormValues = {
  productName: string;
  weight: string;
  size: string;
  price: number;
  offerPrice?: number;
  category: string;
  description: string;
  image?: File | string | null;
  subImages?: (File | string)[];
};

export type ProductItem = {
  _id: string;
  productName: string;
  category: string;
  price: number;
  stock: number;
  image: string;
};