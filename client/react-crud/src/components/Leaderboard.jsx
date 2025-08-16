import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import LeaderboardService from "../services/LeaderboardService";
import LeaderboardTable from "./LeaderboardTable";
import useHandles from "../util/useHandles.jsx";
import {Button, Icon } from '@clickhouse/click-ui';

const Leaderboard = props => {
    const { id } = useParams();
    const [leaderboard, setLeaderboard] = useState([]);
    const [error, setError] = useState(null);

    const fetchLeaderboard = async () => {
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
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
    }, [id]);

    // Filtered leaderboard with only required fields
    const filteredLeaderboard = leaderboard.map(player => ({
        summoner_name: player.summoner_name,
        tagLine: player.tagLine,
        tier: player.tier,
        rank: player.rank,
        lp: player.lp,
        winrate: player.winrate,
        wins: player.wins,
        losses: player.loss
    }));

    const { handleUpdate, loading, handleDelete, handleRefresh } = useHandles({ setError, fetchLeaderboard });

    // Defensive: always use array
    const safeLeaderboard = Array.isArray(filteredLeaderboard) ? filteredLeaderboard : [];
    // Always show header and update button
    return (
        <div>
            <div className="leaderboard-header">
                <h2 className="Smiley" color="default" family="brand" size="md">:)</h2>
                <div className="leaderboard-header-buttons">
                    <Button onClick={handleUpdate} type="secondary" loading={loading} style={{ border: 'none', boxShadow: 'none', outline: 'none', background: 'transparent' }}>
                        <Icon name="refresh" size="md" state="default" height={12} width={12} />
                    </Button>
                </div>
            </div>
            <LeaderboardTable
                leaderboard={safeLeaderboard}
                handleDelete={handleDelete}
                handleRefresh={handleRefresh}
                handleUpdate={handleUpdate}
                showAddRow={safeLeaderboard.length === 0}
            />
            {error && <div className="errorMessage">{error}</div>}
        </div>
    );
}

export default Leaderboard;