import React from "react";
import { Link } from "react-router-dom";
import logo from "./assets/galileo2.png";

const AboutUs = () => {
    return (
        <div className="flex flex-col min-h-screen ml-[4rem] text-gray-800">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 sticky top-0 z-50 bg-[#f0f0ef]">
                <div className="flex items-center gap-8">
                    <Link to="/">
                        <img src={logo} alt="Logo" className="w-32 h-32 object-contain" />
                    </Link>
                    <nav className="flex items-center gap-6">
                        <Link to="/shop" className="text-lg font-semibold hover:text-orange-600">
                            All Products
                        </Link>
                        <Link to="/about" className="text-lg font-semibold text-orange-600">
                            About Us
                        </Link>
                    </nav>
                </div>
            </header>

            <div className="flex-grow p-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl font-bold text-orange-500 mb-5">About Us</h1>
                    <p className="text-lg mb-6 leading-relaxed">
                        <strong>Galileo Store</strong> is a PC Hardware, Peripherals, Accessories store that provides a variety of high-quality components
                        for gaming, productivity, and professional workstations. We are committed to providing the shopping experience with competitive pricing and responsive customer service.
                    </p>

                    <h2 className="text-3xl font-semibold text-orange-400 mt-8 mb-4">Why Choose Us?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-lg">
                        {[
                            { title: "Product Quality", desc: "We strictly select what products can be sold to our store." },
                            { title: "Affordable Pricing", desc: "Offer competitive prices." },
                            { title: "Professional Service", desc: "Our team is ready to help you choose the right components." },
                            { title: "Authorized Warranty", desc: "All products come with a warranty for your shopping safety." },
                            { title: "Fast & Secure Delivery", desc: "Orders are securely packed and delivered on time." }
                        ].map((item, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <span className="text-orange-400 text-2xl">✔</span>
                                <p>
                                    <strong>{item.title}</strong> <br />– {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-3xl font-semibold text-orange-400 mt-8 mb-4">Vision & Mission</h2>
                    <p className="text-lg mb-4">💡 <strong>Vision:</strong> To be the best PC hardware store with the best products and services.</p>
                    <p className="text-lg mb-6">🎯 <strong>Mission:</strong> Helping customers build their dream PC with the best quality.</p>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-700 py-6 text-center text-gray-400">
                <p>&copy; {new Date().getFullYear()} Lazarus Store. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default AboutUs;