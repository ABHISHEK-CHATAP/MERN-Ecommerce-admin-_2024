import "./styles/App.scss";
import { Toaster } from "react-hot-toast";
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Loader from "./components/loader/Loader";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useDispatch, useSelector } from "react-redux";
import { userExist, userNotExist } from "./redux/reducer/userReducer";
import { getUser } from "./redux/api/userAPI";
import Header from "./components/header/Header";
import { userReducerInitialState } from "./Types/reducer-types";
import ProtectedRoute from "./components/protected-route";

const Login = lazy(() => import("./pages/Login"));
const Home = lazy(() => import("./pages/Home"));
const Search = lazy(() => import("./pages/Search"));
const Cart = lazy(() => import("./pages/Cart"));
const Shipping = lazy(() => import("./pages/Shipping"));
const Orders = lazy(() => import("./pages/Orders"));
const OrderDetails = lazy(() => import("./pages/Orders-Details"));
const CheckOut = lazy(() => import("./pages/checkout"));
const NotFound = lazy(() => import("./pages/NotFound"));

//removing unused lines of code or formatting with sequentially
//[ alt + shift + o ]

// admin routes importing ...
const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const Products = lazy(() => import("./pages/admin/products"));
const Customers = lazy(() => import("./pages/admin/customers"));
const Transaction = lazy(() => import("./pages/admin/transaction"));
const Barcharts = lazy(() => import("./pages/admin/charts/barcharts"));
const Piecharts = lazy(() => import("./pages/admin/charts/piecharts"));
const Linecharts = lazy(() => import("./pages/admin/charts/linecharts"));
const Coupon = lazy(() => import("./pages/admin/apps/coupon"));
const Stopwatch = lazy(() => import("./pages/admin/apps/stopwatch"));
const Toss = lazy(() => import("./pages/admin/apps/toss"));
const NewProduct = lazy(() => import("./pages/admin/management/newproduct"));
const ProductManagement = lazy(
  () => import("./pages/admin/management/productmanagement")
);
const TransactionManagement = lazy(
  () => import("./pages/admin/management/transactionmanagement")
);

function App() {
  // const loading = "";
  const { user , loading} = useSelector(
    (state: { userReducer: userReducerInitialState }) => state.userReducer
  );
  const dispatch = useDispatch();

  useEffect(() => {
    // these (user) from firebase , different than useSelector (user)
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const data = await getUser(user.uid);
        console.log("logged In");
        dispatch(userExist(data.user));
      } else {
        console.log("Not logged In");
        dispatch(userNotExist());
      }
    });
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Router>
          {/* header  */}
          <Suspense fallback={<Loader />}>
            <Header user={user} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/cart" element={<Cart />} />

              {/* ProtectedRoute => Childern  */}
              <Route
                path="/login"
                element={
                  <ProtectedRoute isAuthenticated={user ? false : true}>
                    <Login />
                  </ProtectedRoute>
                }
              />

              {/* ProtectedRoute => Outlet - react-router-dom  */}

              {/* logged in user routes  --  above 3 routes dont required login any can access */}
              {/* without logged in [shipping-orders ] page not possible to view */}
              <Route
                element={
                  <ProtectedRoute isAuthenticated={user ? true : false} />
                }
              >
                <Route path="/shipping" element={<Shipping />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/:id" element={<OrderDetails />} />
                <Route path="/pay" element={<CheckOut />} />
              </Route>

              {/* admin routes  */}
              <Route
                element={
                  <ProtectedRoute
                    isAuthenticated={true}
                    adminOnly={true}
                    admin={user?.role === "admin" ? true : false}
                  />
                }
              >
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/product" element={<Products />} />
                <Route path="/admin/customer" element={<Customers />} />
                <Route path="/admin/transaction" element={<Transaction />} />
                {/* Charts */}
                <Route path="/admin/chart/bar" element={<Barcharts />} />
                <Route path="/admin/chart/pie" element={<Piecharts />} />
                <Route path="/admin/chart/line" element={<Linecharts />} />
                {/* Apps */}
                <Route path="/admin/app/coupon" element={<Coupon />} />
                <Route path="/admin/app/stopwatch" element={<Stopwatch />} />
                <Route path="/admin/app/toss" element={<Toss />} />

                {/* Management */}
                <Route path="/admin/product/new" element={<NewProduct />} />
                <Route
                  path="/admin/product/:id"
                  element={<ProductManagement />}
                />
                <Route
                  path="/admin/transaction/:id"
                  element={<TransactionManagement />}
                />
              </Route>
              {/* admin routes end */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Toaster position="top-center" />
        </Router>
      )}
    </>
  );
}

export default App;
