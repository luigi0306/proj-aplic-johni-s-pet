// Ícone da coruja-emblema — acesso da equipe (área restrita)
export default function StaffOwlIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="49" fill="#16313b" />
      <circle cx="50" cy="50" r="39" fill="#7a8a2e" />
      <path d="M50 21c-13 0-20 10-20 20 4-4 13-7 20-7s16 3 20 7c0-10-7-20-20-20z" fill="#5c6c1e" />
      <circle cx="38" cy="46" r="9.5" fill="#fff" />
      <circle cx="62" cy="46" r="9.5" fill="#fff" />
      <circle cx="39" cy="47.5" r="4" fill="#16313b" />
      <circle cx="61" cy="47.5" r="4" fill="#16313b" />
      <path d="M44 58l6 7 6-7z" fill="#E8A93B" />
    </svg>
  );
}