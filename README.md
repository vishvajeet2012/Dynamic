# Dynamic Store

A full-stack **MERN e-commerce store** where the storefront is driven from an admin panel: logo, banners, categories, sub-categories, child categories, products and the About page are all managed from the dashboard instead of being hard-coded.

**Live demo:** [dynamicvstore.vercel.app](https://dynamicvstore.vercel.app)

## Features

**Shop**
- Home page built from admin-managed banners, category banners, promotional banners and new arrivals
- Category → sub-category → child-category browsing, product search and filters
- Product detail pages by slug, wishlist and cart with quantity updates
- Checkout with **Stripe** payment intents, order placement and a thank-you page
- Sign-up with **email OTP verification**, resend OTP and forgot password

**Admin**
- Protected admin routes
- Create, update and delete categories, sub-categories, child categories, banners and products
- Multiple image uploads to **Cloudinary**
- Order list, order details and order status updates

**Backend**
- REST API with Express and MongoDB (Mongoose)
- JWT authentication, bcrypt password hashing
- Rate limiting with `express-rate-limit` and in-memory caching with `node-cache`
- Emails via Nodemailer

## Tech stack

| Layer | Tools |
|---|---|
| Frontend | React (Vite), Redux Toolkit, React Router, Tailwind CSS, MUI, Stripe.js |
| Backend | Node.js, Express, MongoDB, Mongoose, JWT, Multer, Cloudinary, Stripe, Nodemailer |
| Deploy | Vercel (client and server) |

## Project structure

```text
client/   React + Vite storefront and admin panel
server/   Express REST API (routes, controllers, models, middleware)
```

## Getting started

```bash
git clone https://github.com/vishvajeet2012/Dynamic.git
cd Dynamic

# API
cd server
npm install
npm run dev

# Storefront (in a second terminal)
cd client
npm install
npm run dev
```

`server/.env` needs: `MONGODB_URL`, `JWT_KEY`, `PORT_NO`, `EMAIL_SERVICE`, `EMAIL_USER`, `EMAIL_PASSWORD`, `CLOUND_NAME`, `CLOUD_API_KEY`, `CLOUD_SECRET`, `STRIPE_SECRET_KEY`.
`client/.env` needs: `VITE_STRIPE_PUBLISHABLE_KEY`.

## Author

Built by [Vishvajeet Shukla](https://www.vishvajeetshukla.in).
