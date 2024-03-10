import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { server } from "../../redux/store";
import { cartItem } from "../../Types/types";

type CartItemsProps = {
    cartItem : cartItem;
    IncrementQuantity : (cartItem: cartItem) => void;
    decrementQuantity : (cartItem: cartItem) => void;
    RemoveHandler : (id : string) => void;
}

const CartItem = ({cartItem, IncrementQuantity, decrementQuantity, RemoveHandler}:CartItemsProps) => {

    const {productId,name,photo,price,quantity}=cartItem;

  return (
    <>
    <div className="cart-item">
        <img src={`${server}/${photo}`} alt={name} />
        <article>
            <Link to={`/product/${productId}`}>{name}</Link>
            <span>₹ {price}</span>
        </article>
        <div>
            <button onClick={()=>decrementQuantity(cartItem)}>-</button>
            <p>{quantity}</p>
            <button onClick={()=>IncrementQuantity(cartItem)}>+</button>
        </div>
        <button onClick={()=>RemoveHandler(productId)}><FaTrash/></button>
    </div> 
    </>
  )
}

export default CartItem
