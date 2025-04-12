import React, { useState, useEffect } from 'react';
import Piano from './components/Piano';
import axios from 'axios';
import './App.css';

function App() {
  const [melodies, setMelodies] = useState([]);
  const [melodySaving, setMelodySaving] = useState({ title: '', notes: [] });
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    fetchMelodies();
  }, []);

  const fetchMelodies = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/melodies');
      setMelodies(response.data);
    } catch (error) {
      console.error('Error fetching melodies:', error);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setMelodySaving({ title: '', notes: [] });
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const addNoteToMelody = (note) => {
    if (isRecording) {
      setMelodySaving(prev => ({
        ...prev,
        notes: [...prev.notes, note]
      }));
    }
  };

  const saveMelody = async () => {
    if (melodySaving.notes.length === 0) {
      alert('Please record some notes first!');
      return;
    }
    
    const title = prompt('Enter a title for your melody:');
    if (!title) return;
    
    try {
      await axios.post('http://localhost:5000/api/melodies', {
        title,
        notes: melodySaving.notes
      });
      
      fetchMelodies();
      setMelodySaving({ title: '', notes: [] });
    } catch (error) {
      console.error('Error saving melody:', error);
    }
  };

  const playMelody = async (notes) => {
    for (const note of notes) {
      document.dispatchEvent(new CustomEvent('playNote', { detail: note }));
      await new Promise(resolve => setTimeout(resolve, 600)); // Wait between notes
    }
  };

  return (
    <div className="app-container">
      <h1>React Piano App</h1>
      <p className="app-description">Play piano with your mouse or keyboard (A-K keys)</p>
      
      <Piano onNotePlay={addNoteToMelody} />
      
      <div className="controls">
        {isRecording ? (
          <button onClick={stopRecording} className="record-btn recording">
            Stop Recording
          </button>
        ) : (
          <button onClick={startRecording} className="record-btn">
            Start Recording
          </button>
        )}
        
        <button 
          onClick={saveMelody} 
          disabled={melodySaving.notes.length === 0}
          className="save-btn"
        >
          Save Melody
        </button>
      </div>
      
      {melodySaving.notes.length > 0 && (
        <div className="recording-info">
          <h3>Current Recording</h3>
          <p>{melodySaving.notes.join(' - ')}</p>
        </div>
      )}
      
      <div className="melodies-list">
        <h2>Saved Melodies</h2>
        {melodies.length === 0 ? (
          <p>No saved melodies yet.</p>
        ) : (
          <ul>
            {melodies.map(melody => (
              <li key={melody._id}>
                <span>{melody.title}</span>
                <button onClick={() => playMelody(melody.notes)} className="play-btn">
                  Play
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;