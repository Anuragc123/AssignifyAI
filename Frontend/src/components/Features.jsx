import {
  FiClock,
  FiMessageSquare,
  FiBarChart2,
  FiShield,
} from "react-icons/fi";

export default function Features() {
  const features = [
    {
      icon: <FiClock className="h-10 w-10 text-indigo-600" />,
      title: "Save Time",
      description:
        "Reduce grading time by up to 70% with AI-powered automation, allowing you to focus on teaching and mentoring.",
    },
    {
      icon: <FiMessageSquare className="h-10 w-10 text-indigo-600" />,
      title: "Better Feedback",
      description:
        "Provide detailed, personalized feedback to each student, improving their learning outcomes and engagement.",
    },
    {
      icon: <FiBarChart2 className="h-10 w-10 text-indigo-600" />,
      title: "Actionable Insights",
      description:
        "Gain valuable insights into student performance and identify areas where additional support is needed.",
    },
    {
      icon: <FiShield className="h-10 w-10 text-indigo-600" />,
      title: "Secure & Private",
      description:
        "Your data and your students' information are protected with enterprise-grade security and privacy controls.",
    },
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Features Designed for Educators
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            AssignifyAI helps teachers save time and provide better feedback to
            students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
