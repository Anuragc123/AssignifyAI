"use client";
import toast from "react-hot-toast";
import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  FiAlertCircle,
  FiDownload,
  FiInfo,
} from "react-icons/fi";
import axios from "axios";
import { baseUrl } from "../backend-url";
import { useSelector } from "react-redux";
import FilePreviewModal from "../components/FilePreview";

export default function AssignmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Get user data from Redux store
  const user = useSelector((state) => state.auth.userData);
  const isStudent = user.role === "student";
  const isTeacher = user.role === "teacher";

  const [assignment, setAssignment] = useState({});
  const [files, setFiles] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  useEffect(() => {
    async function fetchAssignment() {
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}/user/assignment/${id}`, {
          withCredentials: true,
        });
        if (response.data.success) {
          setAssignment(response.data.assignment);
          // Check if the assignment has already been submitted
          if (response.data.assignment.submitted) {
            setSubmitted(true);
            setFiles(response.data.assignment.files || []);
          }
        }
      } catch (error) {
        console.error("Error fetching assignment:", error);

        setError("Failed to load assignment details. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    async function fetchSubmission() {
      try {
        setLoading(true);
        const response = await axios.get(
          `${baseUrl}/user/assignment/${id}/checksubmission`,
          {
            withCredentials: true,
          }
        );
        if (response.data.success || response.data.isAssignmentSubmitted) {
          // Use the files from the response if available
          if (response.data.files) {
            setFiles(response.data.files);
          }
          // Check if the assignment has already been submitted
          if (response.data.isAssignmentSubmitted) {
            setSubmitted(true);
          }
        }
      } catch (error) {
        console.error("Error fetching assignment:", error);
        setError("Failed to load assignment details. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchAssignment();
    fetchSubmission();
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

  const handleSubmit = async () => {
    if (files.length === 0) {
      toast.error("Please upload at least one file before submitting.");

      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const response = await axios.post(
        `${baseUrl}/user/assignment/${id}/submit`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting assignment:", error);
      toast.error("Failed to submit assignment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewSubmissions = () => {
    navigate(`/assignments/${id}/submissions`);
  };

  const handleDeleteAssignment = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this assignment? This action cannot be undone."
      )
    ) {
      return;
    }

    const response = await axios.delete(`${baseUrl}/user/assignment/${id}`, {
      withCredentials: true,
    });
    if (response.data.success) {
      toast.success("Assignment deleted successfully.");
      navigate("/assignments");
    } else {
      toast.error("Failed to delete assignment. Please try again.");
      console.error("Error deleting assignment:", error);
    }
  };

  const formatTimeRemaining = () => {
    if (!assignment.dueDate) return "No due date";

    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    const timeRemaining = dueDate - now;

    if (timeRemaining <= 0) {
      return "Past due";
    }

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
    );

    return days > 0
      ? `${days} day${days !== 1 ? "s" : ""} ${hours} hour${
          hours !== 1 ? "s" : ""
        } remaining`
      : `${hours} hour${hours !== 1 ? "s" : ""} ${minutes} minute${
          minutes !== 1 ? "s" : ""
        } remaining`;
  };

  const getStatusColor = () => {
    if (!assignment.dueDate) return "text-gray-600";

    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    const timeRemaining = dueDate - now;

    if (timeRemaining <= 0) {
      return "text-red-600";
    } else if (timeRemaining < 24 * 60 * 60 * 1000) {
      // Less than 24 hours
      return "text-amber-600";
    } else {
      return "text-green-600";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow bg-gray-50 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading assignment details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow bg-gray-50 flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <FiAlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-red-700 mb-2">
                Error Loading Assignment
              </h2>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const openPreviewModal = () => {
    setPreviewModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb navigation */}
          <nav className="mb-4 text-sm">
            <ol className="flex items-center space-x-2">
              <li>
                <a
                  href="/dashboard"
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Dashboard
                </a>
              </li>
              <li className="text-gray-500">/</li>
              <li>
                <a
                  href="/assignments"
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Assignments
                </a>
              </li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-700 truncate max-w-xs">
                {assignment.title || "Assignment Details"}
              </li>
            </ol>
          </nav>

          <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
            {/* Header section */}
            <div className="px-6 py-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    {assignment.title}
                  </h1>
                  <p className="text-sm text-gray-600 mb-4">
                    <span className="inline-flex items-center bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
                      {assignment.course}
                    </span>
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center text-gray-700 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                      <FiCalendar className="mr-2 text-indigo-600" />
                      <span>
                        Due:{" "}
                        {assignment.dueDate
                          ? new Date(assignment.dueDate).toLocaleDateString(
                              undefined,
                              {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : "No due date"}
                      </span>
                    </div>

                    <div
                      className={`flex items-center bg-white px-3 py-1.5 rounded-lg shadow-sm ${getStatusColor()}`}
                    >
                      <FiClock className="mr-2" />
                      <span>{formatTimeRemaining()}</span>
                    </div>

                    <div className="flex items-center text-gray-700 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                      <FiFileText className="mr-2 text-indigo-600" />
                      <span>{assignment.points || 0} points</span>
                    </div>
                  </div>
                </div>

                {isTeacher && (
                  <div className="flex flex-wrap gap-3 mt-2 md:mt-0">
                    <button
                      onClick={handleViewSubmissions}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center"
                    >
                      <FiDownload className="mr-2" />
                      View Submissions
                    </button>
                    <button
                      onClick={handleDeleteAssignment}
                      className="px-4 py-2 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors shadow-sm flex items-center"
                    >
                      <FiTrash2 className="mr-2" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Content section */}
            <div className="px-6 py-6">
              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <FiInfo className="mr-2 text-indigo-600" />
                  Assignment Details
                </h2>

                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 mb-6">
                  <p className="text-gray-700 whitespace-pre-line">
                    {assignment.description || "No description provided."}
                  </p>
                </div>
              </div>

              {isStudent && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <FiUpload className="mr-2 text-indigo-600" />
                    Your Submission
                  </h2>

                  {submitted ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex items-start">
                      <FiCheckCircle className="text-green-500 mt-0.5 mr-4 flex-shrink-0 h-5 w-5" />
                      <div>
                        <h3 className="text-base font-medium text-green-800 mb-2">
                          Assignment submitted successfully!
                        </h3>
                        <p className="text-sm text-green-700 mb-4">
                          Your work has been submitted. You can still make
                          changes and resubmit until the due date.
                        </p>

                        <div className="bg-white rounded-lg border border-green-100 p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-green-800">
                              Submitted files:
                            </h4>
                            <button
                              onClick={openPreviewModal}
                              className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                            >
                              Preview Files
                            </button>
                          </div>
                          <ul className="space-y-2">
                            {files.map((file, index) => (
                              <li
                                key={index}
                                className="flex items-center text-sm text-green-700 bg-green-50 px-3 py-2 rounded-md"
                              >
                                <FiFile className="mr-2 flex-shrink-0" />
                                <span className="truncate">{file.name}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-4 flex space-x-3">
                          <button
                            onClick={() => setSubmitted(false)}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                          >
                            Edit Submission
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                      <div className="mb-5">
                        <h3 className="text-base font-medium text-gray-800 mb-2">
                          Upload your assignment files
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Please upload all required files for this assignment.
                          Accepted file formats: PDF, DOC, DOCX, JPG, PNG.
                        </p>

                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          className="hidden"
                          multiple
                        />
                        <button
                          onClick={() => fileInputRef.current.click()}
                          className="px-4 py-2 border border-indigo-300 rounded-lg shadow-sm text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        >
                          <FiUpload className="inline-block mr-2" />
                          Select Files
                        </button>
                      </div>

                      {files.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-sm font-medium text-gray-700 mb-2">
                            Files ready to submit ({files.length}):
                          </h3>
                          <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                            {files.map((file, index) => (
                              <li
                                key={index}
                                className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-gray-200 hover:border-indigo-200 transition-colors"
                              >
                                <div className="flex items-center overflow-hidden">
                                  <FiFile className="text-indigo-500 mr-3 flex-shrink-0" />
                                  <div className="overflow-hidden">
                                    <span className="text-sm font-medium text-gray-700 block truncate">
                                      {file.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {(file.size / 1024).toFixed(1)} KB
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => removeFile(index)}
                                  className="ml-2 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                                  aria-label="Remove file"
                                >
                                  <FiTrash2 className="h-4 w-4" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <button
                          onClick={handleSubmit}
                          disabled={files.length === 0 || submitting}
                          className={`px-5 py-2.5 rounded-lg text-sm font-medium text-white shadow-sm w-full sm:w-auto ${
                            files.length === 0 || submitting
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-indigo-600 hover:bg-indigo-700 transition-colors"
                          }`}
                        >
                          {submitting ? (
                            <>
                              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2 align-[-0.125em]"></span>
                              Submitting...
                            </>
                          ) : (
                            "Submit Assignment"
                          )}
                        </button>

                        <button
                          onClick={() => setFiles([])}
                          disabled={files.length === 0 || submitting}
                          className={`px-5 py-2.5 rounded-lg text-sm font-medium border w-full sm:w-auto ${
                            files.length === 0 || submitting
                              ? "border-gray-200 text-gray-300 cursor-not-allowed"
                              : "border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                          }`}
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      {/* File Preview Modal */}
      <FilePreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        files={files}
      />
      <Footer />
    </div>
  );
}
