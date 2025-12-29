# BudgetWise 💰 | Smart Financial Tracker

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)
![Webpack](https://img.shields.io/badge/webpack-%238DD6F9.svg?style=for-the-badge&logo=webpack&logoColor=black)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)
![Chart.js](https://img.shields.io/badge/chart.js-F5788D.svg?style=for-the-badge&logo=chart.js&logoColor=white)

BudgetWise is a high-performance, secure budget management application. It bridges the gap between simple spreadsheets and complex banking apps, offering real-time data synchronization, visual analytics, and professional reporting.

🌐 **[Live Demo: BudgetWise on Vercel](https://budgetwise-kappa.vercel.app/)**

---

### 🚀 Key Features

- **Real-Time Data Engine:** Seamlessly synced with **Firebase Realtime Database** for instant updates across all devices.
- **Visual Analytics:** Dynamic financial overview using **Chart.js** to visualize income vs. expense ratios.
- **Professional Reporting:** One-click **PDF Export** functionality that generates a comprehensive monthly report.
- **Advanced Filtering:** Chronological sorting and month-by-month deep dives into spending habits.
- **Modern UI/UX:** - **Dark/Light Mode:** Custom BEM-based theme switching with persistent user preference.
  - **Interactive Feedback:** Integrated **SweetAlert2** and **Toastify** for a polished user experience.
  - **Skeleton Loading:** Optimized perceived performance during data fetching.

---

### 🛠️ Technical Stack & Architecture

- **Core:** Vanilla JavaScript (ES6+) focusing on modular architecture.
- **Security:** Professional build pipeline using **Webpack 5** and **Environment Variables** (`dotenv`) to protect sensitive API credentials.
- **Backend:** Firebase (Auth & Realtime Database).
- **Styling:** CSS3 using **BEM Methodology** for maintainable code.
- **Deployment:** CI/CD pipeline via **Vercel** with automated production builds.

---

### 📦 Installation & Setup

To run this project locally, you will need to set up your own environment variables:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Ahmed-Yehya84/budgetwise.git](https://github.com/Ahmed-Yehya84/budgetwise.git)
   cd budgetwise
   ```

````
2.Install dependencies:
```bash
npm install
````

3.Configure Environment Variables: Create a .env file in the root directory and add your Firebase credentials (these variables are injected via Webpack at build time):

```
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_DATABASE_URL=your_database_url
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_id
FIREBASE_APP_ID=your_app_id
```

4. Start the development server:

```bash
npm start
```

### 📄 PDF Export & Themes

- **Reporting:** Download a monthly expense report as a PDF by clicking the PDF icon in the footer. It includes all filtered transactions, a visual chart summary, and financial totals.
- **Theme Toggle:** Switch between light and dark modes. Your preference is stored in `localStorage` and applied automatically on your next visit.

---

### 🧠 Strategic Implementation

In this project, I focused on **Clean Code** and **Security**. By implementing a Webpack-based build system, I ensured that API keys are never hardcoded in the source files, preventing credential leakage.

The application follows a modular structure, strictly separating the **Firebase data logic** from the **UI rendering components**. This decoupling ensures the codebase remains scalable, testable, and easy to maintain as new features are added.

---

**Developed with ❤️ by [Ahmed Yehya](https://github.com/Ahmed-Yehya84)**
