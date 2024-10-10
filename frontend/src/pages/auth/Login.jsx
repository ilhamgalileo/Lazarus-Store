import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useLoginMutation } from "../../redux/api/usersApiSlice"
import { setCredientials } from "../../redux/features/auth/authSlice"
import { toast } from "react-toastify"
import Loader from "../../components/Loader"

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [login, { isLoading }] = useLoginMutation()

    const { userInfo } = useSelector(state => state.auth)

    const { search } = useLoginMutation()
    const sp = new URLSearchParams(search)
    const redirect = sp.get('redirect') || '/'

    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [navigate, redirect, userInfo])
        const submitHandler = async (e) => {
            e.preventDefault()
            try {
                const res = await login({email, password}).unwrap()
                console.log(res)
                dispatch(setCredientials({user: res.user, token: res.token}))
            } catch (error) {
                toast.error(error?.data?.message || error.message)
            }
        } 

        return (
            <div className="flex justify-between items-center h-screen">
              <section className="pl-[5rem] flex flex-col items-center w-[50%]">
                <div className="mt-[2rem] w-full max-w-[40rem]"> {/* Mengatur lebar maksimal form */}
                  <h1 className="text-4xl font-semibold mb-6 text-center text-white">Sign In</h1> {/* Membesarkan ukuran font judul */}
                  
                  <form onSubmit={submitHandler} className="w-full">
                    <div className="my-[2rem]">
                      <label
                        htmlFor="email"
                        className="block text- font-medium text-white"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="mt-1 p-4 border rounded w-full text-lg"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
          
                    <div className="my-[2rem]">
                      <label
                        htmlFor="password"
                        className="block text-1xl font-medium text-white"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        className="mt-1 p-4 border rounded w-full text-lg"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
          
                    <button
                      disabled={isLoading}
                      type="submit"
                      className="bg-orange-600 text-white px-6 py-3 rounded cursor-pointer my-[1rem] w-full text-lg"
                    >
                      {isLoading ? "Signing..." : "Sign In"}
                    </button>
                    {isLoading && <Loader />}
                  </form>
          
                  <div className="mt-4 text-center">
                    <p className="text-white">
                      New Customer?{" "}
                      <Link
                        to={redirect ? `/register?redirect=${redirect}` : "/register"}
                        className="text-orange-600 hover:underline"
                      >
                        Register
                      </Link>
                    </p>
                  </div>
                </div>
              </section>
          
              <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80"
                alt="Sign In Background"
                className="h-[65rem] w-[50%] xl:block md:hidden sm:hidden rounded-lg object-cover"
              />
            </div>
          )
          
}
export default Login