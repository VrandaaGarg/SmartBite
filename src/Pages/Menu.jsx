import React, { useState } from "react";
import { dishes } from "../Data/dishes";
import { menus } from "../Data/menus";
import { useCart } from "../Context/CartContext"; // ✅ make sure path is correct

const Menu = () => {
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [filter, setFilter] = useState({ type: "all", maxPrice: 1000 });
  const { addToCart } = useCart(); // ✅ from CartContext

  const getVegOrNonVeg = (dish) => {
    const vegKeywords = [
      "Paneer",
      "Dal",
      "Veg",
      "Chaas",
      "Lassi",
      "Rasmalai",
      "Gulab",
    ];
    return vegKeywords.some((word) =>
      dish.name.toLowerCase().includes(word.toLowerCase())
    )
      ? "veg"
      : "non-veg";
  };

  const filteredDishes = dishes.filter((dish) => {
    const matchMenu = selectedMenuId ? dish.menuId === selectedMenuId : true;
    const matchType =
      filter.type === "all" || getVegOrNonVeg(dish) === filter.type;
    const matchPrice = dish.price <= filter.maxPrice;
    return matchMenu && matchType && matchPrice;
  });

  const priceRanges = [
    { label: "All", max: 1000 },
    { label: "< ₹100", max: 100 },
    { label: "< ₹200", max: 200 },
    { label: "< ₹300", max: 300 },
    { label: "< ₹400", max: 400 },
  ];

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-red-700">
        Explore Our Menu
      </h1>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {menus.map((menu) => (
          <button
            key={menu.id}
            onClick={() =>
              setSelectedMenuId(menu.id === selectedMenuId ? null : menu.id)
            }
            className={`rounded-full px-6 py-3 text-sm font-semibold border-2 ${
              selectedMenuId === menu.id
                ? "bg-red-600 text-white border-red-600"
                : "bg-white text-red-600 border-red-300 hover:bg-red-50"
            } transition`}
          >
            {menu.icon} {menu.name}
          </button>
        ))}
      </div>

      {/* Veg / Non-Veg / Price Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="space-x-2">
          {["all", "veg", "non-veg"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter((f) => ({ ...f, type }))}
              className={`px-4 py-2 rounded ${
                filter.type === type
                  ? type === "veg"
                    ? "bg-green-600 text-white"
                    : type === "non-veg"
                    ? "bg-yellow-600 text-white"
                    : "bg-red-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {type === "all"
                ? "All"
                : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {priceRanges.map((range) => (
            <button
              key={range.label}
              onClick={() => setFilter((f) => ({ ...f, maxPrice: range.max }))}
              className={`px-4 py-2 rounded ${
                filter.maxPrice === range.max
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dish Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredDishes.map((dish) => (
          <div
            key={dish.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition flex flex-col"
          >
            <img
              src={dish.image}
              alt={dish.name}
              className="w-full h-40 object-cover rounded-t-xl"
            />
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-1">
                  {dish.name}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {dish.description}
                </p>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <span className="font-bold text-red-600">₹{dish.price}</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    getVegOrNonVeg(dish) === "veg"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {getVegOrNonVeg(dish).toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => addToCart(dish)}
                className="mt-4 w-full bg-yellow-400 text-black font-semibold py-2 rounded hover:bg-yellow-300 transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
