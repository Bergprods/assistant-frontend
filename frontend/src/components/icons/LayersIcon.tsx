// Layers/Stack Icon (SVG)
export function LayersIcon({ className = '', ...props }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M12 3L2 9l10 6 10-6-10-6z" fill="#7d92b0" fillOpacity="0.7" />
      <path d="M2 15l10 6 10-6" stroke="#7d92b0" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M2 12l10 6 10-6" stroke="#7d92b0" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}
