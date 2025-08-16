import axios from "axios";

export default axios.create({
  baseURL: "https://smiley-leaderboard.michaelzhangflys.workers.dev/api",
  headers: {
    "Content-type": "application/json"
  }
});