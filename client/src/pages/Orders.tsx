import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import { CustomError } from "../Types/api-types";
import { userReducerInitialState } from "../Types/reducer-types";
import TableHOC from "../components/admin/TableHOC";
import { Skeleton } from "../components/loader/Loader";
import { useMyOrdersQuery } from "../redux/api/orderAPI";

type DataType = {
  _id: string;
  amount: number;
  quantity: number;
  discount: number;
  status: ReactElement;
  action: ReactElement;
};

const column: Column<DataType>[] = [
  {
    Header: "ID",
    accessor: "_id",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Orders = () => {
  const [rows, setRows] = useState<DataType[]>([]);

  const { user } = useSelector(
    (state: { userReducer: userReducerInitialState }) => state.userReducer
  );

  const { data, isError, isLoading, error } = useMyOrdersQuery(user?._id!);

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  useEffect(() => {
    if (data) {
      setRows(
        data.orders.map((i) => ({
          _id: i._id,
          amount: i.total,
          discount: i.discount,
          quantity: i.orderItems ? i.orderItems.length : 0,
          status: (
            <span
              className={
                i.status === "Processing"
                  ? "red"
                  : i.status == "Shipped"
                  ? "green"
                  : "purple"
              }
            >
              {i.status}
            </span>
          ),
          action: <Link to={`/admin/transaction/${i._id}`}>Manage</Link>,
        }))
      );
    }
  }, [data]);

  const Table = TableHOC<DataType>(
    column,
    rows,
    "dashboard-product-box",
    "Orders",
    true
  )();

  return (
    <>
      <div className="orders-container">
        <h1>My Orders</h1>
        {isLoading ? <Skeleton length={20} /> : Table}
      </div>
    </>
  );
};

export default Orders;
