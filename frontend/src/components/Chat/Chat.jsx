import './Chat.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState, useContext, useRef } from 'react'
import Avatar from '../Avatar/Avatar'
import { UserContext } from "../../UserContext"
import { uniqBy } from 'lodash'
import axios from 'axios'


function Chat() {
    const [ws, setWs] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState({});
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [newMessageText, setNewMessageText] = useState('');
    const [messages, setMessages] = useState([]);
    const divUnderMessages = useRef();
    const { username, id, setId, setUsername } = useContext(UserContext);

    useEffect(() => {
        connectToWs();
    }, [])

    function connectToWs() {
        const ws = new WebSocket('ws://localhost:5000');
        setWs(ws);
        ws.addEventListener('message', handleMessage);
        ws.addEventListener('close', () => {
            setTimeout(() => {
                console.log('Disconnected. Trying to reconnect.');
                connectToWs();
            }, 1000);
        });
    }

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
            setMessages(prev => ([...prev, { ...messageData }]))
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
        setMessages(prev => [...prev, {
            text: newMessageText,
            sender: id,
            recipinet: selectedUserId,
            _id: Date.now(),
        }]);
    }

    useEffect(() => {
        const div = divUnderMessages.current;
        if (div) {
            div.scrollIntoView({ behaviour: 'smooth', block: 'end' });
        }
    }, [messages])

    useEffect(() => {
        if (selectedUserId) {
            axios.get('/api/messages' + selectedUserId).then(res => {
                setMessages(res.data);
            })
        }
    }, [selectedUserId])

    const onlinePeopleExclOurUser = { ...onlinePeople };
    delete onlinePeopleExclOurUser[id];

    const messageWithoutDupes = uniqBy(messages, '_id')

    return (
        <div className="chat-container">
            <div className="column-3">
                <h1>ChatWithUs</h1>
                {Object.keys(onlinePeopleExclOurUser).map(userId => (
                    <div
                        key={userId}
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
                    {!!selectedUserId && (
                        <div style={{ position: 'relative', height: "100%" }}>
                            <div className='text'>
                                {messageWithoutDupes.map(message => (
                                    <div key={message._id} className='text-separate' style={(message.sender === id ? { textAlign: "right" } : { textAlign: "left" })}>
                                        <div className='text-details' style={message.sender === id ? { backgroundColor: "#007bff", color: "white" } : { backgroundColor: "#d1d1d1" }}>
                                            {message.text}
                                        </div>
                                    </div>
                                ))}
                                <div ref={divUnderMessages}></div>
                            </div>
                        </div>
                    )}
                </div>
                {!!selectedUserId &&
                    (<div className='message-input'>
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
                    </div>)
                }
            </div>
        </div>
    )
}

export default Chat;