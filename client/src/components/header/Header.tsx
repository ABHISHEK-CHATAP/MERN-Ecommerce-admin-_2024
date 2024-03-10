import { useState } from "react";
import {
  FaSearch,
  FaShoppingBag,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { User } from "../../Types/types";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import toast from "react-hot-toast";

// const user = { _id: "", role: "user" };

interface PropsType {
  user : User  | null ;
}

const Header = ({user}: PropsType) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleLogOut = async() => {
    try {
      await signOut(auth);
      toast.success("log out successfully")
      setIsOpen(false);
    } catch (error) {
      toast.error("log out failed")
    }
  };

  return (
    <>
      <nav className="header">
        <Link onClick={() => setIsOpen(false)} to={"/"}>
          HOME{" "}
        </Link>
        <Link to={"/search"}>
          <FaSearch />
        </Link>
        <Link to={"/cart"}>
          <FaShoppingBag />
        </Link>
        {user?._id ? (
          <>
            <button onClick={() => setIsOpen((prev) => !prev)}>
              <FaUser />
            </button>
            <dialog open={isOpen}>
              <div>
                {user.role === "admin" && (
                  <Link to={"/admin/dashboard"}>Admin</Link>
                )}
                <Link to={"/orders"}>Orders</Link>
                <button onClick={() => handleLogOut()}>
                  <FaSignOutAlt />
                </button>
              </div>
            </dialog>
          </>
        ) : (
          <Link to={"/login"}>
            <FaSignInAlt />
          </Link>
        )}
      </nav>
    </>
  );
};

export default Header;
