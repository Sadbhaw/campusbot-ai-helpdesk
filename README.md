# 🎓 CampusBot – AI Helpdesk Assistant

CampusBot is an AI-powered helpdesk system designed for colleges.  
It answers student queries instantly using **AI + college database**, and provides a secure admin panel to manage all academic information.

Built using **MERN stack** with **Groq LLaMA AI**, CampusBot is fast, smart, and easy to use.

---

# ✨ Key Features

## 🧠 1. AI Chatbot (Student Side)

- Instant replies using Groq LLaMA AI  
- Understands natural questions  
- Answers using college data (FAQs, Notices, Timetables, PYQs)  
- Supports **PDF / DOC / file responses** inside chat  
- Clean UI with action tools:
  - 📋 Copy reply  
  - 📤 Share reply  
  - 🔁 Retry message  

---

## 🧑‍💼 2. Admin Panel (College Staff)

- Secure Login (JWT Authentication)  
- Add / Edit / Delete:
  - FAQs  
  - Notices (PDF, DOC, etc.)  
  - Timetables (PDF)  
- Role-based user system:
  - **Admin**
  - **Faculty**
  - **Student** (coming soon)

### Security Features

- Encrypted passwords  
- Protected routes  
- JWT-based Authorization  
- Role checks for admin/faculty features  

---

## 📚 3. Database (MongoDB Atlas)

CampusBot stores all college data in the cloud:

- FAQs (type-wise)  
- Notices + file URL  
- Timetables + branch/semester  
- User accounts + encrypted passwords  

Chatbot uses this database to create **accurate, dynamic answers**.

---

# 🏗️ Tech Stack

### 🎨 Frontend
- React.js  
- Axios  
- CSS  

### 🛠️ Backend
- Node.js  
- Express.js  
- Groq LLaMA API  
- JWT Authentication  

### 🗄️ Database
- MongoDB Atlas  

---

# 📁 Project Structure

CampusBot/
│
├── backend/
│   ├── index.js              # Backend server
│   ├── routes/               # API routes
│   ├── models/               # Mongoose models
│   ├── middleware/           # Upload + auth
│   ├── uploads/              # Uploaded PDFs
│   └── .env                  # Environment config
│
└── frontend/
├── src/
│   ├── Chatbot.js
│   ├── Chatbot.css
│   ├── AdminPanel.js
│   ├── AdminLogin.js
│   └── App.js


---

# ⚙️ Installation Guide

## 1️⃣ Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/campusbot-ai-helpdesk.git
````

---

## 2️⃣ Install dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd ../frontend
npm install
```

---

## 3️⃣ Configure Backend `.env`

Inside `backend/.env`:

```
MONGO_URI=your_mongo_connection_string
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=your_secret_key
PORT=5000
```

---

## 4️⃣ Start Backend

```bash
cd backend
npm start
```

---

## 5️⃣ Start Frontend

```bash
cd frontend
npm start
```

---

# 🔍 How CampusBot Works (Easy Explanation)

### ✔ Step 1 — Student asks a question

### ✔ Step 2 — Backend searches database

* If FAQ matches → reply
* If notice/timetable is related → send the file link

### ✔ Step 3 — If no match

AI (Groq LLaMA) generates a **short, safe academic answer**
using your college data as context.

### ✔ Step 4 — Chat UI shows response

with options to Copy / Share / Retry.

---

# ⭐ If you found this project helpful

Give it a star on GitHub to support development!



If you want:

✅ project screenshots  
✅ demo video script  
✅ contribution guidelines  
✅ badges (tech stack icons)  
Just tell me — I’ll add them to the README too.
```
