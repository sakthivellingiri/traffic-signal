import { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000');

socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

const SignalLight = ({ signalType, signalData }) => {
  const getColor = (type) => {
    const colorMap = {
      Green: '#10B981',
      Yellow: '#FBBF24',
      Red: '#EF4444',
      Gray: '#D1D5DB'
    };
    return type === signalData ? colorMap[type] : colorMap['Gray'];
  };

  return (
    <div className="flex items-center space-x-4 p-4 border rounded-lg shadow-lg">
      {signalType.map((type, index) => (
        <div
          key={index}
          style={{ backgroundColor: getColor(type) }}
          className="w-16 h-16 rounded-full"
        ></div>
      ))}
    </div>
  );
};

function App() {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/api/signal') 
      .then((response) => {
        setSignals(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching traffic data:', error);
      });

    // Listen for live updates from socket
    socket.on('signalUpdated', (updatedSignal) => {
      console.log('Received socket update:', updatedSignal);
      
      if (updatedSignal) {
        setSignals((prevSignals) => {
          const updatedSignals = prevSignals.map((signal) => 
            signal.id === updatedSignal.id ? updatedSignal : signal
          );
          return updatedSignals;
        });
      } else {
        console.warn('Received empty or invalid update!');
      }
    });

    return () => socket.off('signalUpdate');
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-6">Traffic Signal Status</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {signals.map((signal) => (
          <div key={signal.id} className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Machine ID: {signal.machine_id}</h2>
            <SignalLight 
              signalType={signal.signal_type} 
              signalData={signal.signal_data} 
            />
            <p className="mt-4 text-gray-600">Updated: {new Date(signal.updated_at).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
