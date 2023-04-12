const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const cookirePareser = require('cookie-parser')
const RouterApi = require('./router/api');
const jwt = require("jsonwebtoken");
const ws = require('ws');

dotenv.config();
const jwtSecrete = process.env.JWT_SECRET;

const app = express();

app.use(express.json());
app.use(cookirePareser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
}));

const connection = process.env.MONGO_URL;

const connectMongoose = async () => {
    try {
        await mongoose.connect(connection)
        console.log('Connect with mongooseDB')
    } catch (error) {
        console.error(error);
    }
}

connectMongoose();

app.use('/api', RouterApi);

const server = app.listen(5000, () => console.log(`http://localhost:5000/`));

const wss = new ws.WebSocketServer({ server });

wss.on('connection', (connection, req) => {

    function notifyAboutOnlinePeople() {
        [...wss.clients].forEach(client => {
            client.send(JSON.stringify({
                online: [...wss.clients].map(clie => ({
                    userId: clie.userId,
                    username: clie.username
                }))
            }
            ))
        })
    }

    const cookies = req.headers.cookie;
    if (cookies) {
        const tokenCookieStr = cookies.split(';').find(str => str.startsWith('token='));
        if (tokenCookieStr) {
            const token = tokenCookieStr.split('=')[1];
            if (token) {
                jwt.verify(token, jwtSecrete, {}, (err, data) => {
                    if (err) throw err;
                    const { userId, username } = data;
                    connection.userId = userId;
                    connection.username = username;
                })
            }
        }
    }

    connection.on('message', (message) => {
        const messageData = JSON.parse(message.toString());
        const { recipient, text } = messageData;
        if (recipient && text) {
            [...wss.clients]
                .filter(client => client.userId == recipient)
                .forEach(clinet => clinet.send(JSON.stringify({ text, sender: connection.userId })));
        }
    })

    notifyAboutOnlinePeople();
})