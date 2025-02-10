import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-700 text-white py-8 px-6 mt-12">
      <div className="max-w-6xl mx-auto">
        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/favorite" className="hover:text-orange-600">Favorite</a></li>
              <li><a href="/register" className="hover:text-orange-600">Register</a></li>
              <li><a href="/user-orders" className="hover:text-orange-600">Get Your Order</a></li>
            </ul>
          </div>


          {/* Schedule */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Schedule</h3>
            <div>
              <h4 className="font-medium">Address:</h4>
              <p className="text-sm">
                Ganeas, Sumedang Utara, Jawa barat, Indonesia
              </p>
            </div>

            <div className="mt-4">
              <h4 className="font-medium">Shipping:</h4>
              <p className="text-sm">
                Mon - Sat: Orders made before 12 noon (WIB) will be shipped at that day<br />
                Sun - Holidays: Closed (no shipping)
              </p>
            </div>
            <div className="mt-4">
              <h4 className="font-medium">Customer Services:</h4>
              <p className="text-sm">
                Mon - Fri: 9AM - 4PM WIB<br />
                Sat: 8AM - 1PM WIB<br />
                Slow response on holidays and non-working hours.
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="text-sm">
              © 2025, Lazarus Store.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;