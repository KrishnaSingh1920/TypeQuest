import React, { useState } from 'react';
import "./Navbar.css";

const Navbar = () => {
  // Set up a state for theme mode ("light" or "dark")
  const [theme, setTheme] = useState("dark");

  // Toggle function to change theme
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    // Apply the current theme as a class on the nav element
    <nav className={theme}>
      <div className="left">
        <div className="logo">KS</div>
        {/* The themeChange div toggles the theme on click */}
        <div className="themeChange" onClick={toggleTheme}>
          {/* Optionally, show a label or icon change */}
          {theme === "light" ? "" : ""}
        </div>
      </div>
      <div className="right">
        <ul>
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
