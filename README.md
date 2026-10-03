# Krisha Dry Fruits — Premium Cashews Direct From Orchards

A modern, high-performance e-commerce platform and management system designed for **Krisha Dry Fruits**. Featuring premium hand-picked cashew grades, intelligent interactive GPS delivery mapping, and an extensive admin dashboard.

---

## 🌟 Key Features

### 🛒 Customer Storefront
- **Grade & Origin Discovery**: Browse premium cashew grades (W180 Jumbo King, W210 Royal Large, W240 Premium Standard, W320 Classic, W450 Mini Crisp) with detailed size, crunch, and aroma specifications.
- **Dynamic Varieties**: Shop across Raw, Roasted, Roasted & Salted, Fried & Salted, Pepper Spiced, and Honey Glazed styles.
- **Live Cart & Checkout**: Slide-out cart drawer with real-time price updates and quantity selectors.
- **Compulsory GPS Map Pin Delivery**: Interactive Leaflet / Google Maps integration requiring exact GPS coordinate pinning for pinpoint doorstep delivery.
- **Door / Flat Number Separation**: Clean split between flat/house number and geocoded street address to ensure Google Maps navigation never fails.
- **Order Tracking**: Visual 5-stage fulfillment progress tracker with instant receipt confirmation.

### 🛡️ Admin Dashboard (`/admin`)
- **Real-time Analytics**: Live statistics on total revenue, pending orders, shipped parcels, and completed deliveries.
- **Order Dossiers & Navigation**:
  - One-click Google Maps navigation directly to customer coordinates (`maps.google.com/maps?q=${lat},${lng}`).
  - Embedded live interactive Google Maps viewer inside each order.
  - Formatted shipping label copy tool and direct WhatsApp customer chat shortcut.
  - Tracking number updates and fulfillment state management.
- **Product & Grade Management**:
  - Add, edit, or toggle products with custom grades, origins, variety types, and pack weights.
  - Grade auto-fill templates for rapid catalog additions.
- **Direct Cloudinary Image Upload**: Upload product imagery directly from local devices with instant Cloudinary cloud hosting.
- **Live Storefront Content Editor**: Modify hero banners, announcements, contact details, and marketing highlights directly from the admin panel.
- **Multi-Admin Management**: Role-based access control with super-admin permissions and emergency passkey fallback.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, React Leaflet / OpenStreetMap.
- **Backend**: Netlify Serverless Functions (`/api/*` and `/.netlify/functions/*`).
- **Database**: MongoDB Atlas with Mongoose schemas.
- **Authentication**: Clerk React Authentication + Emergency Security Passkey.
- **Media Storage**: Cloudinary v2 Media API.
- **Tooling**: Vite, PostCSS, ESLint, TypeScript compiler.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sanjay-programer/krisha_dry_fruits.git
   cd krisha_dry_fruits
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the project root:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ADMIN_SECRET=your_admin_secret_key
   VITE_ADMIN_PASSKEY=your_admin_secret_key
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```

4. **Run the local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📦 Deployment to Netlify

This project is configured out-of-the-box for Netlify via [`netlify.toml`](./netlify.toml):
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Functions directory**: `netlify/functions`

Ensure all environment variables are added under **Site configuration** → **Environment variables** in your Netlify dashboard.

---

## 📄 License

Private & Proprietary — Krisha Dry Fruits. All rights reserved.
