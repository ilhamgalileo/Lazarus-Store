import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/loader";
import { setCredientials } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";
import { useProfileMutation } from "../../redux/api/usersApiSlice";

const Profile = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { userInfo } = useSelector(state => state.auth);

    const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();

    useEffect(() => {
        if (userInfo) {
            setUsername(userInfo.user.username);
            setEmail(userInfo.user.email);
        }
    }, [userInfo]);

    const dispatch = useDispatch();
    const submitHandler = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Password does not match");
            return;
        }

        try {
            const res = await updateProfile({
                _id: userInfo._id,
                username,
                email,
                password
            }).unwrap();
            dispatch(setCredientials({ ...res }));
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error(error?.data?.message || error.message);
        }
    };

    return (
        <div className="container mx-auto p-6 mt-[5rem] max-w-lg">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Update Profile</h2>
            <form onSubmit={submitHandler} className="space-y-4 bg-white p-6 rounded-lg shadow-lg">
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Name</label>
                    <input
                        type="text"
                        placeholder="Enter Name"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-orange-500"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Email</label>
                    <input
                        type="email"
                        placeholder="Enter email"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-orange-500"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Password</label>
                    <input
                        type="password"
                        placeholder="Enter password"
                        className="w-full p-3 border border-gray-300 rounded-md "
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Confirm Password</label>
                    <input
                        type="password"
                        placeholder="Confirm password"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-orange-500"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="flex justify-between">
                    <button
                        type="submit"
                        className="w-full bg-orange-600 text-white py-3 rounded-md hover:bg-orange-700 transition duration-200"
                        disabled={loadingUpdateProfile}
                    >
                        {loadingUpdateProfile ? 'Updating...' : 'Update'}
                    </button>
                </div>
            </form>
            <div className="text-center mt-4">
                <Link
                    to='/user-orders'
                    className="text-orange-600 font-semibold hover:underline"
                >
                    View My Orders
                </Link>
            </div>
            {loadingUpdateProfile && <Loader />}
        </div>
    );
};

export default Profile;
