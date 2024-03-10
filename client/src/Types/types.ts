export type User = {
  name: string;
  email: string;
  photo: string;
  gender: string;
  role: string;
  dob: string;
  _id: string;
};

// -----------------------------
// product type - productAPI

export type Product = {
  name: string;
  photo: string;
  price: number;
  stock: number;
  category: string;
  _id: string;
};

// ------------------------------
// cartReducer - shipping Info

export type shoppingInfo = {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
};

export type cartItem = {
  productId: string;
  name: string;
  price: number;
  photo: string;
  stock: number;
  quantity: number;
};

// --------------------------------
// #OrderAPI

// export type OrderItem = {
//     productId:string;
//     name:string;
//     price:number;
//     photo : string;
//     quantity:number;
//     _id: string;
//  }
// above type ka short form

export type OrderItem = Omit<cartItem, "stock"> & { _id: string };

// mtlb OrderItem = cartItem except "stock" and include _id : string

// GET - myOrder Response from DB
export type Order = {
  orderItems: OrderItem[];
  shippingInfo: shoppingInfo;
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  status: string;
  _id: string;
  user: {
    name: string;
    _id: string;
  };
};

// --------------------------------

// stats responses --  #dashboard

type CountAndChange = {
  revenue: number;
  product: number;
  user: number;
  order: number;
};

type latestTransaction = {
  _id: string;
  amount: number;
  quantity: number;
  discount: number;
  status: string;
};
// category count -> backend ke code me hover krke mila as it is
// ye array of multiple object tha ->i,e., Record<string, number>[]
export type Stats = {
  categoryCount: Record<string, number>[];
  changePercent: CountAndChange;
  counts: CountAndChange;
  chart: {
    order: number[];
    revenue: number[];
  };
  userRatio: {
    male: number;
    female: number;
  };
  latestTransaction: latestTransaction[];
};

/// #Pie Chart response

type OrderFulfillment = {
  processing: number;
  shipped: number;
  deliveredOrder: number;
};

type RevenueDistribution = {
  netMargin: number;
  discount: number;
  productionCost: number;
  burnt: number;
  marketingCost: number;
};

type UserAgeGroup = {
  teen: number;
  adult: number;
  old: number;
};

export type Pie = {
  orderFulfillment: OrderFulfillment;
  productCategories: Record<string, number>[];
  stockAvailability: {
    inStock: number;
    outOfStock: number;
  };
  RevenueDistribution: RevenueDistribution;
  usersAgeGroup: UserAgeGroup;
  adminCustomer: {
    admin: number;
    customer: number;
  };
};

/// #Bar Chart response

export type Bar = {
  // users: [0, 0, 0, 0, 0, 2];
  users: number[];
  products: number[];
  orders: number[];
};

export type Line = {
  users: number[];
  products: number[];
  discount: number[];
  revenue: number[];
};
// --------------------------------
