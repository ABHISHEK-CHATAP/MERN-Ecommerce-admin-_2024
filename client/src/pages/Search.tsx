import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { CustomError } from "../Types/api-types";
import { cartItem } from "../Types/types";
import { Skeleton } from "../components/loader/Loader";
import ProductCard from "../components/product-card/Product-card";
import {
  useCategoriesQuery,
  useSearchProductsQuery,
} from "../redux/api/productAPI";
import { addToCart } from "../redux/reducer/cartReducer";

const Search = () => {
  const dispatch = useDispatch();

  const {
    data: categoriesResponse,
    isLoading: categoryLoading,
    isError,
    error,
  } = useCategoriesQuery("");

  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const {
    isLoading: productLoading,
    data: searchedData,
    isError: productIsError,
    error: productError,
  } = useSearchProductsQuery({ search, sort, category, page, price: maxPrice });
  // console.log("search data :",searchedData);

  const addToCartHandler = (cartItem : cartItem) => {
    if(cartItem.stock < 1) return toast.error("Out of stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to Cart");
  };

  const isPrevPage = page > 1;
  const isNextPage = page < 4;

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  if (productIsError) {
    const err = productError as CustomError;
    toast.error(err.data.message);
  }

  return (
    <>
      <div className="product-search-page">
        {/* aside  */}
        <aside>
          <h2>Filters</h2>
          <div>
            <h4>Sort</h4>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="">Default</option>
              <option value="asc">Price (Low to High)</option>
              <option value="dsc">Price (High to Low)</option>
            </select>
          </div>
          <div>
            <h4>Max Price : {maxPrice || ""}</h4>
            <input
              type="range"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              min={100}
              max={100000}
            />
          </div>
          <div>
            <h4>Category</h4>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">ALL</option>
              {!categoryLoading &&
                categoriesResponse?.categories.map((i) => (
                  <option key={i} value={i}>
                    {i.toUpperCase()}
                  </option>
                ))}
            </select>
          </div>
        </aside>

        {/* main  */}
        <main>
          <h1>Products</h1>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="search by name.."
          />

          {productLoading ? (
            <Skeleton length={15} />
          ) : (
            <div className="search-product-list">
              {searchedData?.products.map((i) => (
                <ProductCard
                  key={i._id}
                  productId={i._id}
                  photo={i.photo}
                  name={i.name}
                  price={i.price}
                  stock={i.stock}
                  handler={addToCartHandler}
                />
              ))}
            </div>
          )}

          {/* pagination  */}
          {searchedData && searchedData.totalPage > 1 && (
            <article>
              <button
                onClick={() => setPage((prev) => prev - 1)}
                disabled={!isPrevPage}
              >
                Prev
              </button>{" "}
              <span>
                {page} of {searchedData.totalPage}
              </span>{" "}
              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={!isNextPage}
              >
                Next
              </button>
            </article>
          )}
        </main>
      </div>
    </>
  );
};

export default Search;
