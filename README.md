# Yaycha - Mini Social Media App

Yaycha is a mini social media application that allows users to create posts, comment on them, and like content. The app features **real-time notifications** using WebSockets and provides **JWT-based authentication** for secure user interactions.

<img width="1440" alt="Screenshot 2024-08-28 at 1 03 58 AM" src="https://github.com/user-attachments/assets/f2f98f4d-d486-42c3-9a38-06df25d8beeb">
<img width="1440" alt="Screenshot 2024-08-28 at 1 03 58 AM" src="https://github.com/user-attachments/assets/57700c49-0b97-4cd5-a466-13cc4685f6b0">

## Key Features

- **Post**: Users can create and view posts.
- **Like**: Users can like posts and comments.
- **Comment**: Users can comment on posts and interact with content.
- **Real-time Notifications**: WebSockets are used for instant notifications when users receive likes or comments on their posts.
- **JWT Authentication**: Secure user login and session management with JWT.

## Tech Stack

### Frontend:

- **React**: A JavaScript library for building user interfaces.
- **Material-UI (MUI)**: A popular React UI framework for modern, responsive designs.
- **React Query**: A data-fetching and caching library to manage server state in React apps.
- **React Router DOM**: For routing and navigation within the React app.
- **React Use WebSocket**: A hook to easily integrate WebSockets into React for real-time communication.
- **Date-fns**: Utility functions for working with dates and times in JavaScript.

### Backend:

- **Node.js & Express**: A minimalistic framework to handle HTTP requests and routing.
- **Prisma ORM**: An open-source database toolkit for Node.js to manage SQLite data.
- **SQLite**: A lightweight relational database for local storage.
- **JWT (JSON Web Token)**: For authentication and authorization.
- **Bcrypt**: For hashing and securing user passwords.
- **Express-Ws**: To enable WebSocket functionality in the Express app.

## Features in Progress

- User notifications for new interactions.
