import React, { useState } from "react";
import LeaderboardService from "../services/LeaderboardService";
import { Button, TextField, Title, Text } from '@clickhouse/click-ui';
import { useNavigate } from "react-router-dom";

export default function AddPlayer() {
  const [summonerName, setSummonerName] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await LeaderboardService.create({ summoner_name: summonerName, tagLine });
      setMessage("Player added successfully!");
      setSummonerName("");
      setTagLine("");
      navigate('/'); 
    } catch (error) {
      if (error.response && error.response.status) {
        setMessage("Error adding player: " + error.response.data.error);
      } else {
        setMessage("Unknown error occurred while adding player.");
      }
    }
  };

  return (
    <div className="add-player-container">
      <div className="add-player-title"><Title size="xxl" type="h2" style={{ fontSize: '2.5rem', fontWeight: 700}}>Add Player</Title></div>
      <form className="add-player-form" onSubmit={handleSubmit}>
        <TextField
          label="Tagline"
          value={tagLine}
          onChange={value => setTagLine(value)}
          placeholder="Enter Tagline"
          type="text"
          required
        />
        <TextField
          label="Summoner Name"
          value={summonerName}
          onChange={value => setSummonerName(value)}
          placeholder="Enter Summoner Name"
          required
        />
        <Button htmlType="submit" label="Add Player" type="secondary"></Button>
      </form>
      <div className="errorMessage"><Text size = "lg" weight="bold" color="danger">{message && <p>{message}</p>}</Text></div>
    </div>
  );
}