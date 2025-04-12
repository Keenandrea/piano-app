import React, { useEffect, useRef } from 'react';
import * as Tone from 'tone';
import './Piano.css';

const Piano = ({ onNotePlay }) => {
  const synth = useRef(null);

  useEffect(() => {
    // Initialize the synth
    synth.current = new Tone.Synth().toDestination();
    
    // Event listener for playing melody notes
    const handlePlayNote = (event) => {
      playNote(event.detail);
    };
    
    document.addEventListener('playNote', handlePlayNote);
    
    return () => {
      document.removeEventListener('playNote', handlePlayNote);
      synth.current.dispose();
    };
  }, []);

  const playNote = (note) => {
    if (synth.current) {
      synth.current.triggerAttackRelease(note, '8n');
      if (onNotePlay) onNotePlay(note);
    }
  };

  const keys = [
    { note: 'C4', type: 'white', label: 'C' },
    { note: 'C#4', type: 'black', label: 'C#' },
    { note: 'D4', type: 'white', label: 'D' },
    { note: 'D#4', type: 'black', label: 'D#' },
    { note: 'E4', type: 'white', label: 'E' },
    { note: 'F4', type: 'white', label: 'F' },
    { note: 'F#4', type: 'black', label: 'F#' },
    { note: 'G4', type: 'white', label: 'G' },
    { note: 'G#4', type: 'black', label: 'G#' },
    { note: 'A4', type: 'white', label: 'A' },
    { note: 'A#4', type: 'black', label: 'A#' },
    { note: 'B4', type: 'white', label: 'B' },
    { note: 'C5', type: 'white', label: 'C' },
  ];

  // Handle keyboard events
  useEffect(() => {
    const keyMap = {
      'a': 'C4', 'w': 'C#4', 's': 'D4', 'e': 'D#4', 'd': 'E4',
      'f': 'F4', 't': 'F#4', 'g': 'G4', 'y': 'G#4', 'h': 'A4',
      'u': 'A#4', 'j': 'B4', 'k': 'C5'
    };

    const handleKeyDown = (e) => {
      const note = keyMap[e.key.toLowerCase()];
      if (note) {
        playNote(note);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onNotePlay]);

  return (
    <div className="piano-container">
      <div className="piano">
        {keys.map((key, index) => (
          <div
            key={index}
            className={`key ${key.type}`}
            onClick={() => playNote(key.note)}
          >
            <span className="key-label">{key.label}</span>
          </div>
        ))}
      </div>
      <div className="keyboard-guide">
        <p>Keyboard: A-K keys correspond to piano notes</p>
      </div>
    </div>
  );
};

export default Piano;