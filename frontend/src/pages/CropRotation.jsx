import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

// CropRotation component: Suggests next crops based on previous crop input
const CropRotation = () => {
  // State for the previous crop entered by the user
  const [previousCrop, setPreviousCrop] = useState("");
  // State for storing recommendations from the backend
  const [recommendations, setRecommendations] = useState("");
  // State to show loading spinner while fetching
  const [loading, setLoading] = useState(false);

  // Handle form submission to get crop rotation suggestions
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submit
    setLoading(true); // Show loading
    setRecommendations(""); // Clear previous recommendations

    try {
      // Send POST request to backend with previous crop
      const response = await fetch("http://127.0.0.1:8000/api/crop-rotation/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ previous_crop: previousCrop }),
      });

      // Parse response and update recommendations
      const data = await response.json();
      setRecommendations(data.recommendations || "No recommendations found.");
    } catch {
      setRecommendations("Error fetching recommendations.");
    }

    setLoading(false); // Hide loading
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-700 to-emerald-500 flex flex-col items-center justify-start py-16 px-6 text-white font-sans">
      {/* Page Title */}
      <h1 className="text-5xl font-extrabold tracking-wide text-center drop-shadow-lg mb-10">
        🌾 Crop Rotation Advisor 🌱
      </h1>

      {/* Input form for previous crop */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20 w-full max-w-xl flex flex-col sm:flex-row gap-4 items-center"
      >
        {/* Input for previous crop name */}
        <input
          type="text"
          value={previousCrop}
          onChange={(e) => setPreviousCrop(e.target.value)}
          placeholder="Type the previous crop name..."
          className="flex-grow p-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="relative bg-yellow-400 text-emerald-900 font-bold px-6 py-3 rounded-xl overflow-hidden shadow-lg hover:shadow-yellow-500 transition duration-300 hover:scale-105"
        >
          <span className="relative z-10">
            {loading ? "Thinking..." : "Suggestions"}
          </span>
          <span className="absolute top-0 left-0 w-full h-full bg-yellow-300 opacity-0 hover:opacity-20 transition duration-300"></span>
        </button>
      </form>

      {/* Show recommendations if available */}
      {recommendations && (
        <div className="mt-10 w-full max-w-4xl">
          <div className="bg-white text-gray-900 p-8 rounded-3xl shadow-2xl border-l-4 border-yellow-400 animate-fade-in-down transition duration-700 prose prose-lg max-w-none">
            <h2 className="font-bold text-2xl text-emerald-800">
              🌿 Recommended Crops
            </h2>
            {/* Render recommendations as HTML */}
            <div dangerouslySetInnerHTML={{ __html: recommendations }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CropRotation;
