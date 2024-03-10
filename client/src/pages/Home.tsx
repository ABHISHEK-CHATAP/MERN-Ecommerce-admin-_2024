import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { cartItem } from "../Types/types";
import { Skeleton } from "../components/loader/Loader";
import ProductCard from "../components/product-card/Product-card";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import { addToCart } from "../redux/reducer/cartReducer";

const Home = () => {
  const { data, isLoading, isError } = useLatestProductsQuery("");

  const dispatch = useDispatch();

  if(isError){
    toast.error("can't fetch the products");
    //agar return kia toh puri screen blank ho jayegi & above error dikhayegi
    //return nhi kia toh home page load hoga bs products nhi dhikhnge & above error show hoga
  }

  const addToCartHandler = (cartItem : cartItem) => {
    if(cartItem.stock < 1) return toast.error("Out of stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to Cart");
  };

  return (
    <>
      <div className="home">
        <section>{/* home img  */}</section>

        <h1>
          Latest Products
          <Link to={"/search"}>More</Link>
        </h1>
        {/* product card  */}
        <main>
          {isLoading ? (<Skeleton width="80vw"/>) : (data?.products.map((p) => {
            return (
              <ProductCard
                key={p._id}
                productId={p._id}
                photo={p.photo}
                name={p.name}
                price={p.price}
                stock={p.stock}
                handler={addToCartHandler}
              />
            );
          }))
          }
        </main>
      </div>
    </>
  );
};

export default Home;
