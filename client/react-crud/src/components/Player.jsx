export default function Player({ player, columns, idx, handleDelete }) {
  // Defensive: always return items as an array
  const safeColumns = Array.isArray(columns) ? columns : [];
  return {
    tagLine: player.tagLine ? String(player.tagLine) : `row-${idx}`,
    summoner_name: player?.summoner_name || '',
    items: safeColumns.filter(col => col !== 'tagLine').map(col => {
  if (col === 'Rank') {
    if (player.Rank === 1) {
      return { label: <span role="img" aria-label="gold">1🥇</span> };
    }
    if (player.Rank === 2) {
      return { label: <span role="img" aria-label="silver">2🥈</span> };
    }
    if (player.Rank === 3) {
      return { label: <span role="img" aria-label="bronze">3🥉</span> };
    }
    return { label: player.Rank };
  }
  return { label: player?.[col] ?? '' };
}),
  };
}