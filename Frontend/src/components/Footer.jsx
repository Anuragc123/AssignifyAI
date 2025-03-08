import { FiHeart } from "react-icons/fi";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-indigo-600 rounded-md flex items-center justify-center text-white font-bold text-xl">
                A
              </div>
              <span className="ml-2 text-xl font-bold">AssignifyAI</span>
            </div>
            <p className="mt-2 text-sm text-gray-300">
              Empowering educators with AI-powered grading and feedback
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:space-x-8">
            <div className="mb-4 md:mb-0">
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                Resources
              </h3>
              <div className="mt-2 space-y-2">
                <a
                  href="#"
                  className="text-gray-300 hover:text-white block text-sm"
                >
                  Documentation
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white block text-sm"
                >
                  Tutorials
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white block text-sm"
                >
                  FAQs
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                Legal
              </h3>
              <div className="mt-2 space-y-2">
                <a
                  href="#"
                  className="text-gray-300 hover:text-white block text-sm"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white block text-sm"
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-4 flex justify-center">
          <p className="text-sm text-gray-300 flex items-center">
            © {currentYear} AssignifyAI. Made with{" "}
            <FiHeart className="mx-1 text-red-500" /> for educators worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
