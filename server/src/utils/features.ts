import { Document } from "mongoose";
import { Product } from "../models/product.js";
import { orderItemType } from "../types/types.js";

// variable may be possibly undefined error ata hai th  TypeScript me
// ! => means not null nhi hai 

export const reduceStock = async (orderItems: orderItemType[]) => {
  for (let i = 0; i < orderItems.length; i++) {
    const order = orderItems[i];

    const productItem = await Product.findById(order.productId);

    if (!productItem) throw new Error("Product not found");

    productItem.stock! -= order.quantity;

    await productItem.save();
  }
};

// 'productItem.stock' is possibly 'null' or 'undefined'
// ans :=> add ! mark

//////////////////////////////////////////////////////////////////////////
// admin-dashboard = getDashboardStats controller

export const calculatePercentage = (thisMonth: number, lastMonth: number) => {
  if (lastMonth === 0) return thisMonth * 100;

  const percent = (thisMonth / lastMonth) * 100;
  return percent.toFixed(0);
};

//////////////////////////////////////////////////////////////////////////
// admin-dashboard = Inventory categories

// categories : string[] tha error de raha tha ye niche wla toh categories ka type aaisa change kia
// type '(string | null | undefined)[]' is not assignable to type 'string[]'.

export const getInventoryCategories = async ({
  categories,
  productCount,
}: {
  categories: (string | null | undefined)[];
  productCount: number;
}) => {
  const categoriesCountPromise = categories.map((category) =>
    Product.countDocuments({ category })
  );
  const categoriesCount = await Promise.all(categoriesCountPromise);

  const categoryCount: Record<string, number>[] = [];

  categories.forEach((category, i) => {
    categoryCount.push({
      [category!]: Math.round((categoriesCount[i] / productCount) * 100),
    });
  });

  return categoryCount;
};

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////


interface myDocument extends Document {
  createdAt : Date;
  discount? : number;
  total? : number;
}

type dashBoardBarChartProps = {
  length: number;
  docArr: myDocument[];
  today : Date;
  property? : "discount" | "total";
};

// pehle  docArr : Document[] tha but {createdAt} exist nh kr raha tha
//  to extends krna pada Document mongoose se => docArr : myDocument[];

export const dashBoardBarChart = ({ length, docArr ,today,property}: dashBoardBarChartProps) => {

  const data:number[] = new Array(length).fill(0);

  docArr.forEach((i) => {
    const creationDate = i.createdAt;
    const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

    if (monthDiff < length) {
      if(property){
     // data[length - monthDiff - 1] += property ? i.discount! : 1;  both code will work same
        data[length - monthDiff - 1] += property ? i[property]! : 1;
      }else{
        data[length - monthDiff - 1] += 1;
      }

    }
  });

  return data;
};


///////////////////////////////////////////////////////////////////////////////////////
