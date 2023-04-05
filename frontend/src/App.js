import './App.css';
import {UserContextProvider } from './UserContext';
import axios from 'axios';
import Routes from './Routes';

function App() {
  axios.defaults.baseURL = 'http://localhost:5000';
  axios.defaults.withCredentials = true;
  return (
    <div className="App">
      <UserContextProvider>
        <Routes />
      </UserContextProvider>
    </div>
  );
}

export default App;
