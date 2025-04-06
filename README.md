# 📝 Task Manager App (Monorepo)

A full-stack Task Manager Application built with **React** (frontend) and **Node.js/Express** (backend), featuring secure user authentication, task CRUD operations, filtering, tagging, due dates, and priority management. This monorepo contains both the frontend and backend codebases.

## Features

- ✅ User Authentication (Signup, Login, Logout)
- ✅ CRUD operations for tasks
- ✅ Tag & Priority filtering
- ✅ Due date support and completion status
- ✅ Responsive design (Mobile & Desktop)
- ✅ Dashboard summary
- ✅ Form validation and error handling

## Tech Stack

### Frontend
* React
* Tailwind CSS
* React Router
* Axios
* Vite
* Prettier + ESLint

### Backend
* Node.js
* Express.js
* MongoDB + Mongoose
* jsonwebtoken
* bcryptjs
* express-validator
* dotenv

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/suprithar2k0/task-manager.git
cd task-manager
```

### 2. Install Dependencies

#### I have written a script to setup and spinup both backend and frontend
```bash
cd task-manager
npm run setup
```

### 3. Create Environment File 
#### .env file frontend
```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

#### .env file backend
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 4. Start Development Server
#### backend server
```bash
npm run start
```
#### frontend server
```bash
npm run dev
```

### 5. Build frontend for Production
```bash 
npm run build
npm run preview
```

### 6. Challenges & Solutions
### Managing Global Auth State
**Challenge:** Keeping the user logged in and protected routes synced across components.

**Solution:** Used React Context API and a custom useAuth hook.

### API Integration with React
**Challenge:** Managing headers, loading, and error states.
**Solution:** Centralized Axios instance with interceptors and reusable API handlers.

### Unified Validation (Frontend + Backend)
**Challenge:** Ensuring consistent validation for tasks and user forms.

**Solution:** express-validator on the server and basic form validation on the client.

### Responsive UI
**Challenge:** Making it mobile-first and fully responsive.
**Solution:** Tailwind's utility classes and conditional layouts.