import { useState } from "react";
import Player from "./Player";
import { Button, Icon, Table } from '@clickhouse/click-ui';
import { useNavigate } from 'react-router-dom';

const TIER_ORDER = [
    "CHALLENGER", "GRANDMASTER", "MASTER", "DIAMOND", "EMERALD", "PLATINUM", "GOLD", "SILVER", "BRONZE", "IRON"
];
const RANK_ORDER = ["I", "II", "III", "IV"];

export default function LeaderboardTable({ leaderboard, handleDelete, handleRefresh, handleUpdate, showAddRow }) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const safeLeaderboard = Array.isArray(leaderboard) ? leaderboard : [];
    const columns = safeLeaderboard.length > 0 ? Object.keys(safeLeaderboard[0]) : [
        'SUMMONER NAME', 'TIER', 'RANK', 'LP', 'WINRATE', 'WINS', 'LOSSES'
    ];
    console.log(safeLeaderboard)
    // Sort leaderboard by tier (descending) and rank (ascending)
    const sortedLeaderboard = [...safeLeaderboard].sort((a, b) => {
        const tierA = TIER_ORDER.indexOf(a.tier);
        const tierB = TIER_ORDER.indexOf(b.tier);
        if (tierA !== tierB) return tierA - tierB;
        const rankA = RANK_ORDER.indexOf(a.rank);
        const rankB = RANK_ORDER.indexOf(b.rank);
        return rankA - rankB;
    });

    const handleUpdateClick = async () => {
        setLoading(true);
        try {
            await handleUpdate();
        } finally {
            setLoading(false);
        }
    };

    // Remove 'tagLine' from columns for display
    const displayColumns = columns.filter(col => col.toLowerCase() !== 'tagline');

    // Add empty row with plus button
    const addPlayerRow = {
        id: 'add-player',
        isDeleted: true,
        items: displayColumns.map((_, idx) => {
            if (idx === 0) {
                return {
                    label: (
                        <Button type="secondary" onClick={() => navigate('/add')} fillWidth={true} style={{
                            border: 'none',
                            boxShadow: 'none',
                            outline: 'none',
                            background: 'transparent',
                            minWidth: '100%',
                            minHeight: 32,
                            paddingLeft: 0,
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                        }}>
                            <Icon name="plus" size="md" />
                        </Button>
                    )
                };
            }
            return { label: '' };
        })
    };

    const tableRows = [
        ...sortedLeaderboard.map((player, idx) => Player({ player, columns: displayColumns, idx, handleDelete })),
        addPlayerRow
    ];

    return (
        <div align="center">
            <div className="leaderboard-header">
            </div>
            <Table
                className="leaderboard-table"
                headers={displayColumns.map(col => ({ label: col.replace(/_/g, ' ').toUpperCase() }))}
                rows={tableRows}
                onDelete={(item, index) => {
                    if (item.id !== 'add-player') {
                        handleDelete(item, index);
                    }
                }}
                onSelect={() => { }}
                onSort={() => { }}
                style={{
                    borderCollapse: "collapse",
                    tableLayout: "auto",
                    display: "inline-table",
                    fontFamily: "'Consolas', 'Menlo', 'Monaco', 'monospace'",
                    padding: "8px",
                }}
            />
        </div>
    );
}