export type Product = {
  pId: number;
  name: String;
  details: String;
  price: Number;
};
export type cartItem = {
  product: Product;
  quantity: number;
};
export type orderItem = {
  productId: number;
  quantity: number;
  price: number;
};
export type order = {
  uid: number;
  products: orderItem[];
};
export type user = {
  uid: number;
  name: string;
  email: string;
  userType: string;
};
export type IProfile = {
  users: user[];
};
