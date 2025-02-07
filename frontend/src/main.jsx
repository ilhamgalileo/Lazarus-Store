import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Route, RouterProvider, createRoutesFromElements } from 'react-router'
import { createBrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store.js'
import Profile from './pages/user/Profile.jsx'
import PrivateRoute from './components/privateRoute.jsx'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import AdminRoute from './pages/admin/AdminRoute.jsx'
import UserList from './pages/admin/UserList.jsx'
import CategoryList from './pages/admin/CategoryList.jsx'
import ProductList from './pages/admin/ProductList.jsx'
import ProductUpdate from './pages/admin/ProductUpdate.jsx'
import AllProducts from './pages/admin/AllProducts.jsx'
import Home from './pages/Home.jsx'
import Favorites from './pages/Products/Favorites.jsx'
import ProductDetail from './pages/Products/ProductDetail.jsx'
import Cart from './pages/Cart.jsx'
import Shop from './pages/Shop.jsx'
import Shipping from './pages/orders/Shipping.jsx'
import PlaceOrder from './pages/orders/PlaceOrder.jsx'
import Order from './pages/orders/Order.jsx'
import UserOrder from './pages/user/UserOrder.jsx'
import OrderList from './pages/admin/OrderList.jsx'
import CashOrder from './pages/orders/cashOrder.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import PlaceOrderCash from './pages/orders/placeOrderCash.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route index={true} path='/' element={<Home />} />
      <Route path='/favorite' element={<Favorites />} />
      <Route path='/product/:id' element={<ProductDetail />} />
      <Route path='/cart' element={<Cart />} />
      <Route path='/shop' element={<Shop />} />
      <Route path='/user-orders' element={<UserOrder />} />

      <Route path='' element={<PrivateRoute />} >
        <Route path='/profile' element={<Profile />} />
        <Route path='/shipping' element={<Shipping />} />
        <Route path='/placeorder' element={<PlaceOrder />} />
        <Route path='/placeorder/cash' element={<PlaceOrderCash />} />
        <Route path='/order/:id' element={<Order />} />
        <Route path='/order/:id/cash' element={<CashOrder />} />
      </Route>

      {/* admin */}
      <Route path='/admin' element={<AdminRoute />}>
        <Route path='userlist' element={<UserList />} />
        <Route path='categorylist' element={<CategoryList />} />
        <Route path='productlist' element={<ProductList />} />
        <Route path='orderlist' element={<OrderList />} />
        <Route path='allproductslist' element={<AllProducts />} />
        <Route path='product/update/:id' element={<ProductUpdate />} />
        <Route path='dashboard' element={<AdminDashboard />} />
      </Route>
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById("root")).render(
  < Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)