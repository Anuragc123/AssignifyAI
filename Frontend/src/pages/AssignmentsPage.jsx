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
} from "react-icons/fi";
import axios from "axios";
import { baseUrl } from "../backend-url";
import { useSelector } from "react-redux";

export default function AssignmentsPage() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const user = useSelector((state) => state.auth.userData);

  useEffect(() => {
    // console.log('useeffect assignment')
    async function getAssignmentData() {
      try {
        const response = await axios.get(`${baseUrl}/user/getAssignmentData`, {
          withCredentials: true,
        });

        if (response.data.success) {
          setAssignments(response.data.assignments);
        }
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    }

    getAssignmentData();
  }, []);

  const isTeacher = user.role === "teacher";

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.teamName.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === "all") return matchesSearch;
    return assignment.status === filter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 flex items-center">
            <FiClock className="mr-1" size={12} />
            Active
          </span>
        );
      case "grading":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 flex items-center">
            <FiAlertCircle className="mr-1" size={12} />
            Grading
          </span>
        );
      case "completed":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 flex items-center">
            <FiCheckCircle className="mr-1" size={12} />
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
            {isTeacher && (
              <button
                onClick={() => navigate("/assignments/create")}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md flex items-center hover:bg-indigo-700 transition-colors"
              >
                <FiPlus className="mr-2" />
                Create Assignment
              </button>
            )}
          </div>

          <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0">
            <div className="relative md:w-1/2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search assignments..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <FiFilter className="text-gray-500" />
              <select
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Assignments</option>
                <option value="active">Active</option>
                <option value="grading">Grading</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredAssignments.map((assignment) => (
                <li
                  key={assignment.assignmentId}
                  className="px-6 py-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    navigate(`/assignments/${assignment.assignmentId}`)
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <FiFileText className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {assignment.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          Team: {assignment.teamName}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {getStatusBadge(assignment.status)}
                      <div className="text-sm text-gray-500">
                        Due: {assignment.dueDate} at {assignment.dueTime}
                      </div>
                      <div className="text-sm text-gray-500">
                        Points: {assignment.points}
                      </div>
                      <div className="text-sm text-gray-500">
                        Submissions: {assignment.submissionCount}/
                        {assignment.teamMembersCount}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
