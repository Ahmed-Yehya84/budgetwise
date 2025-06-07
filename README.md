# BudgetWise 💰

**BudgetWise** is a modern, responsive budget tracker that helps you manage your income and expenses in real-time with a clean UI, powerful filtering, and seamless Firebase integration. Ideal for tracking personal finances across devices.

---

## 🚀 Features

- ✅ Add income and expenses with:

- Description

- Amount

- Type (income/expense)

- Date (with backdating support)

- Category (optional)

- ✅ Real-time syncing with Firebase Realtime Database

- ✅ Chronological sorting of transactions

- ✅ Monthly filter to view transactions by month

- ✅ Live summary panel:

- Total Income

- Total Expenses

- Balance

- ✅ Responsive transaction chart (using Chart.js)

- ✅ Delete individual transactions with confirmation (SweetAlert2)

- ✅ Clear all transactions with confirmation

- ✅ Toast notifications for success/error (Toastify)

- ✅ PDF export of the selected month's transactions and chart

- ✅ Toggle between Dark Mode / Light Mode with BEM-based theme switching

- ✅ Skeleton loader while fetching data

- ✅ Clean UI, mobile-first design

---

## 🛠️ Built With

- **HTML5** / **CSS3**

- **JavaScript (ES6+)**

- **Firebase Realtime Database + Firebase Auth**

- **Chart.js**

- **Toastify JS**

- **SweetAlert2**

- **Webpack**

---

## 📦 Installation & Setup

1\. Clone the repo:

```bash

git clone https://github.com/your-username/budgetwise.git

cd budgetwise

```

```

2\. Install dependencies:

npm install

3. Start the development server:

npm start

🔥 Firebase Setup

BudgetWise uses Firebase Realtime Database and Authentication.

Create a Firebase project at console.firebase.google.com

Enable Email/Password authentication.

Enable the Realtime Database and set rules to allow authenticated read/write access.

Replace firebaseConfig in firebase.js with your project's credentials:

// firebase.js

const firebaseConfig = {

apiKey: "YOUR_API_KEY",

authDomain: "YOUR_PROJECT_ID.firebaseapp.com",

...

};

📄 PDF Export

You can download a monthly expense report as a PDF by clicking the PDF icon in the footer. It includes:

All filtered transactions

Total income, expenses, and balance

A visual chart summary

🌙 Theme Toggle

Switch between light and dark modes from the UI toggle. Your preference is stored and applied automatically.

🧪 Testing

Add/remove transactions and verify live updates.

Try different months via the filter.

Test delete confirmation popups and Clear All functionality.

Export as PDF and verify file content.

Toggle themes to check UI consistency.

🧠 Credits

Developed with ❤️ using Firebase, Webpack, and pure JavaScript.

🌐 Live Demo

https://ahmed-yehya84.github.io/budgetwise/

```
