import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FiPlus,
  FiUsers,
  FiSearch,
  FiX,
  FiUpload,
  FiCopy,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import axios from "axios";
import { baseUrl } from "../backend-url";
import { useSelector } from "react-redux";

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const user = useSelector((state) => state.auth.userData);
  // console.log("User=", user);

  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: "",
    photo: null,
  });
  const [teamCode, setTeamCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [showTeamCode, setShowTeamCode] = useState(false);

  useEffect(() => {
    async function getTeamsData() {
      const response = await axios.get(`${baseUrl}/user/getTeamsData`, {
        withCredentials: true,
      });
      // console.log("Response=", response.data);
      if (response.data.success) {
        setTeams((prevTeams) => [...prevTeams, ...response.data.teams]);
      }
    }

    getTeamsData();
    // console.log("Teams array after useEffect: ", teams);
  }, []);


  const isTeacher = user?.role === "teacher";
  // console.log(isTeacher);

  const filteredTeams = teams.filter((team) => {
    if (searchTerm == "") return true;

    return team.teamName.toLowerCase().includes(searchTerm.toLowerCase()) || team.teacher.name.toLowerCase().includes(searchTerm.toLowerCase());
  });
  // console.log(filteredTeams);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    // In a real app, this would be an API call to create a team
    const generatedCode = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    const newTeamData = {
      code: generatedCode,
      id: teams.length + 1,
      teamName: newTeam.name,
      teacherName: user.name,
      members: 1,
      createdAt: new Date().toISOString().split("T")[0],
    };

    const response = await axios.post(
      `${baseUrl}/user/createTeam`,
      newTeamData,
      {
        withCredentials: true,
      }
    );

    const response2 = await axios.post(
      `${baseUrl}/user/joinTeam`,
      { joinCode: generatedCode },
      {
        withCredentials: true,
      }
    );

    if (response.data.teamCreated && response2.data.teamJoined) {
      // setTeams((prevTeams) => [...prevTeams, ...response.data.teams]);
      setTeamCode(generatedCode);
      setShowTeamCode(true);
    }

    console.log("Creating Team Reponse: ", response);
  };

  const handleJoinTeam = async (e) => {
    e.preventDefault();
    // In a real app, this would be an API call to join a team
    // alert(`Joining team with code: ${joinCode}`);
    const response = await axios.post(
      `${baseUrl}/user/joinTeam`,
      { joinCode },
      {
        withCredentials: true,
      }
    );

    console.log("Team joining response: ", response);
    setShowJoinModal(false);
    setJoinCode("");
  };

  const handlePhotoChange = (e) => {
    // Handle photo upload
    if (e.target.files && e.target.files[0]) {
      setNewTeam({
        ...newTeam,
        photo: e.target.files[0],
      });
    }
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setNewTeam({ name: "", photo: null });
    setShowTeamCode(false);
    setTeamCode("");
  };

  const canEditTeam = (team) => {
    return isTeacher && team.teacher._id === user.id;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Your Teams</h1>
            {isTeacher ? (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md flex items-center hover:bg-indigo-700 transition-colors"
              >
                <FiPlus className="mr-2" />
                Create Team
              </button>
            ) : (
              <button
                onClick={() => setShowJoinModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md flex items-center hover:bg-indigo-700 transition-colors"
              >
                <FiUsers className="mr-2" />
                Join Team
              </button>
            )}
          </div>

          <div className="mb-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search teams..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team) => (
              <div
                key={team._id}
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                  backdropFilter: "blur(4px)",
                }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {team.teamName}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Teacher: {team.teacher.name}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <FiUsers className="mr-1" />
                        <span>{team.users} participants</span>
                      </div>
                    </div>
                    {canEditTeam(team) && (
                      <div className="flex space-x-2">
                        <button className="p-1 rounded-full hover:bg-gray-100">
                          <FiEdit2 className="h-5 w-5 text-gray-500" />
                        </button>
                        <button className="p-1 rounded-full hover:bg-gray-100">
                          <FiTrash2 className="h-5 w-5 text-gray-500" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Create New Team
              </h2>
              <button
                onClick={closeCreateModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>

            {!showTeamCode ? (
              <form onSubmit={handleCreateTeam}>
                <div className="mb-4">
                  <label
                    htmlFor="teamName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Team Name
                  </label>
                  <input
                    type="text"
                    id="teamName"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={newTeam.name}
                    onChange={(e) =>
                      setNewTeam({ ...newTeam, name: e.target.value })
                    }
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Team Photo (Optional)
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FiUpload className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG or GIF (MAX. 2MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handlePhotoChange}
                      />
                    </label>
                  </div>
                  {newTeam.photo && (
                    <p className="mt-2 text-sm text-gray-500">
                      Selected: {newTeam.photo.name}
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={closeCreateModal}
                    className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  >
                    Create Team
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-4">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Team Created Successfully!
                  </h3>
                  <p className="text-sm text-gray-600">
                    Share this code with your students to join the team:
                  </p>
                </div>

                <div className="flex items-center justify-center mb-6">
                  <div className="bg-gray-100 px-4 py-3 rounded-md text-xl font-mono font-bold tracking-wider text-indigo-700">
                    {teamCode}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(teamCode);
                      // alert("Team code copied to clipboard!");
                    }}
                    className="ml-2 p-2 text-gray-500 hover:text-indigo-600"
                  >
                    <FiCopy />
                  </button>
                </div>

                <button
                  onClick={closeCreateModal}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Join Team Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Join a Team</h2>
              <button
                onClick={() => setShowJoinModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleJoinTeam}>
              <div className="mb-6">
                <label
                  htmlFor="teamCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Enter Team Code
                </label>
                <input
                  type="text"
                  id="teamCode"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. ABC123"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Join Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
