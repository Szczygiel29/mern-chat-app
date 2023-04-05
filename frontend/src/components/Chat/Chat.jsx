import './Chat.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'

function Chat() {
    const [ws, setWs] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState({});

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:5000/');
        setWs(ws);
        ws.addEventListener('message', handleMessage)
    }, [])

    function showOnlinePeople(peopleArray) {
        const people = {};
        peopleArray.forEach(({ userId, username }) => {
            people[userId] = username;
        });
        setOnlinePeople(people);
    }

    function handleMessage(ev) {
        const messageData = JSON.parse(ev.data);
        if ('online' in messageData) {
            showOnlinePeople(messageData.online);
        }
    }

    return (
        <div className="chat-container">
            <div className="column-3">
                <h1>ChatWithUs</h1>
                {Object.keys(onlinePeople).map(userId => (
                    <div className='user'>{onlinePeople[userId]}</div>
                ))}
            </div>
            <div className="column-4">
                <div className="messages">
                    messages
                </div>
                <div className='message-input'>
                    <input
                        type="text"
                        placeholder="Writte Somthing"
                    />
                    <button>
                        <FontAwesomeIcon icon={faPaperPlane} size="2xl" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Chat;