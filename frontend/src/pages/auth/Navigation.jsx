import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaHeart, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from '../../redux/features/auth/authSlice';
import FavoritesCount from "../Products/favoritesCount";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
      if (error?.status === 403 || error?.status === 401) {
        dispatch(logout());
        navigate("/login");
      }
    }
  };

  return (
    <div
      style={{ zIndex: 99 }}
      className={`${showSidebar ? "hidden" : "flex"} 
        xl:flex lg:flex md:hidden sm:hidden flex-col justify-between p-4 text-white bg w-[10%] hover:w-[10%] h-[100vh] fixed`}
      id="navigation-container"
    >
      <div className="flex flex-col justify-center space-y-4">
        <Link to="/" className="flex relative">
          <div className="flex items-center transition-transform transform hover:translate-x-2">
            <AiOutlineHome className="mr-2 mt-[3rem]" size={20} />
            <span className="hidden nav-item-name mt-[3rem] text-sm">Home</span>
          </div>
        </Link>

        <Link to="/shop" className="flex relative">
          <div className="flex items-center transition-transform transform hover:translate-x-2">
            <AiOutlineShopping className="mr-2 mt-[3rem]" size={20} />
            <span className="hidden nav-item-name text-sm mt-[3rem]">Shop</span>
          </div>
        </Link>

        <Link to="/cart" className="flex relative">
          <div className="flex items-center transition-transform transform hover:translate-x-2">
            <AiOutlineShoppingCart className="mr-2 mt-[3rem]" size={20} />
            <span className="hidden nav-item-name text-sm mt-[3rem]">Cart</span>
            <div className="absolute left-3 top-10">
              {cartItems.length > 0 && (
                <span className="px-1 py-0 text-xs text-white bg-orange-500 rounded-full w-4 h-4 flex items-center justify-center">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </div>
          </div>
        </Link>

        <Link to="/favorite" className="flex relative">
          <div className="flex justify-center items-center transition-transform transform hover:translate-x-2">
            <FaHeart className="mt-[3rem] mr-2" size={20} />
            <span className="hidden nav-item-name text-sm mt-[3rem]">Favorites</span>
            <FavoritesCount />
          </div>
        </Link>
      </div>

      <div className="relative">
        {userInfo ? (
          <div className="relative inline-block text-left">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center p-2 rounded-lg hover:bg-gray-700/50 transition-colors duration-200 min-w-[2.5rem]"
            >
              <FaUserCircle className="text-white" size={24} />
              <span className="hidden nav-item-name text-sm ml-2 truncate max-w-[100px]">
                {userInfo.user.username}
              </span>
            </button>

            {dropdownOpen && (
              <div
                className="absolute left-0 bottom-full mb-2 w-48 bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
              >
                <div className="py-1" role="none">
                  {userInfo.user.isAdmin && (
                    <>
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-700 rounded-t-lg"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/admin/productlist"
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                      >
                        Products
                      </Link>
                      <Link
                        to="/admin/categorylist"
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                      >
                        Category
                      </Link>
                      <Link
                        to="/admin/orderlist"
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                      >
                        Orders
                      </Link>
                    </>
                  )}
                  {userInfo.user.superAdmin && (
                    <Link
                      to="/admin/userlist"
                      className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                    >
                      Users
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={logoutHandler}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 rounded-b-lg"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <ul className="space-y-2">
            <li>
              <Link to="/login" className="flex relative">
                <div className="flex items-center mt-5 transition-transform transform hover:translate-x-2">
                  <AiOutlineLogin className="mr-2" size={26} />
                  <span className="hidden nav-item-name text-sm">LOGIN</span>
                </div>
              </Link>
            </li>
            <li>
              <Link to="/register" className="flex relative">
                <div className="flex items-center mt-5 transition-transform transform hover:translate-x-2">
                  <AiOutlineUserAdd className="mr-2" size={26} />
                  <span className="hidden nav-item-name text-sm">REGISTER</span>
                </div>
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Navigation;