import LeaderboardTable from "./LeaderboardTable";
import {Button, Icon } from '@clickhouse/click-ui';

const Leaderboard = ({leaderboard,handleUpdate,handleDelete,handleRefresh,loading,error}) => {

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
                {error && <div className="error">Error: {typeof error === 'string' ? error : (error.message || JSON.stringify(error))}</div>}
        </div>
    );
}

export default Leaderboard;