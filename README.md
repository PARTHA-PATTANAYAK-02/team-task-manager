# Team Task Manager

A full-stack Team Task Manager web application built using the MERN stack. Users can register/login, create projects, manage tasks, update task status, and track progress through a dynamic dashboard.

## Live Demo

Frontend URL: [https://team-task-manager-six-psi.vercel.app/](https://team-task-manager-six-psi.vercel.app/)

Backend URL: [https://team-task-manager-backend-6dra.onrender.com](https://team-task-manager-backend-6dra.onrender.com)

## GitHub Repository

[https://github.com/PARTHA-PATTANAYAK-02/team-task-manager](https://github.com/PARTHA-PATTANAYAK-02/team-task-manager)

---

# Features

## Authentication

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Logout Functionality

## Dashboard

- Dynamic Task Statistics
- Recent Tasks Section
- Real-time Data Fetching

## Project Management

- Create Projects
- View All Projects
- Dynamic Project Cards
- Modal-based Project Creation

## Task Management

- Create Tasks
- Assign Tasks to Projects
- Update Task Status
- Dynamic Task Table
- Due Date Support

## Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Hot Toast

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcryptjs

### Deployment

- Frontend: Vercel
- Backend: Railway

---

# Folder Structure

```bash
team-task-manager/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
└── README.md
```

---

# Installation & Setup

## Clone Repository

```bash
git clone https://github.com/PARTHA-PATTANAYAK-02/team-task-manager.git
```

---

## Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the server folder:

```env
MONGO_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET_KEY
```

Start Backend:

```bash
npm start
```

---

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

# API Endpoints

## Authentication

| Method | Endpoint           |
| ------ | ------------------ |
| POST   | /api/auth/register |
| POST   | /api/auth/login    |
| GET    | /api/auth/profile  |

## Projects

| Method | Endpoint      |
| ------ | ------------- |
| GET    | /api/projects |
| POST   | /api/projects |

## Tasks

| Method | Endpoint       |
| ------ | -------------- |
| GET    | /api/tasks     |
| POST   | /api/tasks     |
| PUT    | /api/tasks/:id |

---

# Future Improvements

- Team Member Assignment
- Project Details Page
- Role-based UI Restrictions
- Search & Filters
- Dark Mode
- Advanced Analytics

---

# Author

Partha Pattanayak
