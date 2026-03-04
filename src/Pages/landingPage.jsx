import { useState } from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const [email, setEmail] = useState("");   
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Subscribed email:", email);
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 flex flex-col justify-center items-center px-4">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
          Welcome to Our Platform
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
          Connect with influencers and grow your brand effortlessly.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            to="/login"
            className="px-8 py-4 bg-black dark:bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition duration-300 shadow-lg"
          >
            Login
          </Link>
          <Link
            to="/signup/client"
            className="px-8 py-4 bg-white dark:bg-gray-800 text-black dark:text-white font-semibold rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300 shadow-lg"
          >
            Sign Up as Client
          </Link>
          <Link
            to="/signup/influencer"
            className="px-8 py-4 bg-white dark:bg-gray-800 text-black dark:text-white font-semibold rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300 shadow-lg"
          >
            Sign Up as Influencer
          </Link>
        </div>

        {/* Subscription Form */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Stay Updated</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 dark:bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}