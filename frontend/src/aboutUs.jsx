import React from "react";
import { Link } from "react-router-dom";
import logo from "./assets/1-removebg-preview.png"; // Sesuaikan dengan path logo Anda

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-[#0f0f10] text-white p-8">
            {/* Header dengan Logo dan Navigasi */}
            <div className="flex items-center justify-between px-6 py-4 sticky top-0 z-50 bg-[#0f0f10] shadow-md">
                <div className="flex items-center gap-8">
                    <Link to="/">
                        <img src={logo} alt="Logo" className="w-32 h-32 object-contain" />
                    </Link>
                    <nav className="flex items-center gap-6">
                        <Link to="/products" className="text-lg font-semibold hover:text-orange-600">
                            All Products
                        </Link>
                        <Link to="/contact" className="text-lg font-semibold hover:text-orange-600">
                            Contact
                        </Link>
                        <Link to="/about" className="text-lg font-semibold text-orange-600">
                            About Us
                        </Link>
                    </nav>
                </div>
            </div>

            {/* Konten About Us */}
            <div className="max-w-4xl mx-auto mt-12 text-center">
                <h1 className="text-5xl font-bold text-orange-500 mb-6">About Us</h1>
                <p className="text-lg mb-6 leading-relaxed">
                    <strong>Lazarus Store</strong> adalah toko hardware PC yang menyediakan berbagai komponen berkualitas tinggi
                    untuk keperluan gaming, produktivitas, dan workstation profesional. Kami berkomitmen untuk memberikan pengalaman
                    belanja terbaik dengan harga kompetitif dan layanan pelanggan yang responsif.
                </p>

                <h2 className="text-3xl font-semibold text-orange-400 mt-8 mb-4 text-center">Mengapa Memilih Kami?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-lg text-gray-300">
                    <div className="flex items-center gap-3">
                        <span className="text-orange-400 text-2xl">✔</span>
                        <p><strong>Produk Berkualitas</strong> – Hanya dari brand terbaik seperti Intel, AMD, NVIDIA, ASUS, MSI, dan lainnya.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-orange-400 text-2xl">✔</span>
                        <p><strong>Harga Terjangkau</strong> – Menawarkan harga kompetitif dan promo menarik.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-orange-400 text-2xl">✔</span>
                        <p><strong>Pelayanan Profesional</strong> – Tim kami siap membantu Anda memilih komponen yang tepat.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-orange-400 text-2xl">✔</span>
                        <p><strong>Garansi Resmi</strong> – Semua produk memiliki garansi untuk keamanan belanja Anda.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-orange-400 text-2xl">✔</span>
                        <p><strong>Pengiriman Cepat & Aman</strong> – Pesanan dikemas dengan aman dan dikirim tepat waktu.</p>
                    </div>
                </div>

                <h2 className="text-3xl font-semibold text-orange-400 mt-8 mb-4">Visi & Misi</h2>
                <p className="text-lg mb-4">💡 <strong>Visi:</strong> Menjadi toko hardware PC terbaik dengan produk dan layanan terbaik.</p>
                <p className="text-lg mb-6">🎯 <strong>Misi:</strong> Membantu pelanggan membangun PC impian mereka dengan kualitas terbaik.</p>
            </div>

            {/* Footer */}
            <div className="mt-16 bg-[#18181a] py-6 text-center text-gray-400">
                <p>&copy; {new Date().getFullYear()} [Nama Toko Anda]. All rights reserved.</p>
            </div>
        </div>
    );
};

export default AboutUs;
