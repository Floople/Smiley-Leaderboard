import http from "../http-common";

const getAll = () => {
  return http.get("");
};

const create = data => {
  return http.post("/insert", data);
};

const updateLeaderboard = () => {
  return http.post("/update");
};

const deletePlayer = (items, index) => {
  return http.post("/delete", { items, index });
};

const LeaderboardService = {
  getAll,
  create,
  updateLeaderboard,
  deletePlayer
};

export default LeaderboardService;