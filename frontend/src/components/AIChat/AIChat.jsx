import { useState } from 'react'
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    TypingIndicator
} from '@chatscope/chat-ui-kit-react'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import API_KEY from '../API_KEY'
import './AIChat.css'


function AIChat() {
    const [typing, setTyping] = useState(false)
    const [messages, setMessages] = useState([
        {
            message: 'Hello, I am AI and I here to help you. If you want to leave the chat, press the AI field again.',
            sender: "ChatGPT"
        }
    ])

    const handleSend = async (message) => {
        const newMessage = {
            message: message,
            sender: 'user',
            direction: 'outgoing'
        }

        const newMessages = [...messages, newMessage]
        setMessages(newMessages)
        setTyping(true)
        await processMessageToChatGPT(newMessages)
    }

    async function processMessageToChatGPT(chatMessages) {
        let apiMessages = chatMessages.map(messageObj => {
            let role = "";
            if (messageObj.sender === "ChatGpt") {
                role = "assistant"
            } else {
                role = "user"
            }
            return { role: role, content: messageObj.message }
        })

        const systemMessage = {
            role: "system",
            content: "Explain all concepts like I am 10 years old."
        }

        const apiRequestBody = {
            "model": "gpt-3.5-turbo",
            "messages": [
                systemMessage,
                ...apiMessages,
            ]
        }

        await fetch("https://api.openai.com/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + API_KEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(apiRequestBody)
            }).then((data) => {
                return data.json();
            }).then(data => {
                setMessages(
                    [...chatMessages, {
                        message: data.choices[0].message.content,
                        sender: "ChatGPT"
                    }]
                );
                setTyping(false);
            })
    }

    return (
        <div className='ai'>
            <div style={{ height: "100%", width: "100%" }}>
                <MainContainer>
                    <ChatContainer>
                        <MessageList
                            scrollBehavior='smooth'
                            typingIndicator={typing ? <TypingIndicator content="ChatGPT is typing" /> : null}
                        >
                            {messages.map((message, index) => {
                                return <Message key={index} model={message} />
                            })}
                        </MessageList>
                        <MessageInput placeholder='Type message here' onSend={handleSend} />
                    </ChatContainer>
                </MainContainer>
            </div>
        </div>
    )
}


export default AIChat;