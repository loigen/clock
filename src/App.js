import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timerLabel, setTimerLabel] = useState('Session');
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [audioSrc] = useState('https://www.soundjay.com/button/beep-07.wav');
  const audioRef = useRef();

  const handleReset = () => {
    clearInterval(intervalId);
    setIntervalId(null);
    setBreakLength(5);
    setSessionLength(25);
    setTimerLabel('Session');
    setTimeLeft(25 * 60);
    setTimerRunning(false);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const handleBreakDecrement = () => {
    if (breakLength > 1) {
      setBreakLength(breakLength - 1);
    }
  };

  const handleBreakIncrement = () => {
    if (breakLength < 60) {
      setBreakLength(breakLength + 1);
    }
  };

  const handleSessionDecrement = () => {
    if (sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      setTimeLeft((sessionLength - 1) * 60);
    }
  };

  const handleSessionIncrement = () => {
    if (sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      setTimeLeft((sessionLength + 1) * 60);
    }
  };

  const handleStartStop = () => {
    if (!timerRunning) {
      const newIntervalId = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          const newTimeLeft = prevTimeLeft - 1;
          if (newTimeLeft === 0) {
            audioRef.current.play();
            if (timerLabel === 'Session') {
              setTimerLabel('Break');
              setTimeLeft(breakLength * 60);
            } else {
              setTimerLabel('Session');
              setTimeLeft(sessionLength * 60);
            }
          }
          return newTimeLeft;
        });
      }, 1000);
      setIntervalId(newIntervalId);
      setTimerRunning(true);
    } else {
      clearInterval(intervalId);
      setIntervalId(null);
      setTimerRunning(false);
    }
  };

  useEffect(() => {
    if (timeLeft === 0) {
      audioRef.current.play();
    }
  }, [timeLeft]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="App">
      <h1>Pomodoro Clock</h1>
      <div className="length-controls">
        <div id="break-label">Break Length</div>
        <div className="controls">
          <button id="break-decrement" onClick={handleBreakDecrement}>-</button>
          <div id="break-length">{breakLength}</div>
          <button id="break-increment" onClick={handleBreakIncrement}>+</button>
        </div>
      </div>
      <div className="length-controls">
        <div id="session-label">Session Length</div>
        <div className="controls">
          <button id="session-decrement" onClick={handleSessionDecrement}>-</button>
          <div id="session-length">{sessionLength}</div>
          <button id="session-increment" onClick={handleSessionIncrement}>+</button>
        </div>
      </div>
      <div id="timer">
        <div id="timer-label">{timerLabel}</div>
        <div id="time-left">{formatTime(timeLeft)}</div>
        <button id="start_stop" onClick={handleStartStop}>Start/Stop</button>
        <button id="reset" onClick={handleReset}>Reset</button>
        <audio id="beep" ref={audioRef} src={audioSrc} />
      </div>
    </div>
  );
};

export default App;
