import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 px-6 mt-[1rem] min-h-[4rem]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[4rem]">
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {["Favorite", "Register", "Get Your Order"].map((item, index) => (
              <li key={index}>
                <a href={`/${item.toLowerCase().replace(" ", "-")}`} className="hover:text-orange-600">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Schedule</h3>
          {[
            { title: "Address:", content: "Ganeas, Sumedang Utara, Jawa Barat, Indonesia" },
            {
              title: "Shipping:",
              content: "Mon - Sat: Orders before 12 noon (WIB) will be shipped that day\nSun - Holidays: Closed (no shipping)"
            },
            {
              title: "Customer Services:",
              content: "Mon - Fri: 9AM - 4PM WIB\nSat: 8AM - 1PM WIB\nSlow response on holidays and non-working hours."
            }
          ].map((item, index) => (
            <div key={index} className="mt-4">
              <h4 className="font-medium">{item.title}</h4>
              <p className="text-sm whitespace-pre-line">{item.content}</p>
            </div>
          ))}
        </div>

        <div className="sm:col-span-2 lg:col-span-1 text-sm">
          © 2025, Lazarus Store.
        </div>
      </div>
    </footer>
  );
};

export default Footer