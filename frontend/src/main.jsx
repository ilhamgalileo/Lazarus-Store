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
import Home from './Home.jsx'
import Favorites from './pages/Products/Favorites.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route index={true} path='/' element={<Home />} />
      <Route path='/favorite' element={<Favorites />} />

      <Route path='' element={<PrivateRoute />} >
        <Route path='/profile' element={<Profile />} />
      </Route>

      {/* admin */}
      <Route path='/admin' element={<AdminRoute />}>
        <Route path='userlist' element={<UserList />} />
        <Route path='categorylist' element={<CategoryList />} />
        <Route path='productlist' element={<ProductList />} />
        <Route path='allproductslist' element={<AllProducts />} />
        <Route path='product/update/:id' element={<ProductUpdate />} />

      </Route>
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById("root")).render(
  < Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)