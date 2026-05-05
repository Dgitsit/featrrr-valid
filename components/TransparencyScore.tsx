type Props = {
  score: number;
};

export default function TransparencyScore({ score }: Props) {
  return (
    <div className="border border-gray-700 rounded-xl p-4">
      <h2 className="mb-2 font-semibold text-white">Transparency Score</h2>

      <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-orange-400"
          style={{ width: `${score}%` }}
        />
      </div>

      <p className="text-sm text-gray-400 mt-2">
        High transparency creators rank higher and earn more trust.
      </p>
    </div>
  );
}
