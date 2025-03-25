import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FiFileText,
  FiCalendar,
  FiClock,
  FiUpload,
  FiFile,
  FiTrash2,
  FiCheckCircle,
} from "react-icons/fi";
import axios from "axios";
import { baseUrl } from "../backend-url";

export default function AssignmentDetailPage() {
  const { id } = useParams();
  const fileInputRef = useRef(null);

  // Mock user data - in a real app, this would come from authentication
  const user = {
    id: "student456",
    name: "Alex Johnson",
    role: "student", // or "teacher"
  };

  const isStudent = user.role === "student";

  const [assignment, setAssignment] = useState({
   
  });

  const [files, setFiles] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchAssignment() {
      try {
        const response = await axios.get(`${baseUrl}/user/assignment/${id}`, {
          withCredentials: true,
        });
        if (response.data.success) {
          console.log("response=", response.data);
          setAssignment(response.data.assignment);
        }
      } catch (error) {
        console.error("Error fetching assignment:", error);
      }
    }
    fetchAssignment();
  }, [id]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const handleSubmit = () => {
    if (files.length === 0) {
      alert("Please upload at least one file before submitting.");
      return;
    }

    setSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  

  const formatTimeRemaining = () => {

    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    // console.log("assignment.dueDate=", assignment.dueTime);
    // const [hrs, mins] = assignment.dueTime.split(":").map(Number);

    // Set dueTime on dueDate
    // dueDate.setHours(hrs, mins, 0, 0);
    const timeRemaining = dueDate - now;

    if (timeRemaining <= 0) {
      return "Past due";
    }

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    if (days > 0) {
      return `${days} day${days !== 1 ? "s" : ""} ${hours} hour${
        hours !== 1 ? "s" : ""
      } remaining`;
    } else {
      const minutes = Math.floor(
        (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
      );
      return `${hours} hour${hours !== 1 ? "s" : ""} ${minutes} minute${
        minutes !== 1 ? "s" : ""
      } remaining`;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-indigo-100">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {assignment.title}
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    {assignment.course}
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <FiCalendar className="mr-1" />
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FiClock className="mr-1" />
                    {formatTimeRemaining()}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FiFileText className="mr-1" />
                    {assignment.points} points
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 py-5 sm:p-6">
              <div className="prose max-w-none">
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Description
                </h2>
                <p className="text-gray-700 mb-6">{assignment.description}</p>

                {/* <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Instructions
                </h2>
                <ul className="list-disc pl-5 mb-6">
                  {assignment.instructions.map((instruction, index) => (
                    <li key={index} className="text-gray-700 mb-1">
                      {instruction}
                    </li>
                  ))}
                </ul> */}

                {/* <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Resources
                </h2>
                <ul className="mb-6">
                  {assignment.resources.map((resource, index) => (
                    <li key={index} className="mb-1">
                      <a
                        href={resource.url}
                        className="text-indigo-600 hover:text-indigo-800 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {resource.name}
                      </a>
                    </li>
                  ))}
                </ul> */}
              </div>

              {isStudent && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Your Submission
                  </h2>

                  {submitted ? (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-start">
                      <FiCheckCircle className="text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="text-sm font-medium text-green-800">
                          Assignment submitted successfully!
                        </h3>
                        <p className="mt-1 text-sm text-green-700">
                          Your work has been submitted. You can still make
                          changes and resubmit until the due date.
                        </p>
                        <ul className="mt-2 text-sm text-green-700">
                          {files.map((file, index) => (
                            <li key={index} className="flex items-center">
                              <FiFile className="mr-2" />
                              {file.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          className="hidden"
                          multiple
                        />
                        <button
                          onClick={() => fileInputRef.current.click()}
                          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <FiUpload className="inline-block mr-2" />
                          Upload Files
                        </button>
                      </div>

                      {files.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-sm font-medium text-gray-700 mb-2">
                            Files to submit:
                          </h3>
                          <ul className="space-y-2">
                            {files.map((file, index) => (
                              <li
                                key={index}
                                className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md"
                              >
                                <div className="flex items-center">
                                  <FiFile className="text-gray-500 mr-2" />
                                  <span className="text-sm text-gray-700">
                                    {file.name}
                                  </span>
                                </div>
                                <button
                                  onClick={() => removeFile(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <FiTrash2 />
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <button
                        onClick={handleSubmit}
                        disabled={files.length === 0 || submitting}
                        className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                          files.length === 0 || submitting
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                      >
                        {submitting ? "Submitting..." : "Turn In Assignment"}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
