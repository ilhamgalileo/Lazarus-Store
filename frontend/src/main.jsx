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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='' element={<PrivateRoute />} >
        <Route path='/profile' element={<Profile />}>
        </Route>
      </Route>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
    </Route>
  )
)


ReactDOM.createRoot(document.getElementById("root")).render(
  < Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)