<div align="center">

<img src="https://raw.githubusercontent.com/Umvt07/AlgoEngine/main/frontend/public/whole_image.png" alt="AlgoEngine Logo" width="360" />

# ⚙️ AlgoEngine

### **Target Your Optimal Growth Zone on Codeforces**

**A full-stack competitive programming companion that analyzes your Codeforces profile, detects your growth zone, and recommends the right problems to help you level up faster.**

<br />

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Now-00C853?style=for-the-badge)](https://algoengine07.netlify.app)
[![GitHub Stars](https://img.shields.io/github/stars/Umvt07/AlgoEngine?style=for-the-badge&logo=github&color=yellow)](https://github.com/Umvt07/AlgoEngine/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/Umvt07/AlgoEngine?style=for-the-badge&logo=github)](https://github.com/Umvt07/AlgoEngine/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/Umvt07/AlgoEngine?style=for-the-badge&logo=github)](https://github.com/Umvt07/AlgoEngine/issues)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](./LICENSE)

<br />

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](#)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](#)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](#)
[![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=jsonwebtokens)](#)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)
[![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](#)
[![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](#)

<br />

**[🌐 Live Demo](https://algoengine07.netlify.app)** •
**[🐛 Report Bug](https://github.com/Umvt07/AlgoEngine/issues)** •
**[💡 Request Feature](https://github.com/Umvt07/AlgoEngine/issues)**

</div>

---

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#️-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [Project Structure](#-project-structure)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 📌 About the Project

**AlgoEngine** is built for competitive programmers who want to train smarter, not just harder.

Instead of randomly solving problems, AlgoEngine studies your **Codeforces submissions**, identifies your **realistic growth range**, and recommends problems that are challenging enough to improve your skills without being too far beyond your current level. It also helps you discover **virtual contests** that match your target rating band.

This makes practice more focused, more efficient, and more strategic.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔐 **Secure Codeforces Login** | Log in using Codeforces OAuth with secure authentication and HTTP-only cookies. |
| 📊 **Profile Analysis** | Fetches your submission history and analyzes solved problems across rating bands. |
| 🎯 **Smart Problem Recommendations** | Finds the most useful unsolved problems based on your current level and growth zone. |
| 🏆 **Virtual Contest Finder** | Suggests past contests with problem sets aligned to your target rating range. |
| ⚡ **Fast & Clean UI** | Built with a modern interface for smooth navigation and a better user experience. |

---

## 🛠️ Tech Stack

<table>
<tr>
<td valign="top" width="33%">

**Frontend**
- React (Vite)
- Tailwind CSS
- React Router DOM
- Axios

</td>
<td valign="top" width="33%">

**Backend**
- Node.js
- Express.js
- MongoDB
- Codeforces Official API
- JSON Web Tokens (JWT)
- Secure HTTP-only Cookies
- CORS

</td>
<td valign="top" width="33%">

**Deployment**
- Frontend → Netlify
- Backend → Render

</td>
</tr>
</table>

---

## 🏗️ Architecture

```
┌──────────────┐        ┌──────────────┐        ┌────────────────────┐
│   Frontend   │  REST  │   Backend    │  API   │   Codeforces API   │
│ React + Vite │ <────> │Node/Express  │ <────> │  (public data)     │
│  (Netlify)   │        │  (Render)    │        │                    │
└──────────────┘        └──────┬───────┘        └────────────────────┘
                                │
                                ▼
                         ┌──────────────┐
                         │   MongoDB    │
                         │  (user data) │
                         └──────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (local instance or a MongoDB Atlas cluster)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/Umvt07/AlgoEngine.git
cd AlgoEngine
```

**2. Install frontend dependencies**

```bash
cd frontend
npm install
```

**3. Install backend dependencies**

```bash
cd ../backend
npm install
```

### Environment Variables

Create a `.env` file inside the `backend` directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CODEFORCES_API_KEY=your_codeforces_api_key
CODEFORCES_API_SECRET=your_codeforces_api_secret
CLIENT_URL=http://localhost:5173
```

Create a `.env` file inside the `frontend` directory with the following variable:

```env
VITE_API_BASE_URL=http://localhost:5000
```

> ⚠️ Never commit your `.env` files. Make sure they are listed in `.gitignore`.

### Running the App

**Start the backend server**

```bash
cd backend
npm run dev
```

**Start the frontend development server**

```bash
cd frontend
npm run dev
```

The app should now be running at `http://localhost:5173` 🎉

---

## 📁 Project Structure

```
AlgoEngine/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── server.js
│
└── README.md
```

---

## 🗺️ Roadmap

- [ ] Add problem difficulty prediction using ML
- [ ] Add contest reminders & notifications
- [ ] Add leaderboard for friends comparison
- [ ] Dark mode support
- [ ] Mobile-responsive enhancements

See the [open issues](https://github.com/Umvt07/AlgoEngine/issues) for a full list of proposed features and known issues.

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 📬 Contact

**Project Maintainer:** [Umvt07](https://github.com/Umvt07)

**Project Link:** [https://github.com/Umvt07/AlgoEngine](https://github.com/Umvt07/AlgoEngine)

<div align="center">

⭐ **If you found this project useful, consider giving it a star!** ⭐

</div>
