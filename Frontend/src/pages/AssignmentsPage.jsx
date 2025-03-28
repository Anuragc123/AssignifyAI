"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FiPlus,
  FiFilter,
  FiSearch,
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiCalendar,
  FiUsers,
  FiAward,
  FiInbox,
  FiChevronRight,
  FiX,
  FiRefreshCw,
} from "react-icons/fi";
import axios from "axios";
import { baseUrl } from "../backend-url";
import { useSelector } from "react-redux";

export default function AssignmentsPage() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("dueDate"); // Default sort by due date

  const user = useSelector((state) => state.auth.userData);
  const isTeacher = user.role === "teacher";

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/user/getAssignmentData`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setAssignments(response.data.assignments);
        setError(null);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
      setError("Failed to load assignments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredAssignments = assignments
    .filter((assignment) => {
      const matchesSearch =
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.teamName.toLowerCase().includes(searchTerm.toLowerCase());

      if (filter === "all") return matchesSearch;
      return assignment.status === filter && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "dueDate") {
        let dateTimeA, dateTimeB;

        if (a.dueDate && a.dueDate.includes("/")) {
          const [dayA, monthA, yearA] = a.dueDate.split("/");
          const dateStringA = `${yearA}-${monthA.padStart(
            2,
            "0"
          )}-${dayA.padStart(2, "0")}T${a.dueTime || "23:59"}`;
          dateTimeA = new Date(dateStringA);
        } else {
          dateTimeA = new Date(`${a.dueDate}T${a.dueTime || "23:59"}`);
        }

        if (b.dueDate && b.dueDate.includes("/")) {
          const [dayB, monthB, yearB] = b.dueDate.split("/");
          const dateStringB = `${yearB}-${monthB.padStart(
            2,
            "0"
          )}-${dayB.padStart(2, "0")}T${b.dueTime || "23:59"}`;
          dateTimeB = new Date(dateStringB);
        } else {
          dateTimeB = new Date(`${b.dueDate}T${b.dueTime || "23:59"}`);
        }

        return dateTimeA - dateTimeB;
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      } else if (sortBy === "points") {
        return b.points - a.points;
      }
      return 0;
    });

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 flex items-center">
            <FiClock className="mr-1" size={12} />
            Active
          </span>
        );
      case "grading":
        return (
          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800 flex items-center">
            <FiAlertCircle className="mr-1" size={12} />
            Grading
          </span>
        );
      case "completed":
        return (
          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 flex items-center">
            <FiCheckCircle className="mr-1" size={12} />
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString, timeString) => {
    if (!dateString) return "No due date";

    // Handle DD/MM/YYYY format
    let date;
    if (dateString.includes("/")) {
      const [day, month, year] = dateString.split("/");
      date = new Date(
        `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
      );
    } else {
      date = new Date(dateString);
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.error("Invalid date format:", dateString);
      return "Invalid date";
    }

    const formattedDate = date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return timeString ? `${formattedDate} at ${timeString}` : formattedDate;
  };

  const isDueSoon = (dateString, timeString = "23:59") => {
    if (!dateString) return false;

    let dueDateTime;
    if (dateString.includes("/")) {
      const [day, month, year] = dateString.split("/");
      dueDateTime = new Date(
        `${year}-${month.padStart(2, "0")}-${day.padStart(
          2,
          "0"
        )}T${timeString}`
      );
    } else {
      dueDateTime = new Date(`${dateString}T${timeString}`);
    }

    if (isNaN(dueDateTime.getTime())) return false;

    const now = new Date();
    const diffTime = dueDateTime - now;
    const diffHours = diffTime / (1000 * 60 * 60);

    console.log("now:", now, "dueDateTime:", dueDateTime);

    return diffHours <= 12 && diffHours > 0; // Within 2 days
  };

  const isPastDue = (dateString, timeString = "23:59") => {
    if (!dateString) return false;

    let dueDateTime;
    if (dateString.includes("/")) {
      const [day, month, year] = dateString.split("/");
      dueDateTime = new Date(
        `${year}-${month.padStart(2, "0")}-${day.padStart(
          2,
          "0"
        )}T${timeString}`
      );
    } else {
      dueDateTime = new Date(`${dateString}T${timeString}`);
    }

    if (isNaN(dueDateTime.getTime())) return false;

    const now = new Date();

    // console.log("now:", now, "dueDateTime:", dueDateTime);

    return dueDateTime < now;
  };

  const getDueDateClasses = (dateString, timeString) => {
    if (isPastDue(dateString, timeString)) return "text-red-600 font-medium";
    if (isDueSoon(dateString, timeString)) return "text-amber-600 font-medium";
    return "text-gray-600";
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const clearFilters = () => {
    setFilter("all");
    setSearchTerm("");
    setSortBy("dueDate");
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow bg-gray-50 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading assignments...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
              <p className="text-sm text-gray-500 mt-1">
                {filteredAssignments.length}{" "}
                {filteredAssignments.length === 1
                  ? "assignment"
                  : "assignments"}{" "}
                found
              </p>
            </div>

            {isTeacher && (
              <button
                onClick={() => navigate("/assignments/create")}
                className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg flex items-center hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <FiPlus className="mr-2" />
                Create Assignment
              </button>
            )}
          </div>

          {/* Search and filter section */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by title or team name..."
                  className="pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <FiX size={18} />
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center space-x-2">
                  <FiFilter className="text-gray-500" />
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="grading">Grading</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <FiFilter className="text-gray-500" />
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="dueDate">Sort by Due Date</option>
                    <option value="title">Sort by Title</option>
                    <option value="points">Sort by Points</option>
                  </select>
                </div>

                {(filter !== "all" || searchTerm || sortBy !== "dueDate") && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center justify-center px-3 py-2.5 text-sm text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    <FiRefreshCw className="mr-2" size={14} />
                    Reset Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start">
              <FiAlertCircle className="mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium">Error loading assignments</p>
                <p className="text-sm">{error}</p>
              </div>
              <button
                onClick={fetchAssignments}
                className="ml-auto bg-red-100 text-red-700 px-3 py-1 rounded-md text-sm hover:bg-red-200 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty state */}
          {filteredAssignments.length === 0 && !loading && !error && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FiInbox className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No assignments found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filter !== "all"
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : isTeacher
                  ? "Create your first assignment to get started."
                  : "You don't have any assignments yet."}
              </p>
              {isTeacher && (filter !== "all" || searchTerm) && (
                <button
                  onClick={() => navigate("/assignments/create")}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg inline-flex items-center hover:bg-indigo-700 transition-colors"
                >
                  <FiPlus className="mr-2" />
                  Create Assignment
                </button>
              )}
            </div>
          )}

          {/* Assignment list */}
          {filteredAssignments.length > 0 && (
            <div className="grid gap-4">
              {filteredAssignments.map((assignment) => (
                <div
                  key={assignment.assignmentId}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden"
                  onClick={() =>
                    navigate(`/assignments/${assignment.assignmentId}`)
                  }
                >
                  <div className="p-5 cursor-pointer">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start">
                        <div
                          className={`flex-shrink-0 h-12 w-12 rounded-lg flex items-center justify-center ${
                            assignment.status === "completed"
                              ? "bg-green-100"
                              : assignment.status === "grading"
                              ? "bg-amber-100"
                              : "bg-indigo-100"
                          }`}
                        >
                          <FiFileText
                            className={`h-6 w-6 ${
                              assignment.status === "completed"
                                ? "text-green-600"
                                : assignment.status === "grading"
                                ? "text-amber-600"
                                : "text-indigo-600"
                            }`}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {assignment.title}
                            </h3>
                            {getStatusBadge(assignment.status)}
                          </div>
                          <div className="text-sm text-gray-600 flex items-center">
                            <FiUsers className="mr-1" size={14} />
                            Team: {assignment.teamName}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm ml-16 sm:ml-0">
                        <div
                          className={`flex items-center ${getDueDateClasses(
                            assignment.dueDate,
                            assignment.dueTime
                          )}`}
                        >
                          <FiCalendar className="mr-1.5" size={14} />
                          {formatDate(assignment.dueDate, assignment.dueTime)}
                        </div>

                        <div className="flex items-center text-gray-600">
                          <FiAward
                            className="mr-1.5 text-indigo-500"
                            size={14}
                          />
                          {assignment.points} points
                        </div>

                        <div className="flex items-center text-gray-600">
                          <FiUsers
                            className="mr-1.5 text-indigo-500"
                            size={14}
                          />
                          <span>
                            {assignment.submissionCount}/
                            {assignment.teamMembersCount} submitted
                          </span>
                        </div>

                        <FiChevronRight className="hidden sm:block ml-2 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  {assignment.status === "active" && (
                    <div className="h-1.5 w-full bg-gray-100">
                      <div
                        className={`h-full ${
                          isPastDue(assignment.dueDate, assignment.dueTime)
                            ? "bg-red-500"
                            : isDueSoon(assignment.dueDate, assignment.dueTime)
                            ? "bg-amber-500"
                            : "bg-indigo-500"
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            (assignment.submissionCount /
                              assignment.teamMembersCount) *
                              100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
