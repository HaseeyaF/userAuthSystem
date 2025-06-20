# 🔐 User Authentication System

This is a full-featured **User Authentication System** that I built as a personal project to improve my understanding of **backend security**, and **full-stack integration**.

The system includes **Email Verification** using a 6-digit OTP and a **Password Reset** feature — all securely connected through backend APIs and a modern React frontend.

---

## 📌 About This Project

In this project, I developed a complete authentication system using the **MERN stack** — **MongoDB**, **Express.js**, **React.js**, and **Node.js**. This application securely manages user registration, login, email verification, and password reset functionalities.

The backend uses **JWT (JSON Web Token)** for secure session handling, while the frontend uses **React** and **Tailwind CSS** for a clean and responsive user interface.

This project was part of my effort to strengthen my practical knowledge in:

- Building REST APIs with Node and Express
- Managing authentication securely with JWT and cookies
- Sending emails using Nodemailer
- Structuring a full-stack project cleanly
- Working with React, Tailwind CSS, and Axios

---

## ✨ Features

- ✅ User Registration & Login with secure password handling
- 📧 Email OTP Verification (6-digit, expires after 10 mins)
- 🔑 Password Reset via email-based OTP
- 🍪 JWT Authentication via HTTP-only Cookies
- 🚫 Protected Routes using Middleware
- 🎨 Tailwind CSS styled UI with React Hooks  

---

## 🛠️ Tech Stack

| Layer        | Technology Used |
|--------------|--------------------------|
| Language     | React.js, Tailwind CSS, Axios, React Router DOM |
| IDE          | Node.js, Express.js, MongoDB, Mongoose |
| Auth         | JWT, cookie-parser, bcrypt |
| Email        | Nodemailer |
| Dev Tools    | VS Code, Postman, Git & GitHub |

---


## 🛠️ Setup Instructions - Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/userAuthSystem.git
cd userAuthSystem
```
### 2. Set up the Backend
```bash
cd server
npm install
```
Create a .env file in the server/ directory and add:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=your_node_env
SMTP_USER=your_email@example.com
SMTP_PASS=your_app_password
SENDER_EMAIL=your_email
```
Start the backend server:
```bash
npm start server
```
Backend will run on http://localhost:4000
### 3. Set up the Frontend
```bash
cd client
npm install
npm run dev
```
Create a .env file in the server/ directory and add:
```env
VITE_BACKEND_URL=http://localhost:4000
```
Frontend will run on http://localhost:5173

---

## 🔮 Future Improvements 

- Refresh tokens
- OAuth login (Google, GitHub)
- Resend OTP button with cooldown
- Rate-limiting to prevent OTP abuse
- Multi-language support

---

