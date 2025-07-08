import React from "react";
import { useForm, ValidationError } from "@formspree/react";
import { FaPaperPlane } from "react-icons/fa";

const ContactForm = () => {
  const [state, handleSubmit] = useForm("xblgvzak");

  if (state.succeeded) {
    return (
      <div className="text-center p-6">
        <h2 className="text-2xl font-semibold text-green-600">Thank you!</h2>
        <p className="text-gray-700 mt-2">Your message has been successfully sent.</p>
      </div>
    );
  }

  return (
    <section className="bg-gray-50 rounded-2xl p-6 md:p-8 shadow-md">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Get In Touch</h2>
          <p className="text-gray-600">Send us a message and we'll get back to you as soon as possible</p>
        </div>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
              Your Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Enter your name"
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Enter your email"
            />
            <ValidationError prefix="Email" field="email" errors={state.errors} />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="subject">
              Subject
            </label>
            <select
              id="subject"
              name="subject"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="Order Issue">Order Issue</option>
              <option value="Delivery Problem">Delivery Problem</option>
              <option value="Food Quality">Food Quality</option>
              <option value="Technical Issue">Technical Issue</option>
              <option value="Feedback">Feedback</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="message">
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="5"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Please describe your issue or question in detail"
            ></textarea>
            <ValidationError prefix="Message" field="message" errors={state.errors} />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={state.submitting}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2 w-full md:w-auto"
            >
              <FaPaperPlane />
              Send Message
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;