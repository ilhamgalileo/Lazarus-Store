import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { FaTrash } from "react-icons/fa"
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice"

const Cart = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart

  const userLogin = useSelector((state) => state.auth)
  const { userInfo } = userLogin

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }))
  }

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id))
  }

  const checkoutHandler = () => {
    if (userInfo) {
      navigate("/shipping")
    } else {
      navigate("/login?redirect=/shipping")
    }
  }

  return (
    <>
      <div className="container flex justify-around items-start wrap mx-auto mt-8">
        {cartItems.length === 0 ? (
          <div className="text-gray-800">
            Your cart is empty <Link to="/shop" className="hover:text-orange-500 font-bold">Go To Shop</Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col w-[80%] text-gray-950">
              <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>

              {cartItems.map((item) => (
                <div key={item._id} className="flex items-enter mb-[1rem] pb-2">
                  <div className="w-[5rem] h-[5rem]">
                    <img
                      src={item?.images[0]}
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>

                  <div className="flex-1 ml-4">
                    <Link 
                    to={`/product/${item._id}`} 
                    className="text-orange-600 hover:underline hover:underline-offset-2">
                      {item.name}
                    </Link>

                    <div className="mt-2">{item.brand}</div>
                    <div className="mt-2 font-bold">
                      Rp{new Intl.NumberFormat('id-ID').format(item.price)}
                    </div>
                  </div>

                  <div className="w-24">
                    <select
                      className="w-full p-1 border rounded text-black"
                      value={item.qty}
                      onChange={(e) =>
                        addToCartHandler(item, Number(e.target.value))
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <button
                      className="text-red-500 mr-[5rem]"
                      onClick={() => removeFromCartHandler(item._id)}
                    >
                      <FaTrash className="ml-[1rem] mt-[.5rem]" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="mt-8 w-[40rem]">
                <div className="p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">
                    Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                  </h2>

                  <div className="text-2xl font-bold">
                    RP.{new Intl.NumberFormat('id-ID').format(cartItems
                      .reduce((acc, item) => acc + item.qty * item.price, 0)
                    )}
                  </div>

                  <button
                    className="bg-orange-500 mt-4 py-2 px-4 text-gray-100 rounded-full text-lg w-full"
                    disabled={cartItems.length === 0}
                    onClick={checkoutHandler}
                  >
                    processed To Checkout
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default Cart