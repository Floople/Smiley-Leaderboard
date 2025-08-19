import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import LeaderboardService from "./services/LeaderboardService.jsx";
import AddPlayer from "./components/AddPlayer.jsx";
import Leaderboard from "./components/Leaderboard.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { ClickUIProvider, Button, Icon } from '@clickhouse/click-ui';
import useHandles from "./util/useHandles.jsx";

function App() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    theme === 'dark' ? setTheme('light') : setTheme('dark')
  }

  const fetchLeaderboard = useCallback(async (retryCount = 0) => {
    try {
      const response = await LeaderboardService.getAll();
      const data = response.data.leaderboard;
      if (Array.isArray(data)) {
        setLeaderboard(data);
      } else {
        setLeaderboard([]);
        console.log('Leaderboard data from API is not an array:', data);
      }
    } catch (err) {
      if (err.message.includes('Failed to fetch leaderboard data') && retryCount < 3) {
        setTimeout(() => fetchLeaderboard(retryCount + 1), 500);
      } else {
        setError(err.message);
      }
    }
  }, []);

  useEffect(() => {
    console.log('Action: Fetching leaderboard data');
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const { handleUpdate, loading, handleDelete, handleRefresh } = useHandles({ setError, fetchLeaderboard });

  // Log navigation actions and navigate
  const handleNav = (destination) => {
    console.log(`Action: Navigating to ${destination}`);
    navigate(destination);
  };

  console.log('Leaderboard data:', leaderboard);
  return (
    <ClickUIProvider theme={theme} >
      <div className="MainPage">
        <div className="Switch">
          <Button type="primary" onClick={() => toggleTheme()} style={{ border: 'none', boxShadow: 'none', outline: 'none', background: 'transparent' }}>
            <Icon name={theme === 'dark' ? 'star' : 'moon'} size="md" style={{ color: theme === 'dark' ? '#ffff66' : '#222' }} />
          </Button>
        </div>
        <div className="Menu">
          <nav>
            <Button type="primary" onClick={() => handleNav('')}>Leaderboard</Button>
            {/*<Button type="primary" onClick={() => handleNav('/add')}>Add Player</Button>*/}
          </nav>
        </div>
        <Routes>
          <Route path="/" element={<Leaderboard leaderboard={leaderboard} handleUpdate={handleUpdate} handleDelete={handleDelete} handleRefresh={handleRefresh} loading={loading} error={error} />} />
          <Route path="/add" element={<AddPlayer onPlayerAdded={fetchLeaderboard} />} />
        </Routes>
      </div>
    </ClickUIProvider>
  );
}

export default App;
