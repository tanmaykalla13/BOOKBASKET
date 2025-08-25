# 📚 BookBasket – Full-Stack eCommerce Web App

BookBasket is a modern, full-stack eCommerce application built for seamless book browsing, shopping, and management. It supports categorized product listings, a dynamic cart system, secure authentication, and an admin panel for product control.

---

## 🖥️ Live Demo

* 🌐 **Frontend**: https://bookbasket1.vercel.app/
* 🌐 **Admin Panel**: Not deployed for security reasons
* 🔗 **Backend**: https://bookbasket-atug.onrender.com
* 🗃 **Database**: MongoDB Atlas

---

## 🧰 Tech Stack

| Layer          | Technology                                                         |
| -------------- | ------------------------------------------------------------------ |
| **Frontend**   | React.js (Vite), React Router DOM, Context API, CSS Modules        |
| **Admin**      | React.js (Vite), React Router DOM, Axios, FormData, Custom CSS     |
| **Backend**    | Node.js, Express.js, MongoDB (Mongoose), Multer, JWT, dotenv, CORS |
| **Database**   | MongoDB Atlas                                                      |
| **Deployment** | Vercel (Frontend/Admin), Render (Backend), GitHub Actions (CI/CD)  |

---

## 🚀 System Overview

### ✅ Core Features

#### 🛍️ Product Management

* Add/Remove products with images
* Auto-generated Product IDs
* Category-wise segregation (Fiction, Non-Fiction, Children)
* Bestseller & New Collection curation

#### 👤 User Authentication

* JWT-based login/signup
* Cart initialized on signup
* Token stored in `localStorage`

#### 🛒 Cart Management

* Add/Remove items from cart
* Real-time cart sync with backend
* Clear cart functionality
* Auth-aware actions (only when logged in)

#### 📦 Product Discovery

* `/newcollections`: Fetch 3 latest books from each category
* `/bestsellers`: Fetch oldest 2 books per category

---

## 🛠 Backend Features

**Base URL**: `https://bookbasket-api.onrender.com`

| Endpoint          | Method | Description                               |
| ----------------- | ------ | ----------------------------------------- |
| `/addproduct`     | POST   | Add new book (auto ID + image URL)        |
| `/removeproduct`  | POST   | Remove product by ID                      |
| `/getproducts`    | GET    | Get all products                          |
| `/upload`         | POST   | Upload product image using multer         |
| `/signup`         | POST   | Register user + init cart + return JWT    |
| `/login`          | POST   | Authenticate user and return JWT          |
| `/addtocart`      | POST   | Increment product quantity in user’s cart |
| `/removefromcart` | POST   | Decrease quantity in user’s cart          |
| `/getcart`        | POST   | Get cart data (secured)                   |
| `/clearcart`      | POST   | Reset cart to initial state               |
| `/newcollections` | GET    | Latest 3 per category                     |
| `/bestsellers`    | GET    | Oldest 2 per category                     |

---

## 🖥️ Admin Panel

**Admin Features:**

* 📦 Add Product (with image upload and preview)
* 🧾 Product List View (with delete option)
* 🧭 Sidebar Navigation with active highlighting
* 📤 Image Upload to backend via `FormData`
* ✅ Success/Error alerts and basic form validation
* ⚙️ Modular, scalable component design

---

## 🌐 Frontend Overview

| Route          | Description                                    |
| -------------- | ---------------------------------------------- |
| `/`            | Home (Hero, Bestsellers, NewCollections, etc.) |
| `/fiction`     | Category page for Fiction                      |
| `/non-fiction` | Category page for Non-Fiction                  |
| `/children`    | Category page for Children                     |
| `/product/:id` | Product details page                           |
| `/cart`        | View & update cart                             |
| `/checkout`    | Final checkout and order placement             |
| `/login`       | Login/Signup form with validation              |

**State Management:**

* Global via Context API (`ShopContext`)
* Cart & product data available across components
* Token-based login & protected cart sync

---

## 📁 Folder Structure

```
📦 bookbasket
├── frontend/          → User Interface
├── admin/             → Admin Panel
└── backend/           → Node.js Server
```

---

## 🧑‍💻 Getting Started Locally

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/bookbasket.git
cd bookbasket
```

### 2. Setup Backend

```bash
cd backend
npm install
# Create a .env file as shown below
node index.js
```

#### Sample `.env`

```env
PORT=5000
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/bookbasket
JWT_SECRET=your_jwt_secret
BASE_URL=http://localhost:5000
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

### 4. Setup Admin Panel

```bash
cd ../admin
npm install
npm run dev
```

---

## 🚀 Deployment

| Component   | Platform      | URL / Notes                                  |
| ----------- | ------------- | -------------------------------------------  |
| Frontend    | Vercel        | [Live](https://bookbasket1.vercel.app/)      |
| Admin Panel | Vercel        | Not deployed publicly – Reserved for admins  |
| Backend     | Render        | [Live](https://bookbasket-atug.onrender.com) |
| Database    | MongoDB Atlas | Secured with IP whitelisting                 |

---

## 🔐 Security & Best Practices

* JWT authentication for secure routes
* CORS enabled for cross-origin frontend-backend communication
* Environment-based configuration using `.env`
* Static image upload serving with timestamped filenames

---

## 📚 Highlights

* 📸 Image preview before upload
* 🔐 Secure API with JWT
* 🛍 Category-based filtering and dynamic product loading
* 🧠 Smart cart initialization and real-time updates
* ⚙️ Admin CRUD management
* 🎯 Production-grade folder structure and modularity

---

## 🧩 Future Enhancements

* 📦 Order management system
* ❤️ Wishlist feature
* 💬 Review & rating system
* 🧾 Invoice generation
* 📱 PWA support for mobile shopping

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.
