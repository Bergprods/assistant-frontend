// Multilayer View Icon (SVG)
export function ViewMultilayerIcon({ className = '', ...props }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect x="3" y="7" width="16" height="8" rx="2" fill="#7d92b0" fillOpacity="0.18" />
      <rect x="6" y="3" width="10" height="4" rx="1.5" fill="#7d92b0" fillOpacity="0.32" />
      <rect x="6" y="15" width="10" height="4" rx="1.5" fill="#7d92b0" fillOpacity="0.32" />
      <rect x="8" y="9" width="6" height="2" rx="1" fill="#7d92b0" fillOpacity="0.6" />
    </svg>
  )
}
