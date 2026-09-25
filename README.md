 # 🔥 FLAMES Elite — Friendship Bond Analyzer

<p align="center">
  <strong>Discover the strength of your friendship through a modern FLAMES experience.</strong>
</p>

<p align="center">
  <a href="https://flames-elite-project.vercel.app/">
    🌐 Live Demo
  </a>
</p>

---

## 📌 About The Project

**FLAMES Elite** is a modern, full-stack friendship analysis web application inspired by the classic FLAMES game.

Instead of traditional relationship categories, FLAMES Elite focuses completely on **friendship bonds** and provides meaningful friendship results with a modern user interface.

Enter two names and discover your friendship bond:

| Letter | Friendship Meaning |
| ------ | ------------------ |
| 🤝 F   | Forever Friendship |
| 💙 L   | Lifelong Friends   |
| ✨ A    | Amazing Bond       |
| 📸 M   | Memorable Bond     |
| ♾️ E   | Endless Friendship |
| 🫶 S   | Strong Friendship  |

---

## ✨ Features

* 🔥 Modern FLAMES friendship analyzer
* 👥 Analyze friendship between two names
* 💙 Friendship-focused results
* 📊 Friendship score
* ✨ Modern and responsive UI
* 📱 Mobile-friendly design
* ⚡ Fast React frontend
* 🚀 REST API backend
* 🍃 MongoDB database integration
* 📜 Friendship analysis history
* 🌐 Production deployment
* 🔄 Frontend and backend API integration

---

## 🛠️ Tech Stack

### Frontend

* ⚛️ React.js
* ⚡ Vite
* 🎨 CSS
* 🌐 Fetch API

### Backend

* 🟢 Node.js
* 🚂 Express.js
* 🔗 REST API
* 🌍 CORS

### Database

* 🍃 MongoDB
* ☁️ MongoDB Atlas

### Deployment

* ▲ Vercel — Frontend
* 🚀 Render — Backend
* 🍃 MongoDB Atlas — Database

---

## 🏗️ Project Architecture

```text
                    ┌─────────────────────┐
                    │       User          │
                    │   Enters 2 Names    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │       Vercel        │
                    └──────────┬──────────┘
                               │
                         REST API Request
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Express Backend   │
                    │       Render       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   FLAMES Analysis   │
                    │      Algorithm      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    MongoDB Atlas    │
                    │   Store History     │
                    └─────────────────────┘
```

---

## 🔄 How It Works

1. User enters the first name.
2. User enters the second name.
3. Frontend sends the names to the backend API.
4. Backend processes the FLAMES algorithm.
5. The algorithm generates a friendship letter.
6. The corresponding friendship meaning is selected.
7. A friendship score and message are generated.
8. The result is stored in MongoDB.
9. The result is displayed on the frontend.

---

## 🧪 Example

### Input

```text
Name 1: Thennarasu
Name 2: Nithesh
```

### Output

```text
Letter: E

Result: Endless Friendship

Score: 97
```

---

## 📂 Project Structure

```text
flames-elite-project/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── .env.local
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md
```

---

## 🔌 API Endpoints

### Analyze Friendship

```http
POST /api/flames/analyze
```

Example request:

```json
{
  "name1": "Thennarasu",
  "name2": "Nithesh"
}
```

Example response:

```json
{
  "success": true,
  "letter": "E",
  "title": "Endless Friendship"
}
```

### Get Friendship History

```http
GET /api/flames/history
```

### Delete History

```http
DELETE /api/flames/history
```

---

## ⚙️ Environment Variables

### Frontend

Create a `.env.local` file inside the `frontend` folder:

```env
VITE_API_URL=https://flames-elite-project.onrender.com/api/flames
```

### Backend

Create a `.env` file inside the `backend` folder:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

> ⚠️ Never upload `.env` or `.env.local` files containing passwords, API keys, or database credentials to GitHub.

---

## 💻 Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/thennarasuselvaraj0608-coder/flames-elite-project.git
```

```bash
cd flames-elite-project
```

---

### 2. Start the Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

---

### 3. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on the Vite development URL shown in the terminal.

---

## 🌐 Live Deployment

### Frontend

**Vercel**

https://flames-elite-project.vercel.app/

### Backend

**Render**

https://flames-elite-project.onrender.com

---

## 🎯 Future Improvements

* 🔐 User authentication
* 👤 User profiles
* 📜 Personal friendship history
* 📈 Friendship analytics dashboard
* 🎨 More UI themes
* 🌓 Dark / Light mode
* 📱 Progressive Web App support
* 🔗 Share friendship results
* 🖼️ Download result as an image
* 🏆 Friendship achievements and badges

---

## 🎓 Project Purpose

This project was developed as a practical full-stack development project to understand and demonstrate:

* Frontend development with React
* REST API development
* Backend development with Node.js and Express
* Database integration with MongoDB
* API communication
* Environment variables
* Git and GitHub
* Cloud deployment
* Vercel and Render deployment

---

## 👨‍💻 Developer

**Thennarasu S**

B.Tech Artificial Intelligence & Data Science Student

Aspiring Software Engineer | AI & Data Science Enthusiast | Java & Web Development

---

## ⭐ Support

If you like this project, consider giving the repository a ⭐ on GitHub.

---

<p align="center">
  Made with ❤️ and 🔥 by <strong>Thennarasu S</strong>
</p>
