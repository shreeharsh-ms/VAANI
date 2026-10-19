import React from 'react';

// Clinical standard octave & inter-octave frequencies with fractional octave positions
export const AUDIOGRAM_FREQUENCIES = [
  { freq: '125', pos: 0, isOctave: true },
  { freq: '250', pos: 1, isOctave: true },
  { freq: '500', pos: 2, isOctave: true },
  { freq: '750', pos: 2.5, isOctave: false },
  { freq: '1000', pos: 3, isOctave: true },
  { freq: '1500', pos: 3.5, isOctave: false },
  { freq: '2000', pos: 4, isOctave: true },
  { freq: '3000', pos: 4.5, isOctave: false },
  { freq: '4000', pos: 5, isOctave: true },
  { freq: '6000', pos: 5.5, isOctave: false },
  { freq: '8000', pos: 6, isOctave: true },
];

export const DB_LEVELS = [-10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120];

/**
 * Standard Clinical Audiogram Single Ear SVG Graph
 */
export const SingleAudiogramGraph = ({
  ear = 'right', // 'right' | 'left'
  acData = {},
  bcData = {},
  width = 240,
  height = 200,
  className = '',
}) => {
  const isRight = ear === 'right';
  const themeColor = isRight ? '#dc2626' : '#2563eb'; // Red for Right, Blue for Left

  // Geometry dimensions
  const padLeft = 32;
  const padRight = 12;
  const padTop = 18;
  const padBottom = 22;

  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const minDb = -10;
  const maxDb = 120;
  const totalOctaves = 6;

  // Coordinate mappers
  const getX = (pos) => padLeft + (pos / totalOctaves) * plotW;
  const getY = (db) => padTop + ((Number(db) - minDb) / (maxDb - minDb)) * plotH;

  // Collect AC points for polyline
  const acPoints = AUDIOGRAM_FREQUENCIES.map((f) => {
    const val = acData?.[f.freq];
    if (val === undefined || val === null || val === '' || isNaN(Number(val))) return null;
    return {
      freq: f.freq,
      x: getX(f.pos),
      y: getY(val),
      val: Number(val),
    };
  }).filter(Boolean);

  const polylinePoints = acPoints.map((p) => `${p.x},${p.y}`).join(' ');

  // Collect BC points
  const bcFrequencies = ['250', '500', '1000', '2000', '4000'];
  const bcPoints = bcFrequencies.map((freq) => {
    const val = bcData?.[freq];
    if (val === undefined || val === null || val === '' || isNaN(Number(val))) return null;
    const fObj = AUDIOGRAM_FREQUENCIES.find((f) => f.freq === freq);
    if (!fObj) return null;
    return {
      freq,
      x: getX(fObj.pos),
      y: getY(val),
      val: Number(val),
    };
  }).filter(Boolean);

  return (
    <div className={`flex flex-col items-center w-full min-w-0 ${className}`}>
      {/* Ear Header */}
      <span
        className="text-[11px] sm:text-xs font-black uppercase tracking-wider mb-0.5"
        style={{ color: themeColor }}
      >
        {isRight ? 'Right' : 'Left'}
      </span>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible select-none max-w-full"
        style={{ maxWidth: `${width}px` }}
      >
        {/* Top Intermediate Octave Labels: 750, 1500, 3000, 6000 */}
        {AUDIOGRAM_FREQUENCIES.filter((f) => !f.isOctave).map((f) => (
          <text
            key={`top-${f.freq}`}
            x={getX(f.pos)}
            y={padTop - 5}
            textAnchor="middle"
            className="text-[7.5px] font-sans font-bold fill-slate-700"
          >
            {f.freq}
          </text>
        ))}

        {/* Vertical Grid Lines */}
        {AUDIOGRAM_FREQUENCIES.map((f) => {
          const x = getX(f.pos);
          return (
            <line
              key={`vline-${f.freq}`}
              x1={x}
              y1={padTop}
              x2={x}
              y2={padTop + plotH}
              stroke={f.isOctave ? '#cbd5e1' : '#94a3b8'}
              strokeWidth={f.isOctave ? 0.75 : 0.6}
              strokeDasharray={f.isOctave ? 'none' : '2,2'}
            />
          );
        })}

        {/* Horizontal Grid Lines & Y-axis dB Labels */}
        {DB_LEVELS.map((db) => {
          const y = getY(db);
          const isZero = db === 0;
          return (
            <g key={`hline-${db}`}>
              <line
                x1={padLeft}
                y1={y}
                x2={padLeft + plotW}
                y2={y}
                stroke={isZero ? '#64748b' : '#e2e8f0'}
                strokeWidth={isZero ? 1 : 0.75}
              />
              <text
                x={padLeft - 4}
                y={y + 2.5}
                textAnchor="end"
                className={`text-[7px] font-mono ${isZero ? 'font-bold fill-slate-900' : 'fill-slate-600'}`}
              >
                {db}
              </text>
            </g>
          );
        })}

        {/* Outer Plot Boundary Box */}
        <rect
          x={padLeft}
          y={padTop}
          width={plotW}
          height={plotH}
          fill="none"
          stroke="#475569"
          strokeWidth="1.2"
        />

        {/* Y-Axis Title: Rotated 'Sound Pressure Level in dB HL' */}
        <text
          x={-(padTop + plotH / 2)}
          y={10}
          transform="rotate(-90)"
          textAnchor="middle"
          className="text-[7px] font-bold tracking-tight fill-slate-700"
        >
          Sound Pressure Level in dB HL
        </text>

        {/* Bottom Octave Frequency Labels & Axis Title */}
        {AUDIOGRAM_FREQUENCIES.filter((f) => f.isOctave).map((f) => (
          <text
            key={`bot-${f.freq}`}
            x={getX(f.pos)}
            y={padTop + plotH + 9}
            textAnchor="middle"
            className="text-[7px] font-mono font-bold fill-slate-700"
          >
            {f.freq}
          </text>
        ))}
        <text
          x={padLeft + plotW / 2}
          y={padTop + plotH + 18}
          textAnchor="middle"
          className="text-[7.5px] font-bold fill-slate-700 tracking-wide"
        >
          Frequency in Hertz
        </text>

        {/* ── PLOTTED DATA ── */}

        {/* AC Connecting Polyline */}
        {polylinePoints && (
          <polyline
            points={polylinePoints}
            fill="none"
            stroke={themeColor}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        )}

        {/* AC Data Markers */}
        {acPoints.map((p) => (
          <g key={`ac-${p.freq}`}>
            {isRight ? (
              // Right Ear: Red Circle 'O'
              <circle
                cx={p.x}
                cy={p.y}
                r="3.5"
                fill="none"
                stroke={themeColor}
                strokeWidth="1.6"
              />
            ) : (
              // Left Ear: Blue Cross 'X'
              <g transform={`translate(${p.x}, ${p.y})`}>
                <line x1="-3" y1="-3" x2="3" y2="3" stroke={themeColor} strokeWidth="1.8" />
                <line x1="-3" y1="3" x2="3" y2="-3" stroke={themeColor} strokeWidth="1.8" />
              </g>
            )}
          </g>
        ))}

        {/* BC Data Markers: Right '<' and Left '>' */}
        {bcPoints.map((p) => {
          // Offset slightly so it does not collide with AC circle/cross
          const bcX = isRight ? p.x - 7 : p.x + 7;
          return (
            <g key={`bc-${p.freq}`} transform={`translate(${bcX}, ${p.y})`}>
              {isRight ? (
                // Right BC: '<'
                <path
                  d="M 3 -4 L -2 0 L 3 4"
                  fill="none"
                  stroke={themeColor}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                // Left BC: '>'
                <path
                  d="M -3 -4 L 2 0 L -3 4"
                  fill="none"
                  stroke={themeColor}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

/**
 * Standard Audiogram Symbol Legend Matrix matching Image 2
 */
export const AudiogramLegendTable = () => {
  return (
    <div className="border border-slate-700 text-[8.5px] bg-white self-center">
      <table className="border-collapse text-center">
        <thead>
          <tr className="border-b border-slate-700 bg-slate-50 font-bold">
            <th className="px-2 py-0.5 border-r border-slate-700 text-left text-[8px]">Symbol</th>
            <th className="px-2 py-0.5 border-r border-slate-700 text-rose-700 font-bold">Right</th>
            <th className="px-2 py-0.5 text-blue-700 font-bold">Left</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 text-[8px]">
          <tr>
            <td className="px-1.5 py-0.5 text-left border-r border-slate-700 text-slate-700">Unmasked AC</td>
            <td className="px-1.5 py-0.5 border-r border-slate-700 text-rose-700 font-bold text-[9px]">○</td>
            <td className="px-1.5 py-0.5 text-blue-700 font-bold text-[9px]">✕</td>
          </tr>
          <tr>
            <td className="px-1.5 py-0.5 text-left border-r border-slate-700 text-slate-700">Unmasked AC No Resp</td>
            <td className="px-1.5 py-0.5 border-r border-slate-700 text-rose-700 font-bold">○↘</td>
            <td className="px-1.5 py-0.5 text-blue-700 font-bold">✕↙</td>
          </tr>
          <tr>
            <td className="px-1.5 py-0.5 text-left border-r border-slate-700 text-slate-700">Unmasked BC</td>
            <td className="px-1.5 py-0.5 border-r border-slate-700 text-rose-700 font-bold text-[9px]">&lt;</td>
            <td className="px-1.5 py-0.5 text-blue-700 font-bold text-[9px]">&gt;</td>
          </tr>
          <tr>
            <td className="px-1.5 py-0.5 text-left border-r border-slate-700 text-slate-700">Unmasked BC No Resp</td>
            <td className="px-1.5 py-0.5 border-r border-slate-700 text-rose-700 font-bold">&lt;↘</td>
            <td className="px-1.5 py-0.5 text-blue-700 font-bold">&gt;↙</td>
          </tr>
          <tr>
            <td className="px-1.5 py-0.5 text-left border-r border-slate-700 text-slate-700">Masked AC</td>
            <td className="px-1.5 py-0.5 border-r border-slate-700 text-rose-700 font-bold text-[9px]">△</td>
            <td className="px-1.5 py-0.5 text-blue-700 font-bold text-[9px]">□</td>
          </tr>
          <tr>
            <td className="px-1.5 py-0.5 text-left border-r border-slate-700 text-slate-700">Masked AC No Resp</td>
            <td className="px-1.5 py-0.5 border-r border-slate-700 text-rose-700 font-bold">△↘</td>
            <td className="px-1.5 py-0.5 text-blue-700 font-bold">□↙</td>
          </tr>
          <tr>
            <td className="px-1.5 py-0.5 text-left border-r border-slate-700 text-slate-700">Masked BC</td>
            <td className="px-1.5 py-0.5 border-r border-slate-700 text-rose-700 font-bold text-[9px]">[</td>
            <td className="px-1.5 py-0.5 text-blue-700 font-bold text-[9px]">]</td>
          </tr>
          <tr>
            <td className="px-1.5 py-0.5 text-left border-r border-slate-700 text-slate-700">Masked BC No Resp</td>
            <td className="px-1.5 py-0.5 border-r border-slate-700 text-rose-700 font-bold">[↘</td>
            <td className="px-1.5 py-0.5 text-blue-700 font-bold">]↙</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

/**
 * Complete Dual Audiogram Section with Right Graph, Left Graph, and Symbol Legend
 */
export const DualAudiogramSection = ({
  rightAC = {},
  rightBC = {},
  leftAC = {},
  leftBC = {},
  className = '',
}) => {
  return (
    <div className={`border border-purple-200/90 rounded-lg p-1.5 sm:p-2 bg-white/95 backdrop-blur-2xs shadow-2xs mx-auto w-full print:break-inside-avoid print:page-break-inside-avoid ${className}`}>
      <div className="flex flex-col md:flex-row print:flex-row items-center justify-center gap-2 md:gap-3 print:gap-3 w-full">
        {/* Dual Graphs: ALWAYS strictly side-by-side on Android/mobile, desktop, and print */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2.5 w-full flex-1 min-w-0 max-w-[520px] print:grid-cols-2 print:max-w-[480px]">
          {/* Right Ear Audiogram */}
          <div className="w-full flex flex-col items-center justify-center min-w-0">
            <SingleAudiogramGraph
              ear="right"
              acData={rightAC}
              bcData={rightBC}
              width={240}
              height={165}
            />
          </div>

          {/* Left Ear Audiogram */}
          <div className="w-full flex flex-col items-center justify-center min-w-0">
            <SingleAudiogramGraph
              ear="left"
              acData={leftAC}
              bcData={leftBC}
              width={240}
              height={165}
            />
          </div>
        </div>

        {/* Legend Matrix */}
        <div className="w-auto shrink-0 flex items-center justify-center mx-auto print:shrink-0 pt-0.5 md:pt-0 print:pt-0">
          <AudiogramLegendTable />
        </div>
      </div>
    </div>
  );
};

export default DualAudiogramSection;
