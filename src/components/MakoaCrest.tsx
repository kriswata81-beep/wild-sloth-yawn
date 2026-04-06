"use client";

export default function MakoaCrest() {
  const gold = "#b08e50";
  const goldDim = "rgba(176,142,80,0.25)";

  return (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="anim-breathe-svg"
    >
      {/* Outer circle */}
      <circle cx="100" cy="100" r="96" stroke={gold} strokeWidth="1.5" fill="none" />

      {/* Compass arms — thin rectangles at N E S W */}
      {/* North arm */}
      <rect x="98.5" y="10" width="3" height="52" fill={goldDim} />
      {/* South arm */}
      <rect x="98.5" y="138" width="3" height="52" fill={goldDim} />
      {/* West arm */}
      <rect x="10" y="98.5" width="52" height="3" fill={goldDim} />
      {/* East arm */}
      <rect x="138" y="98.5" width="52" height="3" fill={goldDim} />

      {/* Diamond points at N E S W tips */}
      {/* North diamond */}
      <polygon points="100,4 104,14 100,20 96,14" fill={gold} />
      {/* South diamond */}
      <polygon points="100,196 104,186 100,180 96,186" fill={gold} />
      {/* East diamond */}
      <polygon points="196,100 186,104 180,100 186,96" fill={gold} />
      {/* West diamond */}
      <polygon points="4,100 14,104 20,100 14,96" fill={gold} />

      {/* Diagonal thin lines (secondary compass) */}
      <line x1="32" y1="32" x2="68" y2="68" stroke={goldDim} strokeWidth="1" />
      <line x1="168" y1="32" x2="132" y2="68" stroke={goldDim} strokeWidth="1" />
      <line x1="32" y1="168" x2="68" y2="132" stroke={goldDim} strokeWidth="1" />
      <line x1="168" y1="168" x2="132" y2="132" stroke={goldDim} strokeWidth="1" />

      {/* Center square 80x80 */}
      <rect x="60" y="60" width="80" height="80" fill="#000" stroke={gold} strokeWidth="1" />

      {/* QR corner squares — top-left */}
      <rect x="65" y="65" width="18" height="18" fill="none" stroke={gold} strokeWidth="1.2" />
      <rect x="68" y="68" width="12" height="12" fill="none" stroke={gold} strokeWidth="1" />
      <rect x="71" y="71" width="6" height="6" fill={gold} />

      {/* QR corner squares — top-right */}
      <rect x="117" y="65" width="18" height="18" fill="none" stroke={gold} strokeWidth="1.2" />
      <rect x="120" y="68" width="12" height="12" fill="none" stroke={gold} strokeWidth="1" />
      <rect x="123" y="71" width="6" height="6" fill={gold} />

      {/* QR corner squares — bottom-left */}
      <rect x="65" y="117" width="18" height="18" fill="none" stroke={gold} strokeWidth="1.2" />
      <rect x="68" y="120" width="12" height="12" fill="none" stroke={gold} strokeWidth="1" />
      <rect x="71" y="123" width="6" height="6" fill={gold} />

      {/* Center dot pattern */}
      <rect x="91" y="91" width="3" height="3" fill={gold} opacity="0.8" />
      <rect x="96" y="91" width="3" height="3" fill={gold} opacity="0.6" />
      <rect x="101" y="91" width="3" height="3" fill={gold} opacity="0.8" />
      <rect x="106" y="91" width="3" height="3" fill={gold} opacity="0.5" />
      <rect x="91" y="96" width="3" height="3" fill={gold} opacity="0.5" />
      <rect x="96" y="96" width="3" height="3" fill={gold} opacity="0.9" />
      <rect x="101" y="96" width="3" height="3" fill={gold} opacity="0.6" />
      <rect x="106" y="96" width="3" height="3" fill={gold} opacity="0.8" />
      <rect x="91" y="101" width="3" height="3" fill={gold} opacity="0.7" />
      <rect x="96" y="101" width="3" height="3" fill={gold} opacity="0.5" />
      <rect x="101" y="101" width="3" height="3" fill={gold} opacity="0.9" />
      <rect x="106" y="101" width="3" height="3" fill={gold} opacity="0.6" />
      <rect x="91" y="106" width="3" height="3" fill={gold} opacity="0.6" />
      <rect x="96" y="106" width="3" height="3" fill={gold} opacity="0.8" />
      <rect x="101" y="106" width="3" height="3" fill={gold} opacity="0.5" />
      <rect x="106" y="106" width="3" height="3" fill={gold} opacity="0.7" />

      {/* Compass labels */}
      <text x="100" y="26" textAnchor="middle" fill={gold} fontSize="8" fontFamily="monospace">N</text>
      <text x="100" y="182" textAnchor="middle" fill={gold} fontSize="8" fontFamily="monospace">S</text>
      <text x="174" y="103" textAnchor="middle" fill={gold} fontSize="8" fontFamily="monospace">E</text>
      <text x="26" y="103" textAnchor="middle" fill={gold} fontSize="8" fontFamily="monospace">W</text>

      {/* H·P·O at bottom of crest */}
      <text x="100" y="133" textAnchor="middle" fill={gold} fontSize="6" fontFamily="monospace" opacity="0.7">H·P·O</text>
    </svg>
  );
}
