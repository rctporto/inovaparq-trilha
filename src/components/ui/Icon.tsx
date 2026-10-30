const paths = {
  home: "M3 10l9-7 9 7v10H3z M9 20v-7h6v7",
  route: "M6 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4 M18 16a2 2 0 1 0 0 4 2 2 0 0 0 0-4 M8 6h7a4 4 0 0 1 0 8H9a4 4 0 0 0 0 8",
  book: "M3 4h7l2 2 2-2h7v15h-7l-2 2-2-2H3z M12 6v15",
  flag: "M5 22V3 M5 4h13l-3 4 3 4H5",
  gift: "M3 9h18v4H3z M5 13v8h14v-8 M12 9v12 M12 9C3 9 6 0 10 5z M12 9c9 0 6-9 2-4z",
  people: "M16 21v-3a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v3 M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M18 8a3 3 0 0 1 0 6 M22 21v-3a4 4 0 0 0-3-4",
  chart: "M4 3v18h17 M8 17v-5 M13 17V7 M18 17v-9",
  award: "M12 3l3 3 4 1-1 4 1 4-4 1-3 3-3-3-4-1 1-4-1-4 4-1z M8 18v5l4-2 4 2v-5",
  arrow: "M4 12h16 M14 6l6 6-6 6",
  check: "M5 12l4 4L19 6",
  lock: "M6 10h12v11H6z M8 10V7a4 4 0 0 1 8 0v3",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18 M12 7v6h4",
  play: "M8 4l12 8-12 8z",
  file: "M5 3h9l5 5v13H5z M14 3v6h5 M8 13h8 M8 17h6",
  upload: "M12 16V3 M7 8l5-5 5 5 M3 16v5h18v-5",
  calendar: "M4 5h16v16H4z M8 2v6 M16 2v6 M4 10h16",
  chat: "M3 4h18v13H9l-6 4z M7 9h10 M7 13h7",
  settings: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M9 3h6l1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1z",
  search: "M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14 M15 15l6 6",
  bell: "M5 16h14l-2-4V8a5 5 0 0 0-10 0v4z M10 20h4",
  plus: "M12 4v16 M4 12h16",
  spark: "M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z",
  menu: "M4 6h16 M4 12h16 M4 18h16",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12 M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6",
  back: "M20 12H4 M10 6l-6 6 6 6",
  target: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18 M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10 M12 11v2",
  globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18 M3 12h18 M12 3c-5 5-5 13 0 18 M12 3c5 5 5 13 0 18",
  logout: "M15 4h4v16h-4 M10 8l-4 4 4 4 M6 12h11",
  x: "M6 6l12 12 M18 6L6 18",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z M9 12l2 2 4-4",
  user: "M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1",
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, className = "icon", label }: { name: IconName; className?: string; label?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
    >
      <path d={paths[name]} />
    </svg>
  );
}

export function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}
