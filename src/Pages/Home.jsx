import { Link } from "react-router-dom";
import { dishes } from "../Data/dishes";

const topDishes = dishes.slice(0, 4); // Show first 4

const Home = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="text-center py-16 bg-red-600 text-white px-4">
        <h1 className="text-4xl font-bold mb-4">Welcome to SmartBite 🍽️</h1>
        <p className="text-lg mb-6 max-w-xl mx-auto">
          Enjoy delicious Indian cuisine, from spicy starters to rich curries and aromatic biryanis – all in one place!
        </p>
        <Link
          to="/menu"
          className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-full shadow hover:bg-yellow-300 transition"
        >
          Order Now
        </Link>
      </section>

      {/* Best Sellers */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-red-700 mb-10">
          Customer Favorites ⭐
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {topDishes.map((dish) => (
            <div
              key={dish.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:scale-105 transition transform duration-300"
            >
              <img
                src={dish.image}
                alt={dish.name}
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800">
                  {dish.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {dish.description}
                </p>
                <div className="text-red-600 font-bold">₹{dish.price}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Highlight */}
      <section className="text-center bg-yellow-50 py-12 px-4">
        <h3 className="text-2xl font-bold text-red-600 mb-2">
          Made with Love ❤️ Served with Passion
        </h3>
        <p className="text-gray-700 max-w-xl mx-auto">
          We use only fresh ingredients and traditional recipes to serve the best food in town. Satisfaction guaranteed!
        </p>
      </section>
    </div>
  );
};

export default Home;