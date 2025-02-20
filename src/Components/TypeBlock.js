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
    if (containerRef.current) {
      containerRef.current.focus();
    }
  };

  useEffect(() => {
    initializeTest();
  }, [wordCount, customText]);

  const words = text.split(' ');

  const handleKeyDown = (e) => {
    if (endTime) return; // if test is finished, ignore input

    // Start timer on first valid character
    if (!startTime && e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      setStartTime(Date.now());
    }

    if (e.key === "Backspace") {
      e.preventDefault();
      setUserInput(prev => prev.slice(0, -1));
      return;
    }

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

  const handleReset = () => {
    initializeTest();
  };

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
      setCustomText(null);
      setWordCount(count);
      setShowCountModal(false);
      setCustomCount('');
    }
  };

  const handleCustomTextSubmit = (e) => {
    e.preventDefault();
    if (customTextInput.trim() !== "") {
      setCustomText(customTextInput);
      setShowTextModal(false);
      setCustomTextInput('');
    }
  };

  return (
    <div className="typeblock-container">
      <div className="button-group">
        <button onClick={() => { setCustomText(null); setWordCount(10); }}>10</button>
        <button onClick={() => { setCustomText(null); setWordCount(25); }}>25</button>
        <button onClick={() => { setCustomText(null); setWordCount(50); }}>50</button>
        <button onClick={() => setShowCountModal(true)}>Custom Count</button>
        <button onClick={() => setShowTextModal(true)}>Custom Text</button>
      </div>

      <div
        className="text-display"
        ref={containerRef}
        tabIndex="0"
        onKeyDown={handleKeyDown}
      >
        {words.map((word, index) => {
          if (index < currentWordIndex) {
            // Finished words: display with overall color based on correctness
            const className = 'word ' + (wordStatus[index] === 'correct' ? 'correct' : 'incorrect');
            return <span key={index} className={className}>{word} </span>;
          } else if (index === currentWordIndex) {
            // Current word: render each letter with individual feedback
            const expectedWord = word;
            const typedLetters = userInput.split('');
            return (
              <span key={index} className="word current">
                {expectedWord.split('').map((letter, idx) => {
                  let letterClass = "";
                  if (idx < typedLetters.length) {
                    letterClass = typedLetters[idx] === letter ? 'correct-letter' : 'incorrect-letter';
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
            // Unfinished words
            return <span key={index} className="word">{word} </span>;
          }
        })}
      </div>

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
        <div className="modal-overlay" onClick={() => setShowCountModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Enter Custom Word Count</h3>
            <form onSubmit={handleCustomCountSubmit}>
              <input
                type="number"
                value={customCount}
                onChange={(e) => setCustomCount(e.target.value)}
                placeholder="Enter number"
                min="1"
              />
              <button type="submit">Set</button>
            </form>
            <button className="close-modal" onClick={() => setShowCountModal(false)}>Close</button>
          </div>
        </div>
      )}

      {showTextModal && (
        <div className="modal-overlay" onClick={() => setShowTextModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Enter Custom Text</h3>
            <form onSubmit={handleCustomTextSubmit}>
              <textarea
                value={customTextInput}
                onChange={(e) => setCustomTextInput(e.target.value)}
                placeholder="Enter your custom text here..."
                rows="4"
              ></textarea>
              <button type="submit">Set</button>
            </form>
            <button className="close-modal" onClick={() => setShowTextModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TypeBlock;
