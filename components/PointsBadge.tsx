type Props = {
  points: number;
  streak: number;
};

export default function PointsBadge({ points, streak }: Props) {
  return (
    <div className="flex gap-3 px-4 py-3">
      <div className="flex-1 bg-orange-50 rounded-xl p-3 text-center">
        <p className="text-2xl font-bold text-orange-600">🪙 {points}</p>
        <p className="text-xs text-gray-500">Aaroh Coins</p>
      </div>
      <div className="flex-1 bg-blue-50 rounded-xl p-3 text-center">
        <p className="text-2xl font-bold text-blue-700">{streak} 🔥</p>
        <p className="text-xs text-gray-500">Day Streak</p>
      </div>
    </div>
  );
}
