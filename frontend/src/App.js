import './App.css';
import {UserContextProvider } from './UserContext';
import axios from 'axios';
import Routes from './Routes';

function App() {
  axios.defaults.baseURL = 'https://chat-app-vfvi.onrender.com';
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
