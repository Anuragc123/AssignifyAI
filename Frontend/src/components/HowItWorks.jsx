import { FiUpload, FiCpu, FiCheckSquare } from "react-icons/fi";

export default function HowItWorks() {
  const steps = [
    {
      icon: <FiUpload className="h-12 w-12 text-white" />,
      title: "Upload Assignments",
      description:
        "Upload student assignments in various formats including documents, images, and PDFs.",
    },
    {
      icon: <FiCpu className="h-12 w-12 text-white" />,
      title: "AI Analysis",
      description:
        "Our AI analyzes the content, identifies key concepts, and evaluates against your rubric.",
    },
    {
      icon: <FiCheckSquare className="h-12 w-12 text-white" />,
      title: "Review & Approve",
      description:
        "Review AI-generated feedback, make adjustments if needed, and approve for distribution.",
    },
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            How AssignifyAI Works
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            A simple three-step process to transform your grading workflow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="bg-indigo-600 rounded-full p-4 mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                {step.title}
              </h3>
              <p className="text-gray-600 text-center">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute transform translate-x-32">
                  <div className="w-16 h-1 bg-indigo-200 mt-12"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
