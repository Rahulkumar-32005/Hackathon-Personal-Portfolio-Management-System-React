
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Login from './Login.jsx';
import Signup from './Signup.jsx';
import Dashboard from './Dashboard.jsx';
import AdminDashboard from './AdminDashboard.jsx';

import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Skills from './components/Skills.jsx';
import Projects from './components/Projects.jsx';
import Certificates from './components/Certificates.jsx';
import Blogs from './components/Blogs.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import Modals from './components/Modals.jsx';

import {
  initialProjects,
  skills,
  certificates,
  initialBlogs
} from './data/portfolioData.js';

const availableThemes = [
  'light',
  'dark',
  'red',
  'blue',
  'green',
  'purple',
  'yellow',
  'custom'
];

const themeColors = {
  light: '#0d9488',
  dark: '#35c6b0',
  red: '#dc2626',
  blue: '#2563eb',
  green: '#16a34a',
  purple: '#9333ea',
  yellow: '#ca8a04'
};

function App() {
  const location = useLocation();

  // THEME STATE
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');

    return availableThemes.includes(savedTheme)
      ? savedTheme
      : 'light';
  });

  // CUSTOM COLOUR STATE
  const [customColor, setCustomColor] = useState(
    () => localStorage.getItem('customThemeColor') || '#0d9488'
  );

  // APPLY THEME
useEffect(() => {
  const root = document.documentElement;

  const selectedColor =
    theme === 'custom'
      ? customColor
      : themeColors[theme] || themeColors.light;

  const dashboardThemes = {
    light: {
      bg: '#f5f7fb',
      sidebar: '#ffffff',
      card: '#ffffff',
      input: '#f8fafc',
      text: '#172033',
      muted: '#657189',
      border: '#e1e6ef',
      hover: '#e6f4f3'
    },
    dark: {
      bg: '#080b12',
      sidebar: '#111722',
      card: '#111722',
      input: '#080d16',
      text: '#f1f5f9',
      muted: '#aab8cc',
      border: '#293548',
      hover: '#25213f'
    },
    red: {
      bg: '#fff1f2',
      sidebar: '#ffe4e6',
      card: '#ffffff',
      input: '#fff5f5',
      text: '#172033',
      muted: '#657189',
      border: '#fecdd3',
      hover: '#ffe4e6'
    },
    blue: {
      bg: '#eff6ff',
      sidebar: '#dbeafe',
      card: '#ffffff',
      input: '#f8fafc',
      text: '#172033',
      muted: '#657189',
      border: '#bfdbfe',
      hover: '#dbeafe'
    },
    green: {
      bg: '#f0fdf4',
      sidebar: '#dcfce7',
      card: '#ffffff',
      input: '#f8fafc',
      text: '#172033',
      muted: '#657189',
      border: '#bbf7d0',
      hover: '#dcfce7'
    },
    purple: {
      bg: '#faf5ff',
      sidebar: '#f3e8ff',
      card: '#ffffff',
      input: '#faf5ff',
      text: '#172033',
      muted: '#657189',
      border: '#e9d5ff',
      hover: '#f3e8ff'
    },
    yellow: {
      bg: '#fefce8',
      sidebar: '#fef3c7',
      card: '#ffffff',
      input: '#fffef5',
      text: '#172033',
      muted: '#657189',
      border: '#fde68a',
      hover: '#fef3c7'
    },
    custom: {
      bg: '#f5f7fb',
      sidebar: '#ffffff',
      card: '#ffffff',
      input: '#f8fafc',
      text: '#172033',
      muted: '#657189',
      border: '#e1e6ef',
      hover: '#e6e6e6'
    }
  };

  const colors = dashboardThemes[theme];

  root.setAttribute('data-theme', theme);

  root.style.setProperty('--theme-accent', selectedColor);
  root.style.setProperty('--accent-color', selectedColor);
  root.style.setProperty('--portfolio-accent', selectedColor);

  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--dash-${key}`, value);
  });

  localStorage.setItem('theme', theme);
  localStorage.setItem('customThemeColor', customColor);

}, [theme, customColor]);

  // LIGHT / DARK TOGGLE
  const toggleTheme = () => {
    setTheme(current =>
      current === 'dark' ? 'light' : 'dark'
    );
  };

  // PRESET THEME CHANGE
  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  // CUSTOM COLOUR CHANGE
  const handleCustomColor = (e) => {
    const color = e.target.value;

    setCustomColor(color);
    setTheme('custom');
  };

  // THEME CONTROLS
  const ThemeButton = () => (
    <div className="theme-controls">

      <button
        className="theme-toggle"
        onClick={toggleTheme}
        type="button"
        aria-label="Toggle light and dark mode"
      >
        {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>

      <select
        className="theme-select"
        value={theme}
        onChange={handleThemeChange}
        aria-label="Select colour theme"
      >
        <option value="light">Light Theme</option>
        <option value="dark">Dark Theme</option>
        <option value="red">Red Theme</option>
        <option value="blue">Blue Theme</option>
        <option value="green">Green Theme</option>
        <option value="purple">Purple Theme</option>
        <option value="yellow">Yellow Theme</option>
        <option value="custom">Custom Theme</option>
      </select>

      <input
        className="theme-color-picker"
        type="color"
        value={customColor}
        onChange={handleCustomColor}
        title="Choose your custom theme colour"
        aria-label="Choose custom theme colour"
      />

    </div>
  );

  // PROJECTS
  const [projects] = useState(() =>
    JSON.parse(localStorage.getItem('projects') || 'null') || initialProjects
  );

  // BLOGS
  const [blogs] = useState(() =>
    JSON.parse(localStorage.getItem('blogs') || 'null') || initialBlogs
  );

  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [certificate, setCertificate] = useState(null);

  // FILTER PROJECTS
  const filteredProjects = projects.filter(project => {
    const matchesFilter =
      filter === 'All' || project.category === filter;

    const matchesSearch =
      `${project.title} ${project.description} ${project.tech}`
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // LOGIN PAGE
  if (location.pathname === '/login') {
    return (
      <>
        <ThemeButton />
        <Login />
      </>
    );
  }

  // SIGNUP PAGE
  if (location.pathname === '/signup') {
    return (
      <>
        <ThemeButton />
        <Signup />
      </>
    );
  }

  // ADMIN DASHBOARD
  if (location.pathname === '/admin-dashboard') {
    return (
      <>
        <ThemeButton />
        <AdminDashboard />
      </>
    );
  }

  // USER DASHBOARD
  if (location.pathname === '/user-dashboard') {
    return (
      <>
        <ThemeButton />
        <Dashboard />
      </>
    );
  }

  // MAIN PORTFOLIO
  return (
    <>
      <div className="scroll-progress"></div>

      <Navbar
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        ThemeButton={ThemeButton}
      />

      <main>
        <Hero projects={projects} />

        <About />

        <Skills skills={skills} />

        <Projects
          projects={projects}
          filteredProjects={filteredProjects}
          filter={filter}
          setFilter={setFilter}
          search={search}
          setSearch={setSearch}
          setSelected={setSelected}
        />

        <Certificates
          certificates={certificates}
          setCertificate={setCertificate}
        />

        <Blogs
          blogs={blogs}
          setSelected={setSelected}
        />

        <Contact />

        <section className="workflow">
          <small>HOW IT WORKS</small>

          <h2>
            From idea to <em>working system.</em>
          </h2>

          <div className="flow-grid">
            {['Discover', 'Interact', 'Authenticate', 'Manage'].map(
              (item, index) => (
                <div key={item}>
                  <b>0{index + 1}</b>

                  <strong>{item}</strong>

                  <span>
                    Explore and manage portfolio information.
                  </span>
                </div>
              )
            )}
          </div>
        </section>
      </main>

      <Footer />

      <Modals
        selected={selected}
        setSelected={setSelected}
        certificate={certificate}
        setCertificate={setCertificate}
      />
    </>
  );
}

export default App;