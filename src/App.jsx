import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';

const App = () => {
  const webcamRef = useRef(null);
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-GB';

    recognition.onresult = (event) => {
      const speech = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      setTranscript(speech);
    };

    recognition.onend = () => {
      if (listening) recognition.start();
    };

    if (listening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => recognition.stop();
  }, [listening]);

  return (
    <div className="p-4 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Vaillant AI Engineer</h1>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="rounded-2xl shadow-md mb-4"
        style={{ width: '100%' }}
      />

      <button
        onClick={() => setListening(prev => !prev)}
        className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow"
      >
        {listening ? 'Stop Listening' : 'Start Voice Input'}
      </button>

      <div className="mt-4 p-2 bg-gray-100 rounded-xl text-left text-sm">
        <strong>Transcript:</strong> {transcript || '...'}
      </div>
    </div>
  );
};

export default App;
