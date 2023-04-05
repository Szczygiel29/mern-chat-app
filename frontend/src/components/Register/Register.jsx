import { useContext, useState } from "react";
import "./Register.css";
import axios from 'axios';
import { UserContext } from "../../UserContext"

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginOrRegister, setIsLoginOrRegister] = useState('login');
    const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);

    async function handleSubmit(ev) {
        ev.preventDefault();
        const url = isLoginOrRegister === 'register' ? 'register' : 'login';
        const { data } = await axios.post(`/api/${url}`, { username, password });
        setLoggedInUsername(username);
        setId(data.id);
    }

    return (
        <div className="register">
            <div className="column-1">
                <h1>Chat With Us</h1>
                <p>A new platform to type with friends and with AI</p>
            </div>
            <div className="column-2" onSubmit={handleSubmit}>
                <h1>Register</h1>
                <p>Let us get to know each other.</p>
                <form>
                    <input
                        value={username}
                        type="text"
                        placeholder="username"
                        className="register-input"
                        onChange={e => setUsername(e.target.value)} />
                    <input
                        value={password}
                        type="password"
                        placeholder="password"
                        className="register-input"
                        onChange={e => setPassword(e.target.value)} />
                    <button>
                        {isLoginOrRegister === 'register' ? 'Register' : 'Login'}
                    </button>
                    <div className="login">
                        {isLoginOrRegister === 'register' && (
                            <div>
                                <p>
                                    Already a member?
                                    <div className="switch-button" onClick={() => setIsLoginOrRegister('login')}>
                                        Login here
                                    </div>
                                </p>
                            </div>
                        )}
                        {isLoginOrRegister === 'login' && (
                            <div>
                                <p>
                                Dont have an account?
                                <div className="switch-button" onClick={() => setIsLoginOrRegister('register')}>
                                    Register
                                </div>
                                </p>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register;