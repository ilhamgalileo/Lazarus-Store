import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useLoginMutation } from "../../redux/api/usersApiSlice"
import { setCredentials } from "../../redux/features/auth/authSlice"
import { toast } from "react-toastify"
import Loader from "../../components/loader"

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [login, { isLoading }] = useLoginMutation()

    const { userInfo } = useSelector(state => state.auth)

    const location = useLocation()  // Use useLocation to get the current URL location
    const sp = new URLSearchParams(location.search)
    const redirect = sp.get('redirect') || '/'

    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [navigate, redirect, userInfo])

    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            const userData = await login({ email, password }).unwrap()
            dispatch(setCredentials(userData))
            navigate(redirect)
        } catch (err) {
            toast.error(err?.data?.message || 'Invalid credentials')
        }
    }

    return (
        <div>
            <section className="pl-[10rem] flex flex-wrap">
                <div className="mr-[4rem] mt-[5rem]">
                    <h1 className="text-2xl font-semibold mb-4">Sign In</h1>

                    <form className="container w-[40rem]" onSubmit={submitHandler}>
                        <div className="my-[2rem]">
                            <label htmlFor="email" className="block text-sm font-medium text-black">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="mt-1 p-2 border rounded w-full"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="my-[2rem]">
                            <label htmlFor="password" className="block text-sm font-medium text-black">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="mt-1 p-2 border rounded w-full"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            disabled={isLoading}
                            type="submit"
                            className="bg-pink-500 text-black px-4 py-2 rounded cursor-pointer my-[1rem]"
                        >
                            {isLoading ? "Signing..." : "Sign In"}
                        </button>
                        {isLoading && <Loader />}
                    </form>

                    <div className="mt-4">
                        <p className="text-black">
                            New Customer?{" "}
                            <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="text-pink-500 hover:underline">
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Login
