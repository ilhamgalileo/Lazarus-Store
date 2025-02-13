import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaTimes, FaBars } from "react-icons/fa";

const AdminMenu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <button
                className={`fixed top-5 right-7 bg-[#151515] p-3 rounded-lg z-50 transition-all duration-300 ${
                    isMenuOpen ? "transform rotate-90" : ""
                }`}
                onClick={toggleMenu}
            >
                {isMenuOpen ? (
                    <FaTimes className="text-white text-xl" />
                ) : (
                    <FaBars className="text-white text-xl" />
                )}
            </button>

            {/* Overlay */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={toggleMenu}
                ></div>
            )}

            {/* Menu */}
            <section
                className={`fixed top-0 right-0 h-full bg-[#151515] w-64 z-50 transform transition-transform duration-300 ${
                    isMenuOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="p-4">
                    <h2 className="text-white text-xl font-bold mb-4">Admin Menu</h2>
                    <ul className="list-none">
                        <li>
                            <NavLink
                                className="block py-2 px-3 mb-3 hover:bg-[#2E2D2D] rounded-sm transition-colors duration-200"
                                to="/admin/dashboard"
                                style={({ isActive }) => ({
                                    color: isActive ? "orange" : "white",
                                })}
                                onClick={toggleMenu}
                            >
                                Admin Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                className="block py-2 px-3 mb-3 hover:bg-[#2E2D2D] rounded-sm transition-colors duration-200"
                                to="/admin/categorylist"
                                style={({ isActive }) => ({
                                    color: isActive ? "orange" : "white",
                                })}
                                onClick={toggleMenu}
                            >
                                Create Category
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                className="block py-2 px-3 mb-3 hover:bg-[#2E2D2D] rounded-sm transition-colors duration-200"
                                to="/admin/productlist"
                                style={({ isActive }) => ({
                                    color: isActive ? "orange" : "white",
                                })}
                                onClick={toggleMenu}
                            >
                                Create Product
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                className="block py-2 px-3 mb-3 hover:bg-[#2E2D2D] rounded-sm transition-colors duration-200"
                                to="/admin/allproductslist"
                                style={({ isActive }) => ({
                                    color: isActive ? "orange" : "white",
                                })}
                                onClick={toggleMenu}
                            >
                                All Products
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                className="block py-2 px-3 mb-3 hover:bg-[#2E2D2D] rounded-sm transition-colors duration-200"
                                to="/admin/userlist"
                                style={({ isActive }) => ({
                                    color: isActive ? "orange" : "white",
                                })}
                                onClick={toggleMenu}
                            >
                                Manage Users
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                className="block py-2 px-3 mb-3 hover:bg-[#2E2D2D] rounded-sm transition-colors duration-200"
                                to="/admin/orderlist"
                                style={({ isActive }) => ({
                                    color: isActive ? "orange" : "white",
                                })}
                                onClick={toggleMenu}
                            >
                                Manage Orders
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </section>
        </>
    );
};

export default AdminMenu;