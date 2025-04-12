import React, { useEffect, useRef, useCallback } from 'react';
import './Piano.css';

const Piano = ({ onNotePlay }) => {
  // Refs for audio context and oscillator
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);

  // Map of note names to frequencies in Hz
  const noteFrequencies = {
    'C4': 261.63,
    'C#4': 277.18,
    'D4': 293.66,
    'D#4': 311.13,
    'E4': 329.63,
    'F4': 349.23,
    'F#4': 369.99,
    'G4': 392.00,
    'G#4': 415.30,
    'A4': 440.00,
    'A#4': 466.16,
    'B4': 493.88,
    'C5': 523.25
  };

  // Initialize the audio context on component mount
  useEffect(() => {
    try {
      // The AudioContext must be initialized after a user gesture on iOS
      const initializeAudio = () => {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
          // Create a gain node for volume control
          gainNodeRef.current = audioContextRef.current.createGain();
          gainNodeRef.current.gain.value = 0.5;
          gainNodeRef.current.connect(audioContextRef.current.destination);
          console.log("Web Audio API initialized successfully");
        }
      };

      // Add a click listener to initialize audio on first interaction
      document.addEventListener('click', initializeAudio, { once: true });
      
      return () => {
        // Clean up audio context when component unmounts
        if (audioContextRef.current?.state !== 'closed') {
          audioContextRef.current?.close();
        }
      };
    } catch (error) {
      console.error("Error initializing Web Audio API:", error);
    }
  }, []);

  // Play a note using Web Audio API
  const playNote = useCallback((note) => {
    try {
      // Initialize audio context if it's not already initialized
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.gain.value = 0.5;
        gainNodeRef.current.connect(audioContextRef.current.destination);
      }

      // Resume audio context if it's suspended (happens in some browsers)
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      // Stop any currently playing oscillator
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }

      // Get the frequency for this note
      const frequency = noteFrequencies[note];
      if (!frequency) return;

      // Create and configure oscillator
      oscillatorRef.current = audioContextRef.current.createOscillator();
      oscillatorRef.current.type = 'sine'; // sine, square, sawtooth, triangle
      oscillatorRef.current.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
      
      // Connect and start the oscillator
      oscillatorRef.current.connect(gainNodeRef.current);
      oscillatorRef.current.start();
      
      // Stop the note after a short duration (similar to a piano)
      oscillatorRef.current.stop(audioContextRef.current.currentTime + 0.5);
      
      // Call the callback if provided
      if (onNotePlay) onNotePlay(note);
    } catch (error) {
      console.error("Error playing note:", error);
    }
  }, [onNotePlay]);

  // Handle custom events for playing notes (for melody playback)
  useEffect(() => {
    const handlePlayNote = (event) => {
      playNote(event.detail);
    };
    
    document.addEventListener('playNote', handlePlayNote);
    
    return () => {
      document.removeEventListener('playNote', handlePlayNote);
    };
  }, [playNote]);

  // Piano keys configuration
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
  }, [playNote]);

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