import logo from './logo.svg';
import './App.css';
import VanityNumberSearch from './VanityNumberSearch'
import react from 'react';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Ian's Vanity Number Project
        </p>
        <p className="Main-text">
          This web page allows you to view the 5 latest callers
        </p>
          <VanityNumberSearch/>
      </header>
    </div>
  );
}

export default App;
