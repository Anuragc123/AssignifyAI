import { FiCheckCircle } from "react-icons/fi";

export default function Hero() {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              AI-Powered Grading Assistant for Educators
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-indigo-100">
              Save time, provide better feedback, and focus on what matters most
              - teaching.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <FiCheckCircle className="text-indigo-200 mr-2 flex-shrink-0" />
                <span>Automated assignment grading</span>
              </div>
              <div className="flex items-center">
                <FiCheckCircle className="text-indigo-200 mr-2 flex-shrink-0" />
                <span>Personalized student feedback</span>
              </div>
              <div className="flex items-center">
                <FiCheckCircle className="text-indigo-200 mr-2 flex-shrink-0" />
                <span>Insights into student performance</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-md hover:bg-indigo-50 transition-colors">
                Get Started
              </button>
              <button className="px-6 py-3 bg-transparent border border-white text-white font-medium rounded-md hover:bg-white/10 transition-colors">
                Learn More
              </button>
            </div>
          </div>
          <div className="hidden md:block">
            <img
              src="./HomePage_Image.jpg"
              alt="AI Grading Assistant"
              height={"300px"}
              className="rounded-lg shadow-xl h-[60vh]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
