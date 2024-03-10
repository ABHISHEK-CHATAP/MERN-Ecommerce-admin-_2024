import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
// import {faker} from "@faker-js/faker";
export const newProduct = TryCatch(async (req, res, next) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    if (!photo) {
        return next(new ErrorHandler("Please add Photo", 402));
    }
    if (!name || !price || !stock || !category) {
        rm(photo.path, () => {
            console.log("photo deleted..");
        });
        return next(new ErrorHandler("Please enter all fields", 402));
        // error dia but photo upload ho gyi => rm(fun )se ek bhi field na ho toh photo
        // upload bhi ho toh delete hot bs iss error me aaya toh
    }
    await Product.create({
        name,
        price,
        stock,
        category: category.toLocaleLowerCase(),
        photo: photo.path,
    });
    return res.status(200).json({
        success: true,
        message: "Product created successfully",
    });
});
/////////////////////////////////////////////////////////////////////////////////////////
// 1 => ascending
// -1 => descending
export const getlatestProduct = TryCatch(async (req, res, next) => {
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    //creating an error
    // throw new Error("error aaya");
    return res.status(200).json({
        success: true,
        message: "sorted latest descending products",
        products,
    });
});
/////////////////////////////////////////////////////////////////////////////////////////
export const getAllCategories = TryCatch(async (req, res, next) => {
    const categories = await Product.distinct("category");
    return res.status(200).json({
        success: true,
        message: "all categories",
        categories,
    });
});
/////////////////////////////////////////////////////////////////////////////////////////
export const getAdminProducts = TryCatch(async (req, res, next) => {
    const products = await Product.find({});
    return res.status(200).json({
        success: true,
        products,
    });
});
/////////////////////////////////////////////////////////////////////////////////////////
export const getSingleProduct = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const singleProduct = await Product.findById(id);
    if (!singleProduct)
        return next(new ErrorHandler("product not found", 404));
    return res.status(200).json({
        success: true,
        singleProduct,
    });
});
/////////////////////////////////////////////////////////////////////////////////////////
export const updateProduct = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    const product = await Product.findById(id);
    if (!product) {
        return next(new ErrorHandler("Product Id not found", 404));
    }
    if (!photo) {
        return next(new ErrorHandler("Please add Photo", 402));
    }
    if (photo) {
        //exlametory mark se undefined nhi hone wala ye
        rm(product.photo, () => {
            console.log("old photo deleted..");
        });
        product.photo = photo.path;
    }
    if (name)
        product.name = name;
    if (price)
        product.price = price;
    if (stock)
        product.stock = stock;
    if (category)
        product.category = category;
    await product.save();
    return res.status(201).json({
        success: true,
        message: "Product updated successfully",
    });
});
/////////////////////////////////////////////////////////////////////////////////////////
export const deleteProduct = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const singleProduct = await Product.findById(id);
    if (!singleProduct)
        return next(new ErrorHandler("product not found", 404));
    rm(singleProduct.photo, () => {
        console.log("product photo deleted..");
    });
    await singleProduct.deleteOne();
    return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
    });
});
/////////////////////////////////////////////////////////////////////////////////////////
export const searchProducts = TryCatch(async (req, res, next) => {
    const { search, sort, category, price } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;
    const baseQuery = {};
    if (search) {
        baseQuery.name = {
            $regex: search, // ?search=mac
            $options: "i", //lowercase only
        };
    }
    if (price) {
        baseQuery.price = {
            $lte: Number(price), // &price=4000
        };
    }
    if (category) {
        baseQuery.category = category;
    }
    // ------------------------------------------------------------------------        
    // const products = await Product.find(baseQuery).sort(
    //     sort && {price : sort === "asc" ? 1 : -1} 
    // ).limit(limit).skip(skip);
    // const filteredOnlyProducts = await Product.find(baseQuery);
    // ------------------------------------------------------------------------        
    // optimised above 2 [await] operations in => Promise.all
    // kyuki time consuming [ await freeze krta hai ], jb ek hoga nhi dusra chalega nhi
    const ProductPromise = Product.find(baseQuery)
        .sort(sort && { price: sort === "asc" ? 1 : -1 })
        .limit(limit)
        .skip(skip);
    const [products, filteredOnlyProducts] = await Promise.all([
        ProductPromise, Product.find(baseQuery)
    ]);
    const totalPage = Math.ceil(products.length / limit);
    return res.status(200).json({
        success: true,
        products,
        totalPage,
    });
});
/////////////////////////////////////////////////////////////////////////////////////////
// export const generateRandomProducts = async(count:number = 10)=>{
//     const products = [];
//     for(let i=0; i< count; i++){
//         const product = {
//             name : faker.commerce.productName(),
//             photo : "uploads\\58c155ab-f145-4768-a658-8c38827d13a7.png",
//             price : faker.commerce.price({min:1500, max:80000, dec:0}),
//             stock : faker.commerce.price({min:0, max:100, dec:0}),
//             category: faker.commerce.department(),
//             createdAt:new Date(faker.date.past()),
//             updatedAt:new Date(faker.date.recent()),
//             _v:0,
//         }
//         products.push(product);
//     }
//     await Product.create(products);
//     console.log({success:true});
// };
// generateRandomProducts(40);
// const deleteProducts = async(count:number = 10) =>{
//     const products = await Product.find({}).skip(5);
//     for(let i=0; i<products.length; i++){
//         const product = products[i];
//         await product.deleteOne();
//     }
//     console.log({success:true});
// }
// deleteProducts(35);
