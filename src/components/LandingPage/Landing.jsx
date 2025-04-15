import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div className="flex flex-col md:flex-row justify-start items-center px-8 py-16 max-w-7xl mx-auto">
        <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
          <h1 className="text-4xl text-blue-900 font-bold mt-20 flex">MakaTalk</h1>
          <p className="text-xl leading-relaxed text-blue-900 mt-6">
            MakaTalk is an interactive web app designed to help you learn and practice Makaton sign language with ease and confidence. Engage in guided lessons where our AI prompts you to perform specific signs using your webcam, receiving real-time feedback from our machine learning model to ensure accuracy. Test your knowledge through conversational quizzes and interactive learning!
          </p>
          <button
            onClick={() => navigate("/learn")}
            className="mt-6 bg-gray-100 hover:bg-blue-900 text-black border border-black hover:border-blue-900 hover:text-white py-3 px-6 rounded-lg"
          >
            Get Started
          </button>
        </div>
        <div className="md:w-1/2 flex justify-end">
          <img src="/images/MakaTalk_HandsGraphic.svg" alt="MakaTalk" className="w-full max-w-md mx-auto" />
        </div>
      </div>
    </div>
  );
};

export default Landing;
