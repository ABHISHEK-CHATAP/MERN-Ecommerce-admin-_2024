import { Bar, Line, Order, Pie, Product, Stats, User, cartItem, shoppingInfo } from "./types";

// creating custom error - apna error
export type CustomError = {
  status: number;
  data: {
    message: string;
    success: boolean;
  };
};

// -------------------------------------------------

// #userAPI Response
// user type
export type MessageResponse = {
  success: boolean;
  message: string;
};

export type UserResponse = {
  success: boolean;
  user: User;
};

export type allUserResponse = {
  success: boolean;
  users: User[];
};

export type DeleteUserRequest = {
  userId: string;
  adminUserId: string;
};

// -------------------------------------------------

// #productAPI all Responses
// product type
export type latestallProductResponse = {
  success: boolean;
  message?: string;
  products: Product[];
};

// category type
export type CategoriesResponse = {
  success: boolean;
  message: string;
  categories: string[];
};

//2 TypeScript merge = dono k response type same hai except (totalPage)
export type SearchProductsResponse = latestallProductResponse & {
  totalPage: number;
};
export type SearchProductsRequest = {
  price: number;
  page: number;
  category: string;
  search: string;
  sort: string;
};

// get single product response bu id
export type ProductResponse = {
  success: boolean;
  singleProduct: Product;
};

// post : Create new product
export type CreateProductsRequest = {
  id: string;
  formData: FormData;
};

// put : update product
export type updateProductsRequest = {
  userId: string; // adminOnly
  productId: string;
  formData: FormData;
};

// delete : delete product
export type deleteProductsRequest = {
  userId: string; // adminOnly
  productId: string;
};

// -------------------------------------------------

// #orderAPI Response

//#POST - new Order
export type newOrderRequest = {
  shippingInfo: shoppingInfo;
  orderItems: cartItem[];
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  user: string;
};

// #GET - myOrders, allOrders
export type AllOrdersResponse = {
  success: boolean;
  orders: Order[];
};

// #GET - orderDetail
export type orderDetailResponse = {
  success: boolean;
  order: Order;
};

//#PUT - new Order
export type updateOrderRequest = {
  userId: string;
  orderId: string;
};

// -------------------------------------------------

// #dashboard Response
export type StatsResponse = {
  success: boolean;
  stats: Stats;
};

export type PieResponse = {
  success: boolean;
  charts: Pie;
};

export type BarResponse = {
  success: boolean;
  charts: Bar;
};

export type LineResponse = {
  success: boolean;
  charts: Line;
};

// -------------------------------------------------
