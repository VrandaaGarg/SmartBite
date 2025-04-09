import React from "react";

const About = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center text-red-600 mb-10">
        About SmartBite 🍽️
      </h1>

      {/* Brand Story */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-red-500 mb-4">Our Story</h2>
        <p className="text-gray-700 leading-relaxed text-lg">
          SmartBite was born out of a simple craving — a craving for authentic, home-style Indian food
          that doesn't just satisfy hunger, but also warms the heart. What started as a small family
          kitchen has now grown into a full-fledged digital restaurant serving hundreds of happy customers
          every day. At SmartBite, we're on a mission to bring the joy of real Indian food to your doorstep,
          without compromising on quality, hygiene, or taste.
        </p>
      </section>

      {/* Philosophy */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-red-500 mb-4">What We Believe</h2>
        <p className="text-gray-700 leading-relaxed text-lg">
          Food is not just about taste — it's about tradition, care, and connection. That’s why every dish
          at SmartBite is prepared with fresh ingredients, traditional recipes, and a dash of love. We believe
          in the power of good food to make your day better, bring families together, and create memories
          that linger long after the last bite.
        </p>
      </section>

      {/* Why SmartBite */}
      <section className="mb-12 grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-2xl font-semibold text-red-500 mb-4">Why Choose SmartBite?</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-3 text-lg">
            <li>✅ Fresh, locally sourced ingredients</li>
            <li>✅ Diverse menu with both veg and non-veg options</li>
            <li>✅ Hygienically cooked and safely packaged</li>
            <li>✅ Quick delivery with real-time order tracking</li>
            <li>✅ Seamless online ordering with secure payments</li>
          </ul>
        </div>
        <div className="rounded-lg overflow-hidden shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1604908554168-3f2cdd79a6e4"
            alt="Indian food served in plate"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Final Note / Testimonial */}
      <section className="text-center mt-16">
        <p className="text-xl italic text-gray-600 max-w-3xl mx-auto">
          “Whether you're missing home-cooked meals, planning a family dinner, or simply too tired to cook —
          SmartBite is here to serve comfort in every bite.”
        </p>
        <p className="mt-4 font-semibold text-gray-800">— From Our Kitchen, With Love ❤️</p>
      </section>
    </div>
  );
};

export default About;