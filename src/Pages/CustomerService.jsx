import React from "react";

const CustomerService = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center text-red-600 mb-10">
        Customer Service 🤝
      </h1>

      {/* Introduction */}
      <section className="mb-10 text-center max-w-2xl mx-auto">
        <p className="text-lg text-gray-700 leading-relaxed">
          At SmartBite, your satisfaction is our top priority. Whether you have a question about your order,
          need help with an issue, or simply want to give feedback — we’re here for you.
        </p>
      </section>

      {/* Contact Options */}
      <section className="mb-12 grid md:grid-cols-3 gap-8 text-center">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">📞 Call Us</h3>
          <p className="text-gray-700">+91 98765 43210</p>
          <p className="text-gray-500 text-sm">Mon–Sat, 10 AM – 10 PM</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">📧 Email Us</h3>
          <p className="text-gray-700">support@smartbite.com</p>
          <p className="text-gray-500 text-sm">Replies within 24 hours</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">💬 Chat Support</h3>
          <p className="text-gray-700">Live Chat Available</p>
          <p className="text-gray-500 text-sm">Mon–Sat, 11 AM – 9 PM</p>
        </div>
      </section>

      {/* FAQs */}
      <section>
        <h2 className="text-2xl font-semibold text-red-500 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h4 className="font-bold text-gray-800">Q: How do I track my order?</h4>
            <p className="text-gray-700">
              After placing an order, you'll receive a tracking link via SMS and email. You can also
              view order status under "My Orders" when logged in.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Q: What if my food is late or incorrect?</h4>
            <p className="text-gray-700">
              We’re sorry! Please contact our customer support immediately — we’ll resolve it ASAP or
              offer a refund where applicable.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Q: Can I cancel or change my order?</h4>
            <p className="text-gray-700">
              Orders can only be changed or canceled within 5 minutes of placing them. After that,
              they're already being prepared.
            </p>
          </div>
        </div>
      </section>

      {/* Ending */}
      <div className="text-center mt-12">
        <p className="text-gray-600 italic">
          “We're not just about food — we're about service that feels like family.”
        </p>
        <p className="mt-1 text-sm text-gray-400">— Team SmartBite</p>
      </div>
    </div>
  );
};

export default CustomerService;