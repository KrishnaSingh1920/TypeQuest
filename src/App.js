import React, { useState } from 'react';
import Navbar from './Components/Navbar';
import TypeBlock from './Components/TypeBlock';
import About from './Components/About'; 
import Contact from './Components/Contact'; 
import './App.css';

function App() {
  // Track which component is active: "typeblock", "about", "contact", etc.
  const [activeComponent, setActiveComponent] = useState("typeblock");
  // Used for the transition effect
  const [transitionClass, setTransitionClass] = useState("");

  const handleNavClick = (component) => {
    // If clicking on the already active component, do nothing
    if (component === activeComponent) return;

    // Start the blur transition
    setTransitionClass("blur");

    // After the blur transition completes, swap the component and unblur
    setTimeout(() => {
      setActiveComponent(component);
      setTransitionClass("unblur");

      // Remove the transition class after unblur animation
      setTimeout(() => {
        setTransitionClass("");
      }, 300);  // duration of the unblur transition
    }, 300);  // duration of the blur transition
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "about":
        return <About />;
      case "contact":
        return <Contact />; // You can replace this with a Contact component
      case "typeblock":
      default:
        return <TypeBlock />;
    }
  };

  return (
    <div className="App">
      <Navbar onNavClick={handleNavClick} />
      <div className={`content ${transitionClass}`}>
        {renderComponent()}
      </div>
    </div>
  );
}

export default App;
