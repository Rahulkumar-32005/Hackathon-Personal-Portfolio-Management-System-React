function ThemeButton({ theme, toggleTheme }) {
  return (
    <button className="theme-toggle" onClick={toggleTheme} type="button">
      {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
    </button>
  )
}

export default ThemeButton