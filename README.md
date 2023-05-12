# MERN Chat App

MERN Chat App is a full-stack web application built using the MERN (MongoDB, Express, React, Node.js) stack. 
It allows users to register and login, chat with each other, and use the OpenAI API to generate automated responses.

## Backend Dependencies

The following dependencies were used in the backend:

* bcryptjs: ^2.4.3
* cookie-parser: ^1.4.6
* cors: ^2.8.5
* dotenv: ^16.0.3
* express: ^4.18.2
* jsonwebtoken: ^9.0.0
* mongoose: ^7.0.3
* nodemon: ^2.0.22
* wb: ^0.0.1
* ws: ^8.13.0

## Frontend Dependencies

The following dependencies were used in the frontend:

* @chatscope/chat-ui-kit-react: ^1.10.1
* @fortawesome/fontawesome-svg-core: ^6.4.0
* @fortawesome/free-solid-svg-icons: ^6.4.0
* @fortawesome/react-fontawesome: ^0.2.0
* @testing-library/jest-dom: ^5.16.5
* @testing-library/react: ^13.4.0
* @testing-library/user-event: ^13.5.0
* axios: ^1.3.4
* lodash: ^4.17.21
* react: ^18.2.0
* react-dom: ^18.2.0
* react-router-dom: ^6.10.0
* react-scripts: 5.0.1
* web-vitals: ^2.1.4

## Demo

https://user-images.githubusercontent.com/116550165/232738901-0449bc33-bdb3-4afd-a839-c2b02c6b9642.mp4

## Features

The MERN Chat App has the following features:

User authentication (login and register)
Real-time chat functionality
Integration with the OpenAI API for automated responses

## Usage
To use the MERN Chat App, follow these steps:

Clone the repository to your local machine.
Install the dependencies using the command npm install in both the root directory and the client directory.
Create a .env file in the root directory and add the following variables:
MONGO_URI - the URI for your MongoDB database
JWT_SECRET - a secret key used for JSON Web Token (JWT) encryption
OPENAI_API_KEY - your OpenAI API key
Start the development server using the command npm run dev in the root directory.
Open a web browser and navigate to http://localhost:3000 to use the app.

