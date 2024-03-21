# Server

This is the server for our chat application. It uses Node.js, Express, and Socket.IO.

## Setup

1. Clone the repository to your local machine.
2. Navigate to the server directory.
3. Install dependencies with `npm install`.
4. Start the server with `npm run dev`.

## Usage

The server listens for WebSocket connections on the `/` namespace. It emits a 'message' event every 5 seconds and a 'userMessage' event every 7 seconds. It also listens for a 'userMessage' event from the client.

When a 'userMessage' event is received from the client, the server emits a 'userMessage' event back to the client with the received message as the data.

When a client disconnects, the server logs 'User disconnected'.

We use JSON Web Tokens (jsonwebtoken) to authenticate users and protect API routes.

User passwords are hashed using bcryptjs.

User email and password are validated using @hapi/joi.
