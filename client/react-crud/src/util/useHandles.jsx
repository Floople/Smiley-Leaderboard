import { useCallback, useState } from "react";
import LeaderboardService from "../services/LeaderboardService";

export default function useHandles({ setError, fetchLeaderboard }) {
  const [loading, setLoading] = useState(false);

  const handleRefresh = useCallback(() => {
    console.log('Action: Refreshing leaderboard');
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const handleUpdate = useCallback(async () => {
    setLoading(true);
    try {
      const response = await LeaderboardService.updateLeaderboard();
      if (response.status === 200) {
        fetchLeaderboard();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchLeaderboard, setError]);

  const handleDelete = useCallback(async (summoner_name, tagLine) => {
    try {
      await LeaderboardService.deletePlayer(summoner_name, tagLine);
      fetchLeaderboard();
    } catch (err) {
      setError(err.message);
    }
  }, [fetchLeaderboard, setError]);

  return { handleRefresh, handleUpdate, handleDelete, loading };
}