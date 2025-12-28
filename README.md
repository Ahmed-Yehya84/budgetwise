# BudgetWise 💰 | Smart Financial Tracker

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)
![Webpack](https://img.shields.io/badge/webpack-%238DD6F9.svg?style=for-the-badge&logo=webpack&logoColor=black)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![Chart.js](https://img.shields.io/badge/chart.js-F5788D.svg?style=for-the-badge&logo=chart.js&logoColor=white)

BudgetWise is a high-performance, responsive budget management application. It bridges the gap between simple spreadsheets and complex banking apps, offering real-time data synchronization, visual analytics, and professional reporting.

🌐 **[Live Demo](https://ahmed-yehya84.github.io/budgetwise/)**

---

### 🚀 Key Features

- **Real-Time Data Engine:** Seamlessly synced with **Firebase Realtime Database** for instant updates across all devices.
- **Visual Analytics:** Dynamic financial overview using **Chart.js** to visualize income vs. expense ratios.
- **Professional Reporting:** One-click **PDF Export** functionality that generates a comprehensive monthly report including transaction history and charts.
- **Advanced Filtering:** Chronological sorting and month-by-month deep dives into spending habits.
- **Modern UI/UX:** - **Dark/Light Mode:** Custom BEM-based theme switching with persistent user preference.
  - **Interactive Feedback:** Integrated **SweetAlert2** for destructive actions and **Toastify** for non-blocking notifications.
  - **Skeleton Loading:** Professional perceived performance during data fetching.

---

### 🛠️ Technical Stack & Architecture

- **Core:** Vanilla JavaScript (ES6+) focusing on modular architecture.
- **Backend-as-a-Service:** Firebase (Auth & Realtime Database) for secure, scalable data persistence.
- **Styling:** CSS3 using **BEM Methodology** for maintainable and scalable styles.
- **Build Tool:** **Webpack** for optimized asset bundling and dependency management.
- **Reporting:** Client-side PDF generation for data privacy.

---

### 📦 Installation & Firebase Setup

To run this project locally, follow these steps:

```bash
# 1. Clone the repository
git clone https://github.com/Ahmed-Yehya84/budgetwise.git
cd budgetwise

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

Firebase Configuration: BudgetWise uses Firebase Realtime Database and Authentication. Create a project at console.firebase.google.com and replace the configuration in src/utils/firebase.js with your credentials:

```
const firebaseConfig = {
apiKey: "YOUR_API_KEY",
authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
databaseURL: "YOUR_DATABASE_URL",
projectId: "YOUR_PROJECT_ID",
storageBucket: "YOUR_STORAGE_BUCKET",
messagingSenderId: "YOUR_SENDER_ID",
appId: "YOUR_APP_ID"
};
```

---

### 📄 PDF Export & Themes

- **Reporting:** Download a monthly expense report as a PDF by clicking the PDF icon in the footer. It includes all filtered transactions, a visual chart summary, and financial totals.
- **Theme Toggle:** Switch between light and dark modes. Your preference is stored in `localStorage` and applied automatically on your next visit.

### 🧠 Strategic Implementation

In this project, I focused on **Clean Code** principles by separating the data logic (Firebase) from the UI rendering. By implementing a custom theme-switching engine and a JSON-like filtering system, I ensured the app remains lightweight while providing a "Premium App" feel.

---

**Developed with ❤️ by [Ahmed Yehya](https://github.com/Ahmed-Yehya84)**
