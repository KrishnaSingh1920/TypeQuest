import React, { useState } from 'react';
import "./Navbar.css";

const Navbar = ({ onNavClick }) => {
  const [theme, setTheme] = useState("dark");
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === "light" ? "dark" : "light"));
  };

  const handleNavClick = (component) => {
    onNavClick(component);
    setMenuOpen(false); // Close the mobile menu after clicking an item
  };

  return (
    <nav className={theme}>
      <div className="left">
        <div className="logo">KS</div>
        <div className="themeChange" onClick={toggleTheme}>
          {theme === "light" ? "" : ""}
        </div>
      </div>
      {/* Desktop Menu */}
      <div className="right desktop-menu">
        <ul>
          <li onClick={() => handleNavClick("typeblock")}>Home</li>
          <li onClick={() => handleNavClick("about")}>About</li>
          <li onClick={() => handleNavClick("contact")}>Contact</li>
        </ul>
      </div>
      {/* Burger icon or Close button for mobile */}
      {menuOpen ? (
        <div className="close-menu" onClick={() => setMenuOpen(false)}>
          ×
        </div>
      ) : (
        <div className="burger mobile-menu-icon" onClick={() => setMenuOpen(true)}>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
      )}
      {/* Mobile Menu with slide transition */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <ul>
          <li onClick={() => handleNavClick("typeblock")}>Home</li>
          <li onClick={() => handleNavClick("about")}>About</li>
          <li onClick={() => handleNavClick("contact")}>Contact</li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
