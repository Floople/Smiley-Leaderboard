export default function Player({ player, columns, idx, handleDelete }) {
  // Defensive: always return items as an array
  const safeColumns = Array.isArray(columns) ? columns : [];
  return {
    tagLine: player.tagLine ? String(player.tagLine) : `row-${idx}`,
    summoner_name: player?.summoner_name || '',
    items: safeColumns.filter(col => col !== 'tagLine').map(col => ({ label: player?.[col] ?? '' })),
  };
}