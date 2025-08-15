import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import LeaderboardService from "./services/LeaderboardService.jsx";
import AddPlayer from "./components/AddPlayer.jsx";
import Leaderboard from "./components/Leaderboard.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { ClickUIProvider, Button, Icon } from '@clickhouse/click-ui';


// Main App component
function App() {
  const [backEndData, setBackEndData] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    theme === 'dark' ? setTheme('light') : setTheme('dark')
  }

  useEffect(() => {
    console.log('Action: Fetching leaderboard data');
    LeaderboardService.getAll()
      .then(response => {
        console.log('Action: Received leaderboard data', response.data);
        setBackEndData(response.data);
      })
      .catch(err => {
        console.log('Action: Error fetching leaderboard data', err);
        setError(err.message);
      });
  }, []);

  // Log navigation actions and navigate
  const handleNav = (destination) => {
    console.log(`Action: Navigating to ${destination}`);
    navigate(destination);
  };
  
  console.log('Leaderboard data:', backEndData.leaderboard);
  return (
     <ClickUIProvider theme={theme} >
      <div className="MainPage">
        <div className="Switch">
          <Button type="primary" onClick={() => toggleTheme()} style={{ border: 'none', boxShadow: 'none', outline: 'none', background: 'transparent' }}>
            <Icon name={theme === 'dark' ? 'star' : 'moon'} size="xs" style={{ color: theme === 'dark' ? '#ffff66' : '#222' }} />
          </Button>
        </div>
        <div className="Menu">
          <nav>
            <Button type="primary" onClick={() => handleNav('/')}>Leaderboard</Button>
            {/*<Button type="primary" onClick={() => handleNav('/add')}>Add Player</Button>*/}
          </nav>
        </div>
        <Routes>
          <Route path="/" element={<Leaderboard leaderboard={backEndData.leaderboard || []} error={error} />} />
          <Route path="/add" element={(() => { console.log('Action: Displaying AddPlayer form'); return <AddPlayer />; })()} />
        </Routes>
      </div>
    </ClickUIProvider>
  );
}

export default App;
