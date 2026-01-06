const Logo = ({ className = "" }) => (
  <svg
    className={className}
    viewBox="0 0 320 120"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 60 L60 25 L100 60 V100 H20 Z"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
    />
    <rect x="55" y="60" width="10" height="10" fill="currentColor" />
    <rect x="70" y="60" width="10" height="10" fill="currentColor" />
    <rect x="55" y="75" width="10" height="10" fill="currentColor" />
    <rect x="70" y="75" width="10" height="10" fill="currentColor" />
    <text x="130" y="55" fontSize="36" fontFamily="Arial" fontWeight="700">
      REAL
    </text>
    <text x="130" y="95" fontSize="36" fontFamily="Arial" fontWeight="700">
      ESTATE
    </text>
  </svg>
);

export default Logo;
