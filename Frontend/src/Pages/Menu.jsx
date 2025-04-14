import React, { useState, useEffect } from "react";
// import { dishes } from "../Data/dishes";
import { menus } from "../Data/menus";
import { useCart } from "../Context/CartContext";
import { FaSearch, FaFilter, FaLeaf, FaDrumstickBite, FaUtensils } from "react-icons/fa";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../Context/ToastContext";

const Menu = () => {
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [filter, setFilter] = useState({ type: "all", maxPrice: 1000 });
  const [dishes, setDishes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();// 👈 your user context

  useEffect(() => {
    fetch("http://localhost:5000/api/dishes")
      .then((res) => res.json())
      .then((data) => setDishes(data))
      .catch((err) => {
        console.error("Error fetching dishes:", err);
        showToast("Failed to load dishes!", "error");
      });
  }, []);

  
  // Animation effect when component mounts or filters change
  useEffect(() => {
    setAnimateIn(false);
    const timer = setTimeout(() => setAnimateIn(true), 100);
    return () => clearTimeout(timer);
  }, [selectedMenuId, filter, searchQuery]);

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
      dish.Name.toLowerCase().includes(word.toLowerCase())
    )
      ? "veg"
      : "non-veg";
  };

  const handleAddToCart = (dish) => {
    if (!user) {
      showToast("Please login to add items to your cart", "error");
      navigate("/login");
      return;
    }
  
    addToCart(dish);
    showToast(`Added ${dish.Name} to cart`, "success");
  };
  

  const filteredDishes = dishes.filter((dish) => {
    const matchMenu = selectedMenuId ? dish.MenuID === selectedMenuId : true;
    const matchType =
      filter.type === "all" || getVegOrNonVeg(dish) === filter.type;
    const matchPrice = dish.Price <= filter.maxPrice;
    const matchSearch = searchQuery === "" || 
      dish.Name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      dish.Description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchMenu && matchType && matchPrice && matchSearch;
  });

  const priceRanges = [
    { label: "All", max: 1000 },
    { label: "< ₹100", max: 100 },
    { label: "< ₹200", max: 200 },
    { label: "< ₹300", max: 300 },
    { label: "< ₹400", max: 400 },
  ];

  const currentCategoryName = selectedMenuId 
    ? menus.find(menu => menu.id === selectedMenuId)?.name
    : "All Items";

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto">
      {/* Page Header with Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-red-700 mb-1">
            {currentCategoryName}
          </h1>
          <p className="text-gray-500">
            {filteredDishes.length} items available
          </p>
        </div>
        <div className="w-full md:w-auto flex">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-r-full border border-red-600 flex items-center gap-2"
          >
            <FaFilter /> {!showFilters ? "Filters" : "Hide"}
          </button>
        </div>
      </div>

      {/* Category Scrollable Filters */}
      <div className="mb-6 overflow-x-auto pb-2 hide-scrollbar">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => setSelectedMenuId(null)}
            className={`rounded-full px-6 py-3 text-sm font-semibold border-2 flex items-center gap-2 ${
              selectedMenuId === null
                ? "bg-red-600 text-white border-red-600 shadow-md"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            } transition-all duration-200`}
          >
            <FaUtensils className="text-lg" />
            All Categories
          </button>
          
          {menus.map((menu) => (
            <button
              key={menu.id}
              onClick={() => setSelectedMenuId(menu.id === selectedMenuId ? null : menu.id)}
              className={`rounded-full px-6 py-3 text-sm font-semibold border-2 flex items-center gap-2 ${
                selectedMenuId === menu.id
                  ? "bg-red-600 text-white border-red-600 shadow-md"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              } transition-all duration-200`}
            >
              <span className="text-lg">{menu.icon}</span>
              {menu.name}
            </button>
          ))}
        </div>
      </div>

      {/* Expanded Filter Options */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 transition-all duration-300">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Diet Type Filter */}
            <div className="flex-1">
              <h3 className="text-sm font-semibold mb-2 text-gray-700">Diet Type</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter((f) => ({ ...f, type: "all" }))}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    filter.type === "all"
                      ? "bg-red-100 text-red-800 font-medium"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <FaUtensils className={filter.type === "all" ? "text-red-600" : "text-gray-500"} />
                  All
                </button>
                <button
                  onClick={() => setFilter((f) => ({ ...f, type: "veg" }))}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    filter.type === "veg"
                      ? "bg-green-100 text-green-800 font-medium"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <FaLeaf className={filter.type === "veg" ? "text-green-600" : "text-gray-500"} />
                  Vegetarian
                </button>
                <button
                  onClick={() => setFilter((f) => ({ ...f, type: "non-veg" }))}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    filter.type === "non-veg"
                      ? "bg-yellow-100 text-yellow-800 font-medium"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <FaDrumstickBite className={filter.type === "non-veg" ? "text-yellow-600" : "text-gray-500"} />
                  Non-Vegetarian
                </button>
              </div>
            </div>
            
            {/* Price Filter */}
            <div className="flex-1">
              <h3 className="text-sm font-semibold mb-2 text-gray-700">Price Range</h3>
              <div className="flex flex-wrap gap-2">
                {priceRanges.map((range) => (
                  <button
                    key={range.label}
                    onClick={() => setFilter((f) => ({ ...f, maxPrice: range.max }))}
                    className={`px-4 py-2 rounded-full transition-all ${
                      filter.maxPrice === range.max
                        ? "bg-red-100 text-red-800 font-medium"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredDishes.length === 0 && (
        <div className="text-center py-12">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/1021/1021262.png"
            alt="No results"
            className="w-24 h-24 mx-auto mb-4 opacity-30"
          />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">No dishes found</h3>
          <p className="text-gray-500">Try adjusting your filters or search query</p>
          <button
            onClick={() => {
              setSelectedMenuId(null);
              setFilter({ type: "all", maxPrice: 1000 });
              setSearchQuery("");
            }}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Dish Cards with Animation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDishes.map((dish) => (
          <div
            key={dish.DishID}
            className={`bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform ${
              animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            } group hover:-translate-y-1`}
            style={{
              transitionDelay: `${Math.random() * 0.3}s`,
            }}
          >
            <div className="relative overflow-hidden">
              <img
                src={dish.Image}
                alt={dish.Name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <span
                className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full font-semibold shadow ${
                  getVegOrNonVeg(dish) === "veg"
                    ? "bg-green-500 text-white"
                    : "bg-yellow-500 text-white"
                }`}
              >
                {getVegOrNonVeg(dish) === "veg" ? (
                  <span className="flex items-center gap-1">
                    <FaLeaf /> Veg
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <FaDrumstickBite /> Non-Veg
                  </span>
                )}
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-red-600 transition-colors">
                {dish.Name}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
                {dish.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-red-600">₹{dish.Price}</span>
                <button
                  onClick={() => handleAddToCart(dish)}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold py-2 px-4 rounded-lg transition-all flex items-center gap-1"
                >
                  + Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination - Placeholder for future implementation */}
      {filteredDishes.length > 0 && (
        <div className="mt-12 flex justify-center">
          <div className="bg-white shadow-sm rounded-full px-2">
            <button className="px-4 py-2 text-gray-600 hover:text-red-600 disabled:opacity-50">
              ←
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-full">
              1
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-red-600">
              2
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-red-600">
              3
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-red-600">
              →
            </button>
          </div>
        </div>
      )}

      {/* Add these styles to your CSS file for hiding scrollbars nicely */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Menu;
