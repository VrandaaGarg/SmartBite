# 🍔 SmartBite – Your Personal Restaurant Ordering Website

**SmartBite** is a full-stack restaurant food ordering system tailored for a **single restaurant owner**. From browsing dishes to placing orders, from managing dishes to viewing customers, it handles it all — with an intuitive UI and a smooth, animated experience.

Built using **ReactJS**, **Tailwind CSS**, **Framer Motion** and **Appwrite**, this platform is ideal for food startups and solo restaurant owners looking to digitize their service.

---

## 📸 Project Preview

![Home](./src/assets/home.png)

---

## 👥 Role-Based Access Comparison

| Feature / View                                  | 👤 User                                          | 🛠️ Admin                                             | 👑 Super Admin                                                   |
| ----------------------------------------------- | ------------------------------------------------ | ---------------------------------------------------- | ---------------------------------------------------------------- |
| 🔐 **Access Level**                             | Regular User                                     | Privileged Admin                                     | Top-level Control                                                |
|                                                 | ✅ Profile Dropdown                              | ✅ Profile Dropdown                                  | ✅ Profile Dropdown                                              |
|                                                 | ![User Dropdown](./src/assets/user-dropdown.png) | ![Admin Dropdown](./src/assets/admin-dropdown.png)   | ![Super Dropdown](./src/assets/admin-dropdown.png)               |
| 📦 **View All Orders**                          | ❌ Not Accessible                                | ✅ Access to All Orders with Filters                 | ✅ Full Order Access with Filters                                |
|                                                 |                                                  | ![orders](./src/assets/all-orders.png)               | ![orders](./src/assets/all-orders.png)                           |
| 🍽️ **Manage Dishes**                            | ❌ No Access                                     | ✅ Full Control                                      | ✅ Full Control                                                  |
|                                                 |                                                  | ![add dish](./src/assets/add-dish.png)               | ![add dish](./src/assets/add-dish.png)                           |
|                                                 |                                                  | ![manage dish](./src/assets/manage-dish.png)         | ![manage dish](./src/assets/manage-dish.png)                     |
| 👥 **View Customers & Promote / Demote Admins** | ❌ No Access                                     | ✅ View-Only Access                                  | ✅ Full Access                                                   |
|                                                 |                                                  | ![admin customers](./src/assets/admin-customers.png) | ![super admin customers](./src/assets/super-admin-customers.png) |
| 🎛️ **Admin Dashboard**                          | ❌ Hidden                                        | ✅ Access Granted                                    | ✅ Access + Admin Management Tools                               |

## Admin & Super Admin Dashboard

## ![SuperAdmin](./src/assets/admin.png)

## 📸 Visual Feature Comparison

## 🚀 Features

### 🧑 User Side

- ✅ **Authentication** (Login, Signup, Forgot/Reset Password), **MySQL**
- 🛒 **Cart System** with quantity control, subtotal, tax & delivery calculation
- 💳 **Order Placement** with simulated payment methods (COD, UPI, Card)
- 📜 **Order History** with option to submit reviews
- ✍️ **Review System** – can write, edit, delete reviews
- ✨ **Smooth Animations** using Framer Motion

### 🛠️ Admin Panel

- ➕ **Add / Edit / Delete Dishes**
- 📦 **View All Orders** – Includes dish details, customer address, payment mode, filter by date/name
- 👥 **View & Manage Customers** – Promote/demote admin (only Super Admin)
- 📧 **Order Notification Emails** _(Optional via EmailJS)_

---

## 🧑‍💻 Tech Stack

### Frontend

- ReactJS
- Tailwind CSS
- Framer Motion
- React Router
- React Icons
- Context API (Cart, Auth, Order, Toast)

### Backend

- Appwrite (Auth and DB)

---

## 🔐 Super Admin Access

Only the **super admin** `hi@vrandagarg.in` can:

- 🔐 Promote other users to admin
- 🔐 Demote admins to users

---

## 📁 Folder Structure

```
SmartBite/
│──src/
│   ├── Pages/
│   ├── Admin/
│   ├── Components/
│   ├── Context/
│   ├── Config/
│   ├── assets/
|   │   └── [screenshots, dish images, etc.]
│── public/
│── index.html
│── .env
├── README.md
```

---

## 💡 Future Scope

- ✅ Razorpay / Stripe integration
- 📱 PWA Support
- 📊 Admin dashboard analytics (charts, graphs)
- 📲 Push Notifications
- 🤖 AI Dish Recommendation

---

## 🧑‍🍳 Created With Love By

**Vranda Garg**  
GitHub: [@VrandaaGarg](https://github.com/VrandaaGarg)

> Full-stack Dev 🍔 | Hackathon Enthusiast 💻

---

## 📝 License

This project is open source and free to use for personal or educational purposes.

---
