# 👗 Retro Bella - Full-Stack E-Commerce Store

**Retro Bella** is a full-stack fashion application that bridges the gap between static web design and dynamic, server-side functionality. It features a secure user authentication system, a RESTful API, and a persistent MySQL database.



---

## 🚀 Key Features

* **Secure Authentication:** User signup and login powered by **JWT (JSON Web Tokens)** and **bcrypt.js** for secure password hashing.
* **Dynamic Inventory:** Product data is fetched dynamically from a MySQL database via a Node.js API.
* **Protected Routes:** A frontend "Guard" prevents unauthenticated users from accessing the main shopping page (`home.html`).
* **Responsive UI:** Built with **Bootstrap 5**, ensuring the store looks great on desktops, tablets, and phones.
* **RESTful Architecture:** Clear separation of concerns between the frontend client and the backend server.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | HTML5, CSS3, JavaScript (ES6+), Bootstrap 5 |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL, Sequelize ORM |
| **Security** | JWT, Bcrypt.js, Dotenv |

---

## 📂 Project Structure



├── backend/
│   ├── config/          # Database connection settings
│   ├── models/          # Sequelize data models (User, Product)
│   ├── routes/          # API endpoints (Auth, Products)
│   ├── .env             # Environment variables (DB credentials, JWT secret)
│   └── server.js        # Main entry point for the backend
├── frontend/
│   ├── index.html       # Login/Signup page (entry point)
│   ├── home.html        # Main shop page (protected)
│   ├── login.js         # Authentication logic
│   └── home.js          # Product loading & logout logic

Installation & Setup
1. Prerequisites
Node.js installed.

MySQL Server running locally.

2. Backend Setup
Navigate to the backend folder: cd backend

Install dependencies: npm install

Create a .env file in the backend folder and add your credentials:
DB_NAME=fashion_store
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
JWT_SECRET=your_super_secret_key
PORT=5000
Sync the database and start the server: node server.js

3. Frontend Setup
Open your VS Code in the root directory.

Right-click frontend/index.html and select "Open with Live Server".

Sign up a new user, log in, and explore the store!

A project by Muthu PriyaNandhini AND Anudeep R Gayakwad


