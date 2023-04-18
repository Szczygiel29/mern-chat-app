import './Chat.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faPaperclip } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState, useContext, useRef } from 'react'
import Avatar from '../Avatar/Avatar'
import { UserContext } from "../../UserContext"
import { uniqBy } from 'lodash'
import axios from 'axios'
import AIChat from '../AIChat/AIChat'

function Chat() {
    const [showAIChat, setShowAIChat] = useState(false);
    const [ws, setWs] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState({});
    const [offlinePeople, setOfflinePeople] = useState({});
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [newMessageText, setNewMessageText] = useState('');
    const [messages, setMessages] = useState([]);
    const divUnderMessages = useRef();
    const { username, id, setId, setUsername } = useContext(UserContext);

    useEffect(() => {
        connectToWs();
    }, [selectedUserId])

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
        } else if ('text' in messageData) {
            if (messageData.sender === selectedUserId) {
                setMessages(prev => ([...prev, { ...messageData }]));
            }
        }
    }

    function logout() {
        axios.post('/api/logout').then(() => {
            setWs(null)
            setId(null);
            setUsername(null);
        })
    }

    function sendMessage(e, file = null) {
        if (e) e.preventDefault();
        ws.send(JSON.stringify(
            {
                recipient: selectedUserId,
                text: newMessageText,
                file,
            }
        ));
        if (file) {
            axios.get('/api/messages/' + selectedUserId).then(res => {
                setMessages(res.data);
            });
        } else {
            setNewMessageText('');
            setMessages(prev => [...prev, {
                text: newMessageText,
                sender: id,
                recipinet: selectedUserId,
                _id: Date.now(),
            }]);
        }
    }

    function sendFile(e) {
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            sendMessage(null, {
                data: reader.result,
                name: e.target.files[0].name,
            })
        };
    }

    useEffect(() => {
        const div = divUnderMessages.current;
        if (div) {
            div.scrollIntoView({ behaviour: 'smooth', block: 'end' });
        }
    }, [messages]);

    useEffect(() => {
        axios.get('/api/people').then(res => {
            const offlinePeopleArr = res.data
                .filter(p => p._id !== id)
                .filter(p => !Object.keys(onlinePeople).includes(p._id));
            const offlinePeople = {};
            offlinePeopleArr.forEach(p => {
                offlinePeople[p._id] = p.username;
            });
            setOfflinePeople(offlinePeople);
        });
    }, [onlinePeople]);

    useEffect(() => {
        if (selectedUserId) {
            axios.get('/api/messages/' + selectedUserId).then(res => {
                setMessages(res.data);
            });
        }
    }, [selectedUserId]);

    function handleAIChatClick() {
        setShowAIChat(prev => !prev);
    }

    const onlinePeopleExclOurUser = { ...onlinePeople };
    delete onlinePeopleExclOurUser[id];


    const messageWithoutDupes = uniqBy(messages, '_id')

    return (
        <div className="chat-container">
            <div className="column-3">
                <div style={{ flexGrow: "1" }}>
                    <h1>ChatWithUs</h1>
                    <div
                        className='AI user'
                        onClick={handleAIChatClick}
                        style={showAIChat ? { backgroundColor: "rgba(0, 132, 255, 0.235)", borderLeft: "8px solid #007bff" } : {}}>
                        <Avatar online={true} userName={"AI"} userId={"1111111111159d57f4ff1a3"} />
                        <h3>I'm AI chat</h3>
                    </div>
                    {Object.keys(onlinePeopleExclOurUser).map(userId => (
                        <div
                            key={userId}
                            id={userId}
                            className='user'
                            onClick={() => { setSelectedUserId(userId) }}
                            style={userId === selectedUserId ? { backgroundColor: "rgba(0, 132, 255, 0.235)", borderLeft: "8px solid #007bff" } : {}}
                        >
                            <Avatar online={true} userName={onlinePeople[userId]} userId={userId} />
                            <span>{onlinePeople[userId]}</span>
                        </div>
                    ))}
                    {Object.keys(offlinePeople).map(userId => (
                        <div
                            key={userId}
                            id={userId}
                            className='user'
                            onClick={() => setSelectedUserId(userId)}
                            style={userId === selectedUserId ? { backgroundColor: "rgba(0, 132, 255, 0.235)", borderLeft: "8px solid #007bff" } : {}}
                        >
                            <Avatar online={false} userName={offlinePeople[userId]} userId={userId} />
                            <span>{offlinePeople[userId]}</span>
                        </div>
                    ))}
                </div>
                <div className='logout-button'>
                    <span className='logout-text'>
                        Welcom {username}
                    </span>
                    <button
                        onClick={logout}
                        className='btn'>logout</button>
                </div>
            </div>
            <div className="column-4">
                <div className="messages">
                    {showAIChat ? <AIChat /> : (<>{!selectedUserId && (
                        <div className='no-selected'>&larr; no selected person </div>
                    )}
                        {!!selectedUserId && (
                            <div style={{ position: 'relative', height: "100%" }}>
                                <div className='text'>
                                    {messageWithoutDupes.map(message => (
                                        <div key={message._id} className='text-separate' style={(message.sender === id ? { textAlign: "right" } : { textAlign: "left" })}>
                                            <div className='text-details' style={message.sender === id ? { backgroundColor: "#007bff", color: "white" } : { backgroundColor: "#d1d1d1" }}>
                                                {message.text}
                                                {message.file && (
                                                    <div>
                                                        <FontAwesomeIcon icon={faPaperclip} />
                                                        <a style={{ textDecoration: 'underline', marginLeft: "10px" }} href={axios.defaults.baseURL + '/uploads/' + message.file}>
                                                            {message.file}
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={divUnderMessages}></div>
                                </div>
                            </div>
                        )}
                    </>)}
                </div>
                {!!selectedUserId && !showAIChat &&
                    (<div className='message-input'>
                        <form onSubmit={sendMessage}>
                            <label type='submit' className='btn-attechment'>
                                <input type="file" className='hidden' onChange={sendFile} />
                                <FontAwesomeIcon icon={faPaperclip} size="2xl" />
                            </label>
                            <input
                                value={newMessageText}
                                onChange={e => setNewMessageText(e.target.value)}
                                type="text"
                                placeholder="Type your message here"
                            />
                            <button type='submit' className='btn-submit'>
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