import { FaPlus } from "react-icons/fa";
import { server } from "../../redux/store";
import { cartItem } from "../../Types/types";

type ProductProps = {
  productId: string;
  photo: string;
  name: string;
  price: number;
  stock: number;
  handler: (cartItem: cartItem) => string | undefined;
};

const ProductCard = ({
  productId,
  price,
  photo,
  name,
  stock,
  handler,
}: ProductProps) => {
  return (
    <>
      <div className="product-card">
        <img src={`${server}/${photo}`} alt={name} />
        <p>{name}</p>
        <span> ₹ {price}</span>
        <div>
          <button
            onClick={() => handler({ productId, price, photo, name, stock,quantity : 1 })}
          >
            <FaPlus />
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
