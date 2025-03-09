import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FiSave,
  FiX,
  FiPlus,
  FiTrash2,
  FiCalendar,
  FiUsers,
} from "react-icons/fi";

export default function CreateAssignmentPage() {
  const [assignment, setAssignment] = useState({
    title: "",
    description: "",
    course: "",
    dueDate: "",
    points: 100,
    rubric: [
      {
        criteria: "Content",
        description: "Quality and relevance of content",
        points: 40,
      },
      {
        criteria: "Structure",
        description: "Organization and flow",
        points: 30,
      },
      { criteria: "Grammar", description: "Spelling and grammar", points: 30 },
    ],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAssignment({
      ...assignment,
      [name]: value,
    });
  };

  const handleRubricChange = (index, field, value) => {
    const updatedRubric = [...assignment.rubric];
    updatedRubric[index] = {
      ...updatedRubric[index],
      [field]: value,
    };
    setAssignment({
      ...assignment,
      rubric: updatedRubric,
    });
  };

  const addRubricItem = () => {
    setAssignment({
      ...assignment,
      rubric: [
        ...assignment.rubric,
        { criteria: "", description: "", points: 0 },
      ],
    });
  };

  const removeRubricItem = (index) => {
    const updatedRubric = assignment.rubric.filter((_, i) => i !== index);
    setAssignment({
      ...assignment,
      rubric: updatedRubric,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Assignment created:", assignment);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Create New Assignment
            </h1>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center"
              >
                <FiX className="mr-2" />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center"
              >
                <FiSave className="mr-2" />
                Save Assignment
              </button>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Assignment Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={assignment.title}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={assignment.description}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="course"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Course
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUsers className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="course"
                        id="course"
                        className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        value={assignment.course}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="dueDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Due Date
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="text-gray-400" />
                      </div>
                      <input
                        type="date"
                        name="dueDate"
                        id="dueDate"
                        className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        value={assignment.dueDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="points"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Total Points
                    </label>
                    <input
                      type="number"
                      name="points"
                      id="points"
                      min="0"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={assignment.points}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Grading Rubric
                    </h3>
                    <button
                      type="button"
                      onClick={addRubricItem}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md text-sm font-medium hover:bg-indigo-200 flex items-center"
                    >
                      <FiPlus className="mr-1" />
                      Add Criteria
                    </button>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="grid grid-cols-12 gap-4 mb-2 font-medium text-sm text-gray-700">
                      <div className="col-span-4">Criteria</div>
                      <div className="col-span-6">Description</div>
                      <div className="col-span-2">Points</div>
                    </div>

                    {assignment.rubric.map((item, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-12 gap-4 mb-4 items-center"
                      >
                        <div className="col-span-4">
                          <input
                            type="text"
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            value={item.criteria}
                            onChange={(e) =>
                              handleRubricChange(
                                index,
                                "criteria",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="col-span-6">
                          <input
                            type="text"
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            value={item.description}
                            onChange={(e) =>
                              handleRubricChange(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="col-span-1">
                          <input
                            type="number"
                            min="0"
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            value={item.points}
                            onChange={(e) =>
                              handleRubricChange(
                                index,
                                "points",
                                Number.parseInt(e.target.value) || 0
                              )
                            }
                          />
                        </div>
                        <div className="col-span-1 flex justify-center">
                          <button
                            type="button"
                            onClick={() => removeRubricItem(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    AI Grading Settings
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="mb-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Enable AI-assisted grading
                        </span>
                      </label>
                      <p className="mt-1 text-sm text-gray-500">
                        AssignifyAI will automatically grade submissions based
                        on your rubric and provide feedback to students.
                      </p>
                    </div>

                    <div className="mb-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Generate personalized feedback
                        </span>
                      </label>
                      <p className="mt-1 text-sm text-gray-500">
                        AI will provide customized feedback for each student
                        based on their submission.
                      </p>
                    </div>

                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Require teacher approval before releasing grades
                        </span>
                      </label>
                      <p className="mt-1 text-sm text-gray-500">
                        You'll be able to review and adjust AI-generated grades
                        before they're released to students.
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
