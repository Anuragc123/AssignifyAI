"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiSave, FiX, FiCalendar, FiUsers, FiClock } from "react-icons/fi";
import axios from "axios";
import { baseUrl } from "../backend-url";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function CreateAssignmentPage() {
  const [assignment, setAssignment] = useState({
    title: "",
    description: "",
    teamId: "",
    dueDate: "",
    dueTime: "",
    points: 100,
  });

  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTeams() {
      try {
        const response = await axios.get(`${baseUrl}/user/getTeamsData`, {
          withCredentials: true,
        });
        if (response.data.success) {
          setTeams(response.data.teams);
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    }
    fetchTeams();
  }, []);

  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
  };

  const getCurrentTime = () => {
    return new Date().toTimeString().slice(0, 5); // Format: HH:MM
  };

  const validateDateTime = (date, time) => {
    if (!date || !time) return true;

    const now = new Date();
    const selectedDateTime = new Date(`${date}T${time}`);

    return selectedDateTime > now;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Create a new assignment state with the updated field
    const updatedAssignment = { ...assignment, [name]: value };

    // If changing date or time, validate the combination
    if (name === "dueDate" || name === "dueTime") {
      const isValid = validateDateTime(
        name === "dueDate" ? value : updatedAssignment.dueDate,
        name === "dueTime" ? value : updatedAssignment.dueTime
      );

      // If invalid and both fields have values, reset the time if date is today
      if (!isValid && updatedAssignment.dueDate && updatedAssignment.dueTime) {
        if (updatedAssignment.dueDate === getCurrentDate()) {
          // If date is today and time is invalid, reset time to current time
          updatedAssignment.dueTime = getCurrentTime();
          toast.error("Due time must be in the future");
        }
      }
    }

    setAssignment(updatedAssignment);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate date and time before submission
    if (!validateDateTime(assignment.dueDate, assignment.dueTime)) {
      toast.error("Due date and time must be in the future");
      return;
    }

    try {
      const response = await axios.post(
        `${baseUrl}/user/createAssignment`,
        assignment,
        {
          withCredentials: true,
        }
      );
      console.log("Assignment created:", response.data);
      toast.success("Assignment created successfully.");
      navigate("/assignments");
    } catch (error) {
      toast.error("Failed to create assignment. Please try again.");
      console.error("Error creating assignment:", error);
    }
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
                onClick={() => window.history.back()}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center"
              >
                <FiX className="mr-2" /> Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center"
              >
                <FiSave className="mr-2" /> Save Assignment
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
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                      value={assignment.title}
                      onChange={handleChange}
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
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                      value={assignment.description}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="teamId"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Team
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUsers className="text-gray-400" />
                      </div>
                      <select
                        name="teamId"
                        id="teamId"
                        className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                        value={assignment.teamId}
                        onChange={handleChange}
                      >
                        <option value="" disabled>
                          Select a Team
                        </option>
                        {teams.map((team) => (
                          <option key={team._id} value={team._id}>
                            {team.teamName}
                          </option>
                        ))}
                      </select>
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
                        min={getCurrentDate()} // Restrict past dates
                        className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                        value={assignment.dueDate}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="dueTime"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Due Time
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiClock className="text-gray-400" />
                      </div>
                      <input
                        type="time"
                        name="dueTime"
                        id="dueTime"
                        className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                        value={assignment.dueTime}
                        onChange={handleChange}
                        min={
                          assignment.dueDate === getCurrentDate()
                            ? getCurrentTime()
                            : undefined
                        }
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
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                      value={assignment.points}
                      onChange={handleChange}
                    />
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
