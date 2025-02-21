import React, { useState, useEffect, useRef } from 'react';
import './TypeBlock.css';

const wordList = [
  "hello", "world", "good", "morning", "night", "day", "coffee", "tea",
  "house", "car", "tree", "book", "pen", "phone", "computer", "dog", "cat",
  "work", "school", "friend", "family", "food", "water", "money", "love"
];

const generateRandomText = (numWords) => {
  const words = [];
  for (let i = 0; i < numWords; i++) {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    words.push(wordList[randomIndex]);
  }
  return words.join(' ');
};

const TypeBlock = () => {
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const [wordCount, setWordCount] = useState(25);
  const [text, setText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [wordStatus, setWordStatus] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  
  const [showCountModal, setShowCountModal] = useState(false);
  const [customCount, setCustomCount] = useState('');
  
  const [showTextModal, setShowTextModal] = useState(false);
  const [customTextInput, setCustomTextInput] = useState('');
  const [customText, setCustomText] = useState(null);

  // Flash the container then execute the action
  const flashAndExecute = (action) => {
    if (containerRef.current) {
      containerRef.current.classList.add('flash');
      setTimeout(() => {
        containerRef.current.classList.remove('flash');
        action();
      }, 500);
    } else {
      action();
    }
  };

  // Execute action immediately then flash the container
  const executeAndFlash = (action) => {
    action();
    if (containerRef.current) {
      containerRef.current.classList.add('flash');
      setTimeout(() => {
        containerRef.current.classList.remove('flash');
      }, 1000);
    }
  };

  const initializeTest = () => {
    let newText = "";
    if (customText && customText.trim() !== "") {
      newText = customText;
    } else {
      newText = generateRandomText(wordCount);
    }
    const wordsArray = newText.split(' ');
    setText(newText);
    setWordStatus(new Array(wordsArray.length).fill(null));
    setCurrentWordIndex(0);
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    initializeTest();
  }, [wordCount, customText]);

  const words = text.split(' ');

  const handleKeyDown = (e) => {
    if (endTime) return; // Ignore input if test is complete

    // Start timer on first valid character
    if (!startTime && e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      setStartTime(Date.now());
    }

    if (e.key === "Backspace") {
      e.preventDefault();
      setUserInput(prev => prev.slice(0, -1));
      return;
    }

    // When space is pressed via keyDown (desktop)
    if (e.key === " ") {
      e.preventDefault();
      const typedWord = userInput;
      const expectedWord = words[currentWordIndex];
      const isCorrect = typedWord === expectedWord;
      const newStatus = [...wordStatus];
      newStatus[currentWordIndex] = isCorrect ? 'correct' : 'incorrect';
      setWordStatus(newStatus);
      const nextIndex = currentWordIndex + 1;
      setCurrentWordIndex(nextIndex);
      setUserInput('');
      if (nextIndex === words.length) {
        setEndTime(Date.now());
      }
      return;
    }

    if (e.key.length === 1) {
      e.preventDefault();
      setUserInput(prev => prev + e.key);
    }
  };

  // New effect to catch space input on mobile via onChange
  useEffect(() => {
    if (!endTime && userInput.endsWith(" ")) {
      // Process the current word when a trailing space is detected
      const typedWord = userInput.trim();
      const expectedWord = words[currentWordIndex];
      const isCorrect = typedWord === expectedWord;
      const newStatus = [...wordStatus];
      newStatus[currentWordIndex] = isCorrect ? 'correct' : 'incorrect';
      setWordStatus(newStatus);
      const nextIndex = currentWordIndex + 1;
      setCurrentWordIndex(nextIndex);
      setUserInput('');
      if (nextIndex === words.length) {
        setEndTime(Date.now());
      }
    }
  }, [userInput, endTime, currentWordIndex, wordStatus, words]);

  const handleReset = () => flashAndExecute(initializeTest);

  let stats = null;
  if (endTime && startTime) {
    const correctCount = wordStatus.filter(status => status === 'correct').length;
    const accuracy = ((correctCount / words.length) * 100).toFixed(2);
    const timeTakenSec = ((endTime - startTime) / 1000).toFixed(2);
    const timeTakenMin = (endTime - startTime) / 60000;
    const wpm = timeTakenMin > 0 ? (correctCount / timeTakenMin).toFixed(2) : 0;
    stats = { accuracy, wpm, timeTakenSec };
  }

  const handleCustomCountSubmit = (e) => {
    e.preventDefault();
    const count = parseInt(customCount, 10);
    if (!isNaN(count) && count > 0) {
      executeAndFlash(() => {
        setCustomText(null);
        setWordCount(count);
        setShowCountModal(false);
        setCustomCount('');
      });
    }
  };

  const handleCustomTextSubmit = (e) => {
    e.preventDefault();
    if (customTextInput.trim() !== "") {
      executeAndFlash(() => {
        setCustomText(customTextInput);
        setShowTextModal(false);
        setCustomTextInput('');
      });
    }
  };

  return (
    <div className='background'>
      <div className='typeblock'>
        <div className="AppLogo">Type Quest</div>
        <div className="typeblock-container" ref={containerRef}>
          <div className="button-group">
            <div className="leftbuttons">
              <button onClick={() => flashAndExecute(() => { setCustomText(null); setWordCount(10); })}>10</button>
              <button onClick={() => flashAndExecute(() => { setCustomText(null); setWordCount(25); })}>25</button>
              <button onClick={() => flashAndExecute(() => { setCustomText(null); setWordCount(50); })}>50</button>
            </div>
            <div className="rightbuttons">
              <button onClick={() => setShowCountModal(true)}>Custom Count</button>
              <button onClick={() => setShowTextModal(true)}>Custom Text</button>
            </div>
          </div>

          <div
            className="text-display"
            onClick={() => {
              if (inputRef.current) inputRef.current.focus();
            }}
          >
            {words.map((word, index) => {
              if (index < currentWordIndex) {
                const className = 'word ' + (wordStatus[index] === 'correct' ? 'correct' : 'incorrect');
                return <span key={index} className={className}>{word} </span>;
              } else if (index === currentWordIndex) {
                return (
                  <span key={index} className="word current">
                    {word.split('').map((letter, idx) => {
                      let letterClass = "";
                      if (idx < userInput.length) {
                        letterClass = userInput[idx] === letter ? 'correct-letter' : 'incorrect-letter';
                      }
                      return (
                        <span key={idx} className={letterClass}>
                          {letter}
                        </span>
                      );
                    })}
                    {' '}
                  </span>
                );
              } else {
                return <span key={index} className="word">{word} </span>;
              }
            })}
          </div>

          {/* Hidden input for capturing keystrokes */}
          <input
            ref={inputRef}
            type="text"
            className="hidden-input"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value.toLowerCase())}
            onKeyDown={handleKeyDown}
            autoCapitalize="none"
            autoCorrect="off"
          />

          <button onClick={handleReset} className="reset-button">
            Reset
          </button>

          {endTime && stats && (
            <div className="stats">
              <p><strong>Accuracy:</strong> {stats.accuracy}%</p>
              <p><strong>WPM:</strong> {stats.wpm}</p>
              <p><strong>Time Taken:</strong> {stats.timeTakenSec} seconds</p>
            </div>
          )}

          {showCountModal && (
            <div className="modal-overlay" onClick={() => executeAndFlash(() => setShowCountModal(false))}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Enter Custom Word Count</h3>
                <form onSubmit={handleCustomCountSubmit}>
                  <input
                    type="number"
                    value={customCount}
                    onChange={(e) => setCustomCount(e.target.value)}
                    placeholder="Enter number"
                    min="1"
                    max="100"
                  />
                  <button type="submit">Set</button>
                </form>
                <button className="close-modal" onClick={() => executeAndFlash(() => setShowCountModal(false))}>Close</button>
              </div>
            </div>
          )}

          {showTextModal && (
            <div className="modal-overlay" onClick={() => executeAndFlash(() => setShowTextModal(false))}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Enter Custom Text</h3>
                <form onSubmit={handleCustomTextSubmit}>
                  <textarea
                    value={customTextInput}
                    onChange={(e) => setCustomTextInput(e.target.value)}
                    placeholder="Enter your custom text here..."
                    rows="5"
                    maxLength="200"
                  ></textarea>
                  <button type="submit">Set</button>
                </form>
                <button className="close-modal" onClick={() => executeAndFlash(() => setShowTextModal(false))}>Close</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TypeBlock;
