import './Chat.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState, useContext } from 'react'
import Avatar from '../Avatar/Avatar'
import { UserContext } from "../../UserContext"

function Chat() {
    const [ws, setWs] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState({});
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [newMessageText, setNewMessageText] = useState('');
    const [message, setMessage] = useState([]);
    const { username, id, setId, setUsername } = useContext(UserContext);

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
        } else {
            setMessage(prev => ([...prev, {isOur: false, text: messageData.text}]))
        }
    }

    function sendMessage(e) {
        e.preventDefault();
        ws.send(JSON.stringify(
            {
                recipient: selectedUserId,
                text: newMessageText,
            }
        ));
        setNewMessageText('');
        setMessage(prev => [...prev, {text: newMessageText, isOur: true}])
    }

    const onlinePeopleExclOurUser = { ...onlinePeople };
    delete onlinePeopleExclOurUser[id];

    return (
        <div className="chat-container">
            <div className="column-3">
                <h1>ChatWithUs</h1>
                {Object.keys(onlinePeople).map(userId => (
                    <div
                        className='user'
                        onClick={() => setSelectedUserId(userId)}
                        style={userId === selectedUserId ? { backgroundColor: "rgba(0, 132, 255, 0.235)", borderLeft: "8px solid #007bff" } : {}}
                    >
                        <Avatar userName={onlinePeople[userId]} userId={userId} />
                        <span>{onlinePeople[userId]}</span>
                    </div>
                ))}
            </div>
            <div className="column-4">
                <div className="messages">
                    {!selectedUserId && (
                        <div className='no-selected'>&larr; no selected person </div>
                    )}
                </div>
                {!!selectedUserId &&
                    <div className='message-input'>
                        <form onSubmit={sendMessage}>
                            <input
                                value={newMessageText}
                                onChange={e => setNewMessageText(e.target.value)}
                                type="text"
                                placeholder="Writte Somthing"
                            />
                            <button type='submit'>
                                <FontAwesomeIcon icon={faPaperPlane} size="2xl" />
                            </button>
                        </form>
                    </div>
                }
            </div>
        </div>
    )
}

export default Chat;