import React, { useState } from "react";
import {
  FaPhone,
  FaEnvelope,
  FaCommentDots,
  FaChevronDown,
  FaChevronUp,
  FaPaperPlane,
} from "react-icons/fa";
import { useToast } from "../Context/ToastContext";
import ContactForm from "../Components/ContactForm";

const CustomerService = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "Order Issue",
    message: "",
  });
  const { showToast } = useToast ? useToast() : { showToast: () => {} };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd send this data to a server
    console.log("Form submitted:", contactForm);
    showToast(
      "Your message has been sent! We'll get back to you soon.",
      "success"
    );
    setContactForm({
      name: "",
      email: "",
      subject: "Order Issue",
      message: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const faqs = [
    {
      id: 1,
      question: "How do I track my order?",
      answer:
        "After placing an order, you'll receive a tracking link via SMS and email. You can also view order status under 'My Orders' section when logged in to your account. Our real-time tracking system updates every 2 minutes to provide you with accurate information about your food's journey to you.",
    },
    {
      id: 2,
      question: "What if my food is late or incorrect?",
      answer:
        "We take delivery timing and order accuracy very seriously. If your food arrives more than 15 minutes after the estimated delivery time or if you received incorrect items, please contact our customer support immediately. We'll either resolve the issue by sending the correct items or offer a full or partial refund depending on the situation.",
    },
    {
      id: 3,
      question: "Can I cancel or change my order?",
      answer:
        "Orders can only be changed or canceled within 5 minutes of placing them. After that, they're already being prepared in our kitchen. To modify or cancel an eligible order, go to 'My Orders' in your account and select the appropriate option if available, or contact our customer support team immediately.",
    },
    {
      id: 4,
      question: "Do you accommodate dietary restrictions?",
      answer:
        "Yes, we strive to accommodate various dietary needs. Our menu clearly marks vegetarian, non-vegetarian, and spice levels. For specific allergies or dietary restrictions, please use the 'Special Instructions' box when placing your order or contact us before ordering, and we'll do our best to accommodate your needs.",
    },
    {
      id: 5,
      question: "What's your refund policy?",
      answer:
        "If you're unsatisfied with your order for any reason, please contact us within 30 minutes of delivery. Depending on the issue, we may offer a full or partial refund, or we may send replacement items. Refunds are typically processed within 3-5 business days and will be credited back to your original payment method.",
    },
  ];

  const toggleQuestion = (id) => {
    setActiveQuestion(activeQuestion === id ? null : id);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 md:py-16 animate-fadeIn">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-4">
          We're Here To Help
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          At SmartBite, your satisfaction is our top priority. Whether you have
          a question about your order, need help with an issue, or simply want
          to give feedback — our team is ready to assist you.
        </p>
      </div>

      {/* Contact Options */}
      <section className="mb-16">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-red-600 hover:shadow-lg transition-shadow transform hover:-translate-y-1 duration-300">
            <div className="bg-red-100 text-red-600 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4 mx-auto">
              <FaPhone className="text-xl" />
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Call Us</h3>
            <p className="text-gray-700 text-center text-lg mb-2">
              +91 98765 43210
            </p>
            <p className="text-gray-500 text-sm text-center">
              Available 7 days a week
              <br />
              10:00 AM – 10:00 PM
            </p>
            <div className="mt-4 text-center">
              <a
                href="#"
                className="inline-block text-red-600 hover:text-red-800 font-medium transition-colors"
              >
                Call now
              </a>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-red-600 hover:shadow-lg transition-shadow transform hover:-translate-y-1 duration-300">
            <div className="bg-red-100 text-red-600 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4 mx-auto">
              <FaEnvelope className="text-xl" />
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Email Us</h3>
            <p className="text-gray-700 text-center text-lg mb-2">
              smartbite@vrandagarg.in
            </p>
            <p className="text-gray-500 text-sm text-center">
              We'll respond within 24 hours
              <br />
              during business days
            </p>
            <div className="mt-4 text-center">
              <a
                href="mailto:smartbite@vrandagarg.in"
                className="inline-block text-red-600 hover:text-red-800 font-medium transition-colors"
              >
                Send email
              </a>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-red-600 hover:shadow-lg transition-shadow transform hover:-translate-y-1 duration-300">
            <div className="bg-red-100 text-red-600 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4 mx-auto">
              <FaCommentDots className="text-xl" />
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Live Chat</h3>
            <p className="text-gray-700 text-center text-lg mb-2">
              Chat with our support team
            </p>
            <p className="text-gray-500 text-sm text-center">
              Available Mon–Sat
              <br />
              11:00 AM – 9:00 PM
            </p>
            <div className="mt-4 text-center">
              <button
                onClick={() => showToast("Chat feature coming soon!", "info")}
                className="inline-block text-red-600 hover:text-red-800 font-medium transition-colors"
              >
                Start chat
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Accordion */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600">
            Find quick answers to common questions
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq) => (
            <div key={faq.id} className="mb-4">
              <button
                onClick={() => toggleQuestion(faq.id)}
                className={`w-full text-left p-5 flex justify-between items-center rounded-lg transition ${
                  activeQuestion === faq.id
                    ? "bg-red-50 text-red-700"
                    : "bg-white hover:bg-gray-50 text-gray-800"
                } shadow-sm`}
              >
                <span className="font-semibold text-sm md:text-lg">
                  {faq.question}
                </span>
                {activeQuestion === faq.id ? (
                  <FaChevronUp />
                ) : (
                  <FaChevronDown />
                )}
              </button>
              {activeQuestion === faq.id && (
                <div className="bg-white p-5 text-gray-600 rounded-b-lg shadow-sm border-t border-gray-100 animate-fadeIn">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <ContactForm />

      {/* Business Hours */}
      <section className="my-16 text-center">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Business Hours
        </h3>
        <div className="bg-white rounded-xl text-left shadow-sm p-3 md:p-6 max-w-lg mx-auto">
          <div className="grid grid-cols-2 gap-2 text-sm md:text-lg">
            <div className="text-gray-600 ">Monday - Friday:</div>
            <div className="text-gray-800 font-medium ">
              10:00 AM - 11:00 PM
            </div>
            <div className="text-gray-600 ">Saturday - Sunday:</div>
            <div className="text-gray-800 font-medium ">
              11:00 AM - 10:00 PM
            </div>
            <div className="text-gray-600 ">Holidays:</div>
            <div className="text-gray-800 font-medium ">11:00 AM - 9:00 PM</div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <div className="text-center mt-16 max-w-3xl mx-auto">
        <p className="text-lg md:text-xl italic text-gray-600 mb-2">
          "We're not just about food — we're about creating experiences and
          memories around the dining table."
        </p>
        <p className="text-sm text-gray-500">— Team SmartBite</p>
      </div>
    </div>
  );
};

export default CustomerService;
