export type Product = {
  productId: string;
  name: string;
  hsCode: string;
  isDeleted: boolean;
  tags?: string[];
}