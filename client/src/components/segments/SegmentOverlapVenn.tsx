import { fNumber } from "@/lib/formatters";

interface SegmentOverlapVennProps {
  segmentA: { name: string; size: number };
  segmentB: { name: string; size: number };
  overlapCount: number;
  onlyA: number;
  onlyB: number;
}

export default function SegmentOverlapVenn({
  segmentA,
  segmentB,
  overlapCount,
  onlyA,
  onlyB,
}: SegmentOverlapVennProps) {
  // SVG dimensions
  const width = 420;
  const height = 220;
  const cx1 = 155;
  const cx2 = 265;
  const cy = 110;
  const r = 90;

  return (
    <div className="flex justify-center">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full max-w-[420px]"
        aria-label="Venn diagram showing segment overlap"
      >
        {/* Circle A */}
        <circle
          cx={cx1}
          cy={cy}
          r={r}
          fill="#3b82f6"
          fillOpacity={0.15}
          stroke="#3b82f6"
          strokeWidth={2}
        />

        {/* Circle B */}
        <circle
          cx={cx2}
          cy={cy}
          r={r}
          fill="#f97316"
          fillOpacity={0.15}
          stroke="#f97316"
          strokeWidth={2}
        />

        {/* Overlap region (intersection) — darker shade */}
        <clipPath id="clip-a">
          <circle cx={cx1} cy={cy} r={r} />
        </clipPath>
        <circle
          cx={cx2}
          cy={cy}
          r={r}
          fill="#8b5cf6"
          fillOpacity={0.25}
          clipPath="url(#clip-a)"
        />

        {/* Labels: Only A */}
        <text
          x={cx1 - 42}
          y={cy - 12}
          textAnchor="middle"
          className="text-xs fill-blue-700 font-semibold"
          fontSize={11}
        >
          {fNumber(onlyA)}
        </text>
        <text
          x={cx1 - 42}
          y={cy + 6}
          textAnchor="middle"
          className="text-[10px] fill-blue-500"
          fontSize={9}
        >
          Only A
        </text>

        {/* Labels: Overlap */}
        <text
          x={(cx1 + cx2) / 2}
          y={cy - 12}
          textAnchor="middle"
          className="text-xs fill-purple-700 font-bold"
          fontSize={13}
        >
          {fNumber(overlapCount)}
        </text>
        <text
          x={(cx1 + cx2) / 2}
          y={cy + 6}
          textAnchor="middle"
          className="text-[10px] fill-purple-500"
          fontSize={9}
        >
          Overlap
        </text>

        {/* Labels: Only B */}
        <text
          x={cx2 + 42}
          y={cy - 12}
          textAnchor="middle"
          className="text-xs fill-orange-700 font-semibold"
          fontSize={11}
        >
          {fNumber(onlyB)}
        </text>
        <text
          x={cx2 + 42}
          y={cy + 6}
          textAnchor="middle"
          className="text-[10px] fill-orange-500"
          fontSize={9}
        >
          Only B
        </text>

        {/* Segment names below circles */}
        <text
          x={cx1 - 30}
          y={height - 8}
          textAnchor="middle"
          className="text-xs fill-gray-700 font-medium"
          fontSize={11}
        >
          {segmentA.name.length > 20
            ? segmentA.name.slice(0, 18) + "..."
            : segmentA.name}
        </text>
        <text
          x={cx2 + 30}
          y={height - 8}
          textAnchor="middle"
          className="text-xs fill-gray-700 font-medium"
          fontSize={11}
        >
          {segmentB.name.length > 20
            ? segmentB.name.slice(0, 18) + "..."
            : segmentB.name}
        </text>
      </svg>
    </div>
  );
}
