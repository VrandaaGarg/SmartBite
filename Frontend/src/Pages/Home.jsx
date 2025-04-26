import { Link } from "react-router-dom";
import { dishes } from "../Data/dishes";
import { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";

const topDishes = dishes.slice(0, 4); // Show first 4

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    text: "SmartBite's Butter Chicken reminds me of my grandmother's recipe. Absolutely authentic taste!",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/32.jpg"
  },
  {
    id: 2,
    name: "Rahul Patel",
    text: "Quick delivery and the food still arrives hot. The Paneer Tikka is to die for!",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/44.jpg"
  },
  {
    id: 3,
    name: "Ananya Singh",
    text: "I order every weekend. The Biryani is consistently delicious and portion sizes are generous.",
    rating: 4,
    image: "https://randomuser.me/api/portraits/women/68.jpg"
  }
];

const Home = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animation for elements to fade in
    setIsVisible(true);

    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => 
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }, 5500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white overflow-x-hidden">
      {/* Hero Section with Animated Gradient and Floating Icons */}
      <section className="relative py-20 bg-gradient-to-br from-red-800 to-red-700 text-white px-4 overflow-hidden">
        {/* Subtle Animated Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-amber-300 opacity-20 animate-pulse-slow"></div>
          <div className="absolute top-1/2 -right-12 w-48 h-48 rounded-full bg-red-900 opacity-40 animate-float"></div>
          <div className="absolute -bottom-12 left-1/4 w-36 h-36 rounded-full bg-amber-200 opacity-20 animate-float-rev"></div>
          {/* Floating food icons */}
          <div className="absolute left-10 top-12 text-4xl opacity-30 animate-float">
            <span role="img" aria-label="burger">🍔</span>
          </div>
          <div className="absolute right-16 bottom-16 text-4xl opacity-30 animate-float-rev">
            <span role="img" aria-label="pizza">🍕</span>
          </div>
        </div>
        
        <div className={`max-w-5xl mx-auto text-center relative z-10 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-block mb-6 text-amber-200 bg-red-900/50 rounded-full px-3 py-1 text-sm font-medium backdrop-blur-sm animate-fade-in-down">
            Delivering Happiness 🚚
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-gradient-text bg-gradient-to-r from-amber-200 via-white to-amber-200 bg-clip-text text-transparent">
            Delicious Food<br />
            <span className="text-amber-200 drop-shadow-lg">Delivered To Your Door</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-rose-100 animate-fade-in-up">
            Enjoy authentic Indian cuisine, from spicy starters to rich curries and aromatic biryanis – all made with love and delivered with care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
            <Link
              to="/menu"
              className=" bg-gradient-to-r from-amber-400 to-amber-500 text-red-900 font-semibold px-2 md:px-8 py-2 md:py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-lg animate-bounce-once"
            >
              Explore Menu
            </Link>
            {!user && (
              <Link
                to="/signup"
                className="bg-red-900 bg-opacity-40 text-white border-2 border-white border-opacity-20 font-medium px-8 py-4 rounded-full hover:bg-opacity-60 hover:-translate-y-1 transition-all duration-300 text-lg backdrop-blur-sm"
              >
                Sign Up for Offers
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Best Sellers with Card Fade-in Animation */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-red-800 font-semibold text-lg">Taste Our Best</span>
          <h2 className="text-4xl font-bold text-gray-800 mt-2">
            Customer Favorites ⭐
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {topDishes.map((dish, idx) => (
            <div
              key={dish.id}
              className={`bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl group transition-all duration-300
                animate-fade-in-up`}
              style={{ animationDelay: `${0.1 + idx * 0.1}s` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <Link to="/menu" className="text-amber-200 underline font-medium">Add to Cart</Link>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg text-gray-800 mb-1">
                  {dish.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {dish.description}
                </p>
                <div className="flex justify-between items-center">
                  <div className="text-red-800 font-bold">₹{dish.price}</div>
                  <div className="bg-amber-50 text-amber-700 text-xs px-2 py-1 rounded-full">Popular</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/menu"
            className="inline-flex items-center text-red-800 font-semibold hover:text-red-900 transition-colors animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            View Full Menu
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Feature Section with Subtle Background */}
      <section className="py-16 px-6 bg-gradient-to-r from-amber-50 to-rose-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="bg-red-100 text-red-800 rounded-full px-4 py-1 text-sm font-medium">Why Choose Us</span>
            <h2 className="text-3xl mt-3 md:text-4xl font-bold text-gray-800">
              Experience The Best Indian Food Delivery
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              At SmartBite, we're committed to bringing you the authentic taste of India with the convenience of modern delivery.
            </p>
            <ul className="space-y-3">
              {[
                "Fresh ingredients sourced daily",
                "Authentic recipes passed through generations",
                "Fast delivery within 30 minutes",
                "Eco-friendly packaging"
              ].map((item, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <span className="bg-green-100 text-green-700 rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1505253758473-96b7015fcd40" alt="Food preparation" className="rounded-lg shadow-lg odd:translate-y-4" />
            <img src="https://images.unsplash.com/photo-1613545325278-f24b0cae1224" alt="Indian curry" className="rounded-lg shadow-lg even:-translate-y-4" />
            <img src="https://images.unsplash.com/photo-1534939561126-855b8675edd7" alt="Fresh ingredients" className="rounded-lg shadow-lg odd:translate-y-4" />
            <img src="https://images.unsplash.com/photo-1563379926898-05f4575a45d8" alt="Chef cooking" className="rounded-lg shadow-lg even:-translate-y-4" />
          </div>
        </div>
      </section>

      {/* Testimonials with Refined Design */}
      <section className="py-20 bg-white px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
            What Our Customers Say
          </h2>
          <div className="relative">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`transition-all duration-700 ${
                  index === currentTestimonial 
                    ? "opacity-100 translate-x-0" 
                    : "opacity-0 absolute top-0 translate-x-8"
                }`}
              >
                {index === currentTestimonial && (
                  <div className="bg-white rounded-2xl px-6 py-10 shadow-lg border border-gray-100">
                    <div className="flex justify-center mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-xl text-gray-700 italic mb-6">"{testimonial.text}"</p>
                    <div className="flex items-center justify-center">
                      <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4 object-cover" />
                      <div className="text-left">
                        <div className="font-medium">{testimonial.name}</div>
                        <div className="text-sm text-gray-500">Happy Customer</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? "bg-red-800" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Softer Call to Action */}
      <section className="py-16 bg-gradient-to-r from-red-800 to-red-700 text-white px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Taste the Difference?
          </h3>
          <p className="text-lg text-rose-100 mb-8 max-w-2xl mx-auto">
            Order now and experience the authentic flavors of India delivered right to your doorstep.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/menu"
              className="bg-amber-400 hover:bg-amber-500 text-red-900 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              Order Now
            </Link>
            {!user && (
              <Link
                to="/login"
                className="bg-transparent border-2 border-white/60 hover:bg-white/10 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:-translate-y-1"
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Add keyframe styles for new effects */}
      <style>
        {`
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite alternate;
        }
        .animate-float-rev {
          animation: float-rev 7s ease-in-out infinite alternate;
        }
        .animate-fade-in-down {
          animation: fadeInDown 1s both;
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s both;
        }
        .animate-bounce-once {
          animation: bounceOnce 1s 0.2s both;
        }
        .animate-gradient-text {
          background-size: 200% 200%;
          animation: gradientMove 4s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.18; }
          50% { opacity: 0.3; }
        }
        @keyframes float {
          0% { transform: translateY(0px);}
          100% { transform: translateY(30px);}
        }
        @keyframes float-rev {
          0% { transform: translateY(0px);}
          100% { transform: translateY(-25px);}
        }
        @keyframes fadeInDown {
          0% { opacity: 0; transform: translateY(-20px);}
          100% { opacity: 1; transform: translateY(0);}
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px);}
          100% { opacity: 1; transform: translateY(0);}
        }
        @keyframes bounceOnce {
          0% { transform: scale(1);}
          30% { transform: scale(1.08);}
          60% { transform: scale(0.97);}
          100% { transform: scale(1);}
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%;}
          50% { background-position: 100% 50%;}
          100% { background-position: 0% 50%;}
        }
        `}
      </style>
    </div>
  );
};

export default Home;