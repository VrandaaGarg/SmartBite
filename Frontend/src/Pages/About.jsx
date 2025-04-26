import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUtensils, FaAward, FaUsers, FaStar, FaLeaf, FaTruck, FaMapMarkerAlt, FaBook } from "react-icons/fa";

const About = () => {
  const [animatedStats, setAnimatedStats] = useState(false);
  const [visibleSection, setVisibleSection] = useState("");


  // Statistics to be animated
  const stats = [
    { id: 'customers', label: 'Happy Customers', value: 5500, icon: FaUsers, color: 'bg-yellow-100 text-yellow-600' },
    { id: 'dishes', label: 'Dishes', value: 100, icon: FaUtensils, color: 'bg-red-100 text-red-600' },
    { id: 'chefs', label: 'Expert Chefs', value: 25, icon: FaAward, color: 'bg-blue-100 text-blue-600' },
    { id: 'rating', label: 'Customer Rating', value: 4.8, icon: FaStar, color: 'bg-green-100 text-green-600', suffix: '/5' }
  ];

  // Our values
  const values = [
    {
      icon: FaLeaf,
      title: "Fresh Ingredients",
      description: "We source local, seasonal ingredients to ensure every dish is made with the freshest components available."
    },
    {
      icon: FaUtensils,
      title: "Authentic Recipes",
      description: "Our recipes have been perfected over generations, preserving traditional flavors while adding modern touches."
    },
    {
      icon: FaTruck,
      title: "Reliable Delivery",
      description: "We prioritize timely delivery so your food arrives hot, fresh and exactly when you need it."
    },
    {
      icon: FaUsers,
      title: "Customer First",
      description: "Your satisfaction drives everything we do. We listen to feedback and constantly improve our service."
    }
  ];

  // Team members
  const team = [
    {
      name: "Rahul Sharma",
      role: "Executive Chef",
      bio: "With 15 years of experience in Indian cuisine, Chef Rahul brings authentic flavors and innovative techniques to every dish.",
      image: "https://st2.depositphotos.com/5653638/11534/i/450/depositphotos_115345470-stock-photo-indian-male-chef-holding-fresh.jpg"
    },
    {
      name: "Vranda Garg",
      role: "Founder & CEO",
      bio: "Vranda founded SmartBite with a vision to bring homestyle Indian food to everyone's doorstep with just a few taps.",
      image: "/vranda.jpeg"
    },
    {
      name: "Ayush Sharma ",
      role: "Co- Founder & Operations Head",
      bio: "Ayush ensures that every order is processed efficiently and delivered with SmartBite's signature quality and care.",
      image: "/ayush.jpeg"
    }
  ];

  // Intersection Observer for animation triggers
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3,
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('id');
          setVisibleSection(sectionId);

          if (sectionId === 'stats-section') {
            setAnimatedStats(true);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const sections = document.querySelectorAll('.observe-section');
    sections.forEach(section => {
      observer.observe(section);
    });

    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="bg-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-red-700 to-red-600 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-yellow-400"></div>
          <div className="absolute top-1/2 -right-12 w-48 h-48 rounded-full bg-red-800"></div>
          <div className="absolute -bottom-12 left-1/4 w-36 h-36 rounded-full bg-yellow-300"></div>
        </div>

        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Our Story</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-red-100">
            From a small kitchen to your favorite food delivery app - the journey of bringing authentic Indian flavors to your doorstep.
          </p>
        </div>
      </section>

      {/* Brand Story */}
      <section id="story-section" className="observe-section py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={`transform transition-all duration-1000 ${visibleSection === "story-section" ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
              }`}>
              <span className="bg-red-100 text-red-600 rounded-full px-4 py-1 text-sm font-medium">Our Story</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2 mb-6">
                From Passion to Plate
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  SmartBite was born out of a simple craving — a craving for authentic, home-style Indian food
                  that doesn't just satisfy hunger, but also warms the heart. What started as a small family
                  kitchen in 2015 has now grown into a full-fledged digital restaurant.
                </p>
                <p>
                  Our founder, Priya Patel, noticed that while food delivery apps were booming, the quality and authenticity
                  of Indian cuisine was often compromised. Determined to change this, she gathered family recipes passed
                  down through generations and assembled a team of passionate chefs.
                </p>
                <p>
                  Today, SmartBite serves hundreds of happy customers every day, bringing the true taste of India
                  to your doorstep. Our mission remains unchanged — deliver food that's not just a meal, but an experience.
                </p>
              </div>
            </div>
            <div className={`grid grid-cols-2 gap-4 transform transition-all duration-1000 ${visibleSection === "story-section" ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
              }`}>
              <div className="space-y-4">
                <img src="https://images.unsplash.com/photo-1505253758473-96b7015fcd40" alt="Food preparation"
                  className="rounded-lg shadow-lg" />
                <img src="https://images.unsplash.com/photo-1534939561126-855b8675edd7" alt="Fresh ingredients"
                  className="rounded-lg shadow-lg transform translate-y-8" />
              </div>
              <div className="space-y-4 transform translate-y-12">
                <img src="https://images.unsplash.com/photo-1613545325278-f24b0cae1224" alt="Indian curry"
                  className="rounded-lg shadow-lg" />
                <img src="https://images.unsplash.com/photo-1563379926898-05f4575a45d8" alt="Chef cooking"
                  className="rounded-lg shadow-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section id="stats-section" className="observe-section bg-gray-50 py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">Our Journey in Numbers</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.id} className="bg-white rounded-xl shadow-md p-6">
                <div className={`mx-auto ${stat.color} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
                  <stat.icon className="text-2xl" />
                </div>
                <h3 className="text-4xl font-bold text-gray-800">
                  {animatedStats ? (
                    <>
                      {stat.value}
                      {stat.suffix || ''}
                    </>
                  ) : (
                    <>
                      0{stat.suffix || ''}
                    </>
                  )}
                </h3>

                <p className="text-gray-600 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section id="values-section" className="observe-section py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="bg-red-100 text-red-600 rounded-full px-4 py-1 text-sm font-medium">Our Values</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
              What We Stand For
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all transform ${visibleSection === "values-section"
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 "
                  }`}
                style={{ transitionDelay: `${index * 150}ms`, transitionDuration: '800ms' }}
              >
                <div className="bg-red-50 text-red-600 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <value.icon className="text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section id="team-section" className="observe-section bg-gray-50 py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="bg-red-100 text-red-600 rounded-full px-4 py-1 text-sm font-medium">Our Team</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
              Meet the Faces Behind SmartBite
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-1000 ${visibleSection === "team-section"
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 "
                  }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover object-center"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                  <p className="text-red-600 mb-4">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map/Locations */}
      <section id="locations-section" className="observe-section py-16 md:py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={`transform transition-all duration-1000 ${visibleSection === "locations-section" ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
              }`}>
              <span className="bg-red-100 text-red-600 rounded-full px-4 py-1 text-sm font-medium">Our Kitchens</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2 mb-6">
                Where the Magic Happens
              </h2>
              <p className="text-gray-700 mb-6">
                SmartBite operates from multiple cloud kitchens across the city, strategically located to ensure
                fast delivery and maximum freshness. Each kitchen follows the same rigorous standards and recipes.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-red-50 p-2 rounded-full">
                    <FaMapMarkerAlt className="text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Central Kitchen</h4>
                    <p className="text-gray-600">52, Food Street, Flavor Avenue, Central City</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-red-50 p-2 rounded-full">
                    <FaMapMarkerAlt className="text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">North Kitchen</h4>
                    <p className="text-gray-600">24, Spice Road, Northern District</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-red-50 p-2 rounded-full">
                    <FaMapMarkerAlt className="text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">South Kitchen</h4>
                    <p className="text-gray-600">108, Curry Lane, Southern Heights</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`transform transition-all duration-1000 ${visibleSection === "locations-section" ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"}`}>
              <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-lg">
                {/* Map Embed */}
                <iframe
                  title="Manipal University Jaipur Map"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=75.560823%2C26.840073%2C75.570823%2C26.846073&layer=mapnik&marker=26.843073%2C75.565823"
                  className="w-full h-full"
                  style={{ border: "none" }}
                  allowFullScreen
                ></iframe>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-red-600 py-16 px-6 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Taste the SmartBite Difference
          </h2>
          <p className="text-lg text-red-100 mb-8 max-w-2xl mx-auto">
            Ready to experience our delicious food and exceptional service?
            Explore our menu and place your first order today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/menu"
              className="bg-white text-red-600 hover:bg-yellow-50 px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              <FaUtensils className="inline-block mr-2" /> View Our Menu
            </Link>
            <Link
              to="/about"
              className="bg-transparent border-2 border-white hover:bg-red-500 px-8 py-3 rounded-full font-semibold text-lg transition-all"
            >
              <FaBook className="inline-block mr-2" /> Our Story
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;