# Japanese Task Management Portal

A full-stack task management web application with authentication, RESTful APIs, and bilingual (English/Japanese) support.

This project demonstrates full-stack development skills using Node.js, Express, MongoDB, and vanilla JavaScript.

---

# Features

- User Authentication (JWT-based login/register)
- Create, Read, Update, Delete (CRUD) Tasks
- Mark tasks as Completed or Pending
- Filter tasks (All / Completed / Pending)
- Dark Mode Toggle
- English / Japanese Language Toggle
- RESTful API architecture
- Token-based route protection (Auth Middleware)

---

# Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript 
- Fetch API

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)

### Tools
- Git & GitHub
- Nodemon

## 🔗 REST API Routes

### Authentication Routes

| Method | Endpoint | Description |
|--------|----------|------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |

---

### Task Routes (Protected)

| Method | Endpoint | Description |
|--------|----------|------------|
| POST | /api/tasks | Create new task |
| GET | /api/tasks | Get all user tasks |
| PATCH | /api/tasks/:id | Update task (mark complete) |
| DELETE | /api/tasks/:id | Delete task |



##  How to Run the Project

### 1️ Clone Repository
git clone https://github.com/Divya23yadav/TO-DO-LIST-PROJECT.git
### 2 backend part
cd backend part
npm install
nodemon index.js
http://localhost:5000
### 3 frontend part
frontend part/index.html


