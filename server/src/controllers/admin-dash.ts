import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import {
  calculatePercentage,
  dashBoardBarChart,
  getInventoryCategories,
} from "../utils/features.js";

export const getDashboardStats = TryCatch(async (req, res, next) => {
  let stats = {};

  const key = "admin-stats";

  if (myCache.has(key)) {
    stats = JSON.parse(myCache.get(key) as string);
  } else {
    const today = new Date();

    // Calculate the date six months ago
    const sixMonthAgo = new Date();
    sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);

    const thisMonth = {
      start: new Date(today.getFullYear(), today.getMonth(), 1),
      end: today,
    };

    const lastMonth = {
      start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
      end: new Date(today.getFullYear(), today.getMonth(), 0),
    };

    //For Proucts
    const thisMonthProductsPromise = Product.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const lastMonthProductsPromise = Product.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    //for Users
    const thisMonthUsersPromise = User.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const lastMonthUsersPromise = User.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    // for Orders
    const thisMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const lastMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    // last six month ago
    const lastSixMonthOrderPromise = Order.find({
      createdAt: {
        $gte: sixMonthAgo,
        $lte: today,
      },
    });

    //Top Transaction for table
    const latestTransactionPromise = Order.find({})
      .select(["orderItems", "discount", "total", "status"])
      .limit(4);

    const [
      thisMonthProducts,
      thisMonthUsers,
      thisMonthOrders,
      lastMonthProducts,
      lastMonthUsers,
      lastMonthOrders,
      productCount,
      userCount,
      allOrdersTotal,
      lastSixMonthOrders,
      categories,
      femaleUsersCount,
      latestTransaction,
    ] = await Promise.all([
      thisMonthProductsPromise,
      thisMonthUsersPromise,
      thisMonthOrdersPromise,
      lastMonthProductsPromise,
      lastMonthUsersPromise,
      lastMonthOrdersPromise,
      Product.countDocuments(),
      User.countDocuments(),
      Order.find({}).select("total"),
      lastSixMonthOrderPromise,
      Product.distinct("category"),
      User.countDocuments({ gender: "female" }),
      latestTransactionPromise,
    ]);

    const thisMonthRevenue: number = thisMonthOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );
    const lastMonthRevenue: number = lastMonthOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const changePercent = {
      revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
      product: calculatePercentage(
        thisMonthProducts.length,
        lastMonthProducts.length
      ),
      user: calculatePercentage(thisMonthUsers.length, lastMonthUsers.length),
      order: calculatePercentage(
        thisMonthOrders.length,
        lastMonthOrders.length
      ),
    };

    const Revenue = allOrdersTotal.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const counts = {
      Revenue,
      user: userCount,
      product: productCount,
      order: allOrdersTotal.length,
    };

    // /* bar chart */
    // ye pura code sirf ek niche wla array leke bar chart ka code [ feactures.tsx ] me
    // common likha hai kyuki Bar, line Component function me use krna hai
    // bs yaha change nhi kia , baki niche bs [ dashBoardBarChart() ] ye function me hai
    const orderMonthCounts = new Array(6).fill(0);
    const orderMonthRevenue = new Array(6).fill(0);

    lastSixMonthOrders.forEach((order) => {
      const creationDate = order.createdAt;
      const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

      if (monthDiff < 6) {
        orderMonthCounts[6 - monthDiff - 1] += 1;
        orderMonthRevenue[6 - monthDiff - 1] += order.total;
      }
    });

    // Inventory categories
    // features me function banaya hai
    const categoryCount = await getInventoryCategories({
      categories,
      productCount,
    });

    // male female doughnut chart
    const userRatio = {
      male: userCount - femaleUsersCount,
      female: femaleUsersCount,
    };

    //Top Transaction table
    const modifiedLatestTransaction = latestTransaction.map((i) => ({
      id: i._id,
      discount: i.discount,
      amount: i.total,
      quantity: i.orderItems.length,
      status: i.status,
    }));

    /////////////////////////////
    stats = {
      categoryCount,
      changePercent,
      counts,
      chart: {
        order: orderMonthCounts,
        revenue: orderMonthRevenue,
      },
      userRatio,
      latestTransaction: modifiedLatestTransaction,
    };

    myCache.set(key, JSON.stringify(stats));
  }

  return res.status(200).json({
    success: true,
    stats,
  });
});

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

export const getPieCharts = TryCatch(async (req, res, next) => {
  let charts;

  const key = "admin-pie-chart";

  if (myCache.has(key)) {
    charts = JSON.parse(myCache.get(key) as string);
  } else {
    const allOrderPromise = Order.find({}).select([
      "total",
      "discount",
      "subtotal",
      "tax",
      "shippingCharges",
    ]);

    const [
      processingOrder,
      shippedOrder,
      deliveredOrder,
      categories,
      productCount,
      productsOutOfStock,
      allOrders,
      allUsers,
      adminUSersCount,
      customerUsersCount,
    ] = await Promise.all([
      Order.countDocuments({ status: "Processing" }),
      Order.countDocuments({ status: "Shipped" }),
      Order.countDocuments({ status: "Delivered" }),
      Product.distinct("category"),
      Product.countDocuments(),
      Product.countDocuments({ stock: 0 }),
      allOrderPromise,
      User.find({}).select(["dob"]),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "user" }),
    ]);

    const orderFulfillment = {
      processing: processingOrder,
      shipped: shippedOrder,
      deliveredOrder: deliveredOrder,
    };

    const productCategories = await getInventoryCategories({
      categories,
      productCount,
    });

    const stockAvailability = {
      inStock: productCount - productsOutOfStock,
      outOfStock: productsOutOfStock,
    };

    const grossIncome = allOrders.reduce(
      (prev, order) => prev + order.total || 0,
      0
    );
    const discount = allOrders.reduce(
      (prev, order) => prev + order.discount || 0,
      0
    );
    const productionCost = allOrders.reduce(
      (prev, order) => prev + order.shippingCharges || 0,
      0
    );
    const burnt = allOrders.reduce((prev, order) => prev + order.tax || 0, 0);
    const marketingCost = Math.round(grossIncome * (30 / 100));
    const netMargin =
      grossIncome - discount - productionCost - burnt - marketingCost;

    const RevenueDistribution = {
      netMargin,
      discount,
      productionCost,
      burnt,
      marketingCost,
    };

    const adminCustomer = {
      admin: adminUSersCount,
      customer: customerUsersCount,
    };

    const usersAgeGroup = {
      teen: allUsers.filter((i) => Number(i.age) < 20).length,
      adult: allUsers.filter((i) => Number(i.age) >= 20 && Number(i.age) < 40)
        .length,
      old: allUsers.filter((i) => Number(i.age) >= 40).length,
    };

    ////////////////////////////////
    charts = {
      orderFulfillment,
      productCategories,
      stockAvailability,
      RevenueDistribution,
      usersAgeGroup,
      adminCustomer,
    };

    myCache.set(key, JSON.stringify(charts));
  }

  res.status(200).json({
    success: true,
    charts,
  });
});
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

export const getBarCharts = TryCatch(async (req, res, next) => {
  let charts;

  const key = "admin-bar-charts";

  if (myCache.has(key)) {
    charts = JSON.parse(myCache.get(key) as string);
  } else {
    const today = new Date();

    // 6 month ago
    const sixMonthAgo = new Date();
    sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);

    // 12 month ago
    const twelveMonthAgo = new Date();
    twelveMonthAgo.setMonth(twelveMonthAgo.getMonth() - 12);

    // last 6 month ago promise
    const lastSixMonthProductPromise = Product.find({
      createdAt: {
        $gte: sixMonthAgo,
        $lte: today,
      },
    }).select("createdAt");

    const lastSixMonthUsersPromise = User.find({
      createdAt: {
        $gte: sixMonthAgo,
        $lte: today,
      },
    }).select("createdAt");

    const twelveMonthOrderPromise = Order.find({
      createdAt: {
        $gte: twelveMonthAgo,
        $lte: today,
      },
    }).select("createdAt");

    const [products, users, orders] = await Promise.all([
      lastSixMonthProductPromise,
      lastSixMonthUsersPromise,
      twelveMonthOrderPromise,
    ]);

    const productCounts = dashBoardBarChart({ length: 6, docArr: products, today,});

    const userCounts = dashBoardBarChart({ length: 6, docArr: users, today });

    const orderCounts = dashBoardBarChart({ length: 12,docArr: orders, today,});

    charts = {
      users: userCounts,
      products: productCounts,
      orders: orderCounts,
    };

    myCache.set(key, JSON.stringify(charts));
  }

  res.status(200).json({
    success: true,
    charts,
  });
});
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

export const getLinecharts = TryCatch(async (req, res, next) => {
  let charts;

  const key = "admin-line-charts";

  if (myCache.has(key)) {
    charts = JSON.parse(myCache.get(key) as string);
  } else {
    const today = new Date();

    // 12 month ago
    const twelveMonthAgo = new Date();
    twelveMonthAgo.setMonth(twelveMonthAgo.getMonth() - 12);

    const baseQuery = {
      createdAt: {
        $gte: twelveMonthAgo,
        $lte: today,
      },
    };

    const [products, users, orders] = await Promise.all([
      Product.find(baseQuery).select("createdAt"),
      User.find(baseQuery).select("createdAt"),
      Order.find(baseQuery).select(["createdAt","discount","total"]),
    ]);

    const productCounts = dashBoardBarChart({ length: 12, docArr: products, today,});

    const userCounts = dashBoardBarChart({ length: 12, docArr: users, today });

    const discount = dashBoardBarChart({ length: 12, docArr: orders, today, property : "discount", });

    const revenue = dashBoardBarChart({ length: 12, docArr: orders, today, property : "total", });


    charts = {
      users: userCounts,
      products: productCounts,
      discount,
      revenue ,
    };

    myCache.set(key, JSON.stringify(charts));
  }

  res.status(200).json({
    success: true,
    charts,
  });
});

//////////////////////////////////////////////////////////////////////////////////////////
