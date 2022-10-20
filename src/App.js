import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState("");
  const [tempMessage, setTempMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getValue = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/message');
      const data = await response.json();

      if (!data.message) {
        return;
      }
      setMessage(data.message);
      setTempMessage(data.message);
    } catch (error) {
      console.log(`Get error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  const setValue = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: tempMessage
          })
        }
      );
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.log(`Set error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getValue();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>Message: <input onChange={(event) => setTempMessage(event.target.value)} type="text" disabled={isLoading} value={tempMessage} /></p>
        <button onClick={setValue}>Save</button>
        <p>Stored message: {!isLoading ? message : 'Loading...'}</p>
      </header>
    </div>
  );
}

export default App;
