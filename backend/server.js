const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const cookirePareser = require('cookie-parser')
const RouterApi = require('./router/api');
const jwt = require("jsonwebtoken");
const ws = require('ws');
const Message = require('./models/Message')
const fs = require("fs")

dotenv.config();
const jwtSecrete = process.env.JWT_SECRET;

const app = express();

app.use('/uploads', express.static(__dirname + '/uploads'))
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

    connection.isAlive = true;

    connection.timer = setInterval(() => {
        connection.ping();
        connection.deathTimer = setTimeout(() => {
            connection.isAlive = false;
            clearInterval(connection.timer)
            notifyAboutOnlinePeople();
            connection.terminate();
        }, 1000)
    }, 5000);

    connection.on('pong', () => {
        clearTimeout(connection.deathTimer);
    });

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

    connection.on('message', async (message) => {
        const messageData = JSON.parse(message.toString());
        const { recipient, text, file } = messageData;
        let filename = null;
        if (file) {
            const parts = file.name.split('.');
            const ext = parts[parts.length - 1];
            filename = Date.now() + '.' + ext;
            const path = __dirname + '/uploads/' + filename;
            const bufferData = new Buffer(file.data.split(',')[1], 'base64');
            fs.writeFile(path, bufferData, () => {
                console.log('file saved:' + path);
            });
        }
        if (recipient && (text || file)) {
            const messageDoc = await Message.create({
                sender: connection.userId,
                recipient,
                text,
                file: file ? filename : null,
            });
            [...wss.clients]
                .filter(client => client.userId == recipient)
                .forEach(clinet => clinet.send(JSON.stringify({
                    text,
                    sender: connection.userId,
                    recipient,
                    _id: messageDoc._id,
                    file: file ? filename : null,
                })));
        }
    })

    notifyAboutOnlinePeople();
})