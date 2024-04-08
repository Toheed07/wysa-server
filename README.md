# Video

https://github.com/Toheed07/wysa-server/assets/71722636/22c6e0d0-6e33-43f8-bcb9-7b86a0fa303d

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

# Result

https://github.com/Toheed07/wysa-server/assets/71722636/a535a7b1-967b-4457-8440-00115d9ebce4

