import { useSelector } from "react-redux";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { BarChart } from "../../../components/admin/Charts";
import { RootState } from "../../../redux/store";
import { useBarQuery } from "../../../redux/api/dashboardAPI";
import { Skeleton } from "../../../components/loader/Loader";
import toast from "react-hot-toast";
import { CustomError } from "../../../Types/api-types";
import { getLastMonths } from "../../../utils/featues";


// with using moment.js esay to find last 6 and 12 months array ::
const { last12Months, last6Months } = getLastMonths();
// console.log("months", last12Months, "last 6 :", last6Months);

const Barcharts = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const { data, isError, isLoading, error } = useBarQuery(user?._id!);

  const products = data?.charts.products || [];
  const orders = data?.charts.orders || [];
  const users = data?.charts.users || [];

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h1>Bar Charts</h1>
        {isLoading ? (
          <Skeleton length={20} />
        ) : (
          <>
            <section>
              <BarChart
                data_2={products}
                data_1={users}
                labels={last6Months}
                title_1="Products"
                title_2="Users"
                bgColor_1={`hsl(260, 50%, 30%)`}
                bgColor_2={`hsl(360, 90%, 90%)`}
              />
              <h2>Top Products & Top Customers</h2>
            </section>

            <section>
              <BarChart
                horizontal={true}
                data_1={orders}
                data_2={[]}
                title_1="Orders"
                title_2=""
                bgColor_1={`hsl(180, 40%, 50%)`}
                bgColor_2=""
                labels={last12Months}
              />
              <h2>Orders throughout the year</h2>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Barcharts;
