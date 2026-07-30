# 🛒 E-Commerce Store

A full-stack e-commerce web application built with **Node.js**, **Express 5**, and **MongoDB**. Features a complete shopping experience including user authentication, product management, cart & checkout with **Stripe** payments, PDF invoice generation, and transactional emails via **SendGrid**.

---

## ✨ Features

### 🛍️ Shop
- Browse products with **paginated** listings
- View detailed product pages
- Add / remove items from cart
- **Stripe Checkout** integration for secure payments
- Order history with downloadable **PDF invoices**

### 🔐 Authentication
- Email & password signup with **bcrypt** hashing
- Login with session-based authentication (MongoDB-backed sessions)
- Password reset flow via **email tokens** (SendGrid)
- **CSRF protection** using the double-submit cookie pattern (`csrf-csrf`)
- Input validation & sanitization (`express-validator`)

### 🛠️ Admin Panel
- Create, edit, and delete products (restricted to the product owner)
- Image uploads stored on **Cloudinary**
- Server-side validation for all product fields

### 🔒 Security & Performance
- **Helmet** for secure HTTP headers (CSP, etc.)
- **Compression** for gzip response bodies
- **Morgan** request logging to `access.log`
- Environment-based configuration via **dotenv**

---

## 🏗️ Tech Stack

| Layer          | Technology                                          |
| -------------- | --------------------------------------------------- |
| Runtime        | Node.js `20.x`                                      |
| Framework      | Express `5.x`                                       |
| Database       | MongoDB Atlas (via Mongoose `8.x`)                  |
| Templating     | EJS                                                 |
| Authentication | express-session + connect-mongodb-session + bcryptjs |
| Payments       | Stripe Checkout                                     |
| File Uploads   | Multer + Cloudinary                                 |
| Emails         | Nodemailer + SendGrid                               |
| PDF Generation | PDFKit                                              |
| Security       | Helmet, csrf-csrf, express-validator                |

---

## 📁 Project Structure

```
E-commerce/
├── app.js                  # Application entry point & middleware setup
├── package.json
├── .env.example            # Template for environment variables
├── .gitignore
│
├── controllers/
│   ├── admin.js            # Product CRUD (admin)
│   ├── auth.js             # Signup, login, logout, password reset
│   ├── error.js            # 404 & 500 error handlers
│   └── shop.js             # Product listing, cart, checkout, orders, invoices
│
├── middleware/
│   └── is-auth.js          # Route-level authentication guard
│
├── models/
│   ├── product.js          # Product schema (title, price, description, image, userId)
│   ├── user.js             # User schema with cart methods (addToCart, removeFromCart, clearCart)
│   └── orders.js           # Order schema (products, user reference)
│
├── routes/
│   ├── admin.js            # /admin/* routes with validation
│   ├── auth.js             # /login, /signup, /logout, /reset routes
│   └── shop.js             # /, /products, /cart, /checkout, /orders routes
│
├── views/
│   ├── admin/              # Add/edit product forms, product list
│   ├── auth/               # Login, signup, password reset pages
│   ├── shop/               # Index, product list, product detail, cart, checkout, orders
│   ├── includes/           # Shared EJS partials (head, nav, footer, etc.)
│   ├── 404.ejs
│   └── 500.ejs
│
├── public/
│   ├── css/                # Stylesheets
│   └── js/                 # Client-side JavaScript
│
├── util/
│   ├── file.js             # File utility helpers
│   └── path.js             # Root directory helper
│
├── data/                   # Generated data (invoices, etc.)
└── images/                 # Local image directory (legacy)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `v20.x` or higher
- **npm** `v9+`
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- A [Stripe](https://stripe.com/) account (test keys)
- A [Cloudinary](https://cloudinary.com/) account
- A [SendGrid](https://sendgrid.com/) account & API key

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd E-commerce

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
# Then fill in your credentials (see Environment Variables below)

# 4. Start the development server
npm run start:dev
```

The app will be available at **http://localhost:3000**.

---

## ⚙️ Environment Variables

Create a `.env` file in the project root (use `.env.example` as a template):

| Variable                   | Description                                          |
| -------------------------- | ---------------------------------------------------- |
| `MONGO_USER`               | MongoDB Atlas username                               |
| `MONGO_PASSWORD`           | MongoDB Atlas password                               |
| `MONGO_DEFAULT_DATABASE`   | Database name (default: `shop`)                      |
| `STRIPE_KEY`               | Stripe secret key (`sk_test_...` or `sk_live_...`)   |
| `SENDGRID_API_KEY`         | SendGrid API key for transactional emails            |
| `SESSION_SECRET`           | Random 64-char hex string for session encryption     |
| `CSRF_SECRET`              | Random 64-char hex string for CSRF token generation  |
| `NODE_ENV`                 | `development` or `production`                        |
| `PORT`                     | Server port (default: `3000`)                        |
| `CLOUDINARY_CLOUD_NAME`    | Cloudinary cloud name                                |
| `CLOUDINARY_API_KEY`       | Cloudinary API key                                   |
| `CLOUDINARY_API_SECRET`    | Cloudinary API secret                                |

> **Tip:** Generate secure secrets with:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

---

## 🔌 API Routes

### Shop Routes

| Method | Route                      | Auth | Description                      |
| ------ | -------------------------- | ---- | -------------------------------- |
| GET    | `/`                        | No   | Home page (paginated products)   |
| GET    | `/products`                | No   | Product listing (paginated)      |
| GET    | `/products/:productId`     | No   | Product detail page              |
| GET    | `/cart`                    | Yes  | View cart                        |
| POST   | `/cart`                    | Yes  | Add product to cart              |
| POST   | `/cart-delete-item`        | Yes  | Remove product from cart         |
| GET    | `/checkout`                | Yes  | Initiate Stripe Checkout         |
| GET    | `/checkout/success`        | Yes  | Post-payment order confirmation  |
| GET    | `/checkout/cancel`         | Yes  | Payment cancelled, return to cart|
| GET    | `/orders`                  | Yes  | View order history               |
| GET    | `/orders/:orderId`         | Yes  | Download PDF invoice             |

### Admin Routes (`/admin`)

| Method | Route                              | Auth | Description           |
| ------ | ---------------------------------- | ---- | --------------------- |
| GET    | `/admin/add-product`               | Yes  | Add product form      |
| POST   | `/admin/add-product`               | Yes  | Create new product    |
| GET    | `/admin/products`                  | Yes  | List admin's products |
| GET    | `/admin/edit-product/:productId`   | Yes  | Edit product form     |
| POST   | `/admin/edit-product`              | Yes  | Update product        |
| DELETE | `/admin/product/:productId`        | Yes  | Delete product        |

### Auth Routes

| Method | Route              | Description                    |
| ------ | ------------------ | ------------------------------ |
| GET    | `/login`           | Login page                     |
| POST   | `/login`           | Authenticate user              |
| GET    | `/signup`          | Signup page                    |
| POST   | `/signup`          | Register new user              |
| POST   | `/logout`          | End session                    |
| GET    | `/reset`           | Password reset request page    |
| POST   | `/reset`           | Send reset email               |
| GET    | `/reset/:token`    | New password form (from email) |
| POST   | `/new-password`    | Save new password              |

---

## 📜 Available Scripts

| Command            | Description                                   |
| ------------------ | --------------------------------------------- |
| `npm start`        | Start the production server (`node app.js`)   |
| `npm run start:dev`| Start with auto-reload (`nodemon app.js`)     |

---

## 📄 License

ISC
