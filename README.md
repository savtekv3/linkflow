# LinkTrack - Link Monitoring & Analytics

A professional link tracking website that monitors if links are online and provides detailed analytics on geographic distribution and click patterns.

## Features
- **User Authentication**: Secure Login and Sign Up system.
- **Link Monitoring**: Add links and track their status.
- **Advanced Analytics**: Visualize click history and visitor locations.
- **Clean UI**: Modern dark-mode interface inspired by premium SaaS platforms.

---

## 🚀 Getting Started

To get this project running on your local machine, follow these steps:

### 1. Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/)

### 2. Clone the Repository
```bash
git clone https://github.com/savtekv3/linkflow.git
cd savtekv3
```

### 3. Setup the Backend
Navigate to the backend folder and install dependencies:
```bash
cd backend
npm install
```

### 4. Configure Database
1. Make sure your MySQL server is running.
2. Open the `backend/.env` file and update your database credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=YOUR_PASSWORD
   DB_NAME=linktrack_db
   ```
3. Initialize the database and tables:
   ```bash
   node init-db.js
   ```

### 5. Run the Application
1. Start the backend server:
   ```bash
   node src/app.js
   ```
2. Open `index.html` in your web browser to start using the app!

---

## 🛠 Tech Stack
- **Frontend**: HTML5, Tailwind CSS, Lucide Icons, Chart.js.
- **Backend**: Node.js, Express.js.
- **Database**: MySQL.
- **Authentication**: JWT, bcrypt.
