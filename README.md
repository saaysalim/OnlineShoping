# 🛍️ Online Shopping Management System

A modern, full-stack e-commerce platform built with React, TypeScript, and Supabase. Features a complete shopping experience with admin management, payment processing, and order tracking.

[![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-purple?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## Model-Driven Design (DDD)

This repository now includes a domain model and subdomain classification for the Online Shop:

- Full model document: [`docs/DOMAIN_MODEL.md`](docs/DOMAIN_MODEL.md)

### Subdomains

- `Core`: Checkout and Order Lifecycle, Payment Orchestration and Reconciliation
- `Supporting`: Product Catalog Management, Customer Shopping Experience, Review Management, Admin Operations
- `Generic`: Authentication and Session, Notification/Email Dispatch, File/Media Storage, UI Component Framework

The model includes bounded contexts, aggregates, value objects, domain services, context relationships, and invariants.

## ✨ Features

### 🛒 Customer Features
- **Product Browsing**: Browse products by category with search functionality
- **Shopping Cart**: Add, remove, and update product quantities
- **Multiple Payment Methods**: 
  - Credit/Debit Cards (Visa, Mastercard)
  - Digital Wallets (Apple Pay, Google Pay)
  - Bank Transfer with automated instructions
- **Order Tracking**: View order history and payment status
- **Product Reviews**: Read and submit product reviews with ratings
- **Responsive Design**: Fully responsive UI for mobile and desktop

### 👨‍💼 Admin Features
- **Product Management**: Add, edit, and manage products with image upload
- **Image Upload**: Direct file upload to Supabase Storage
- **Bank Settings**: Configure bank account details for receiving payments
- **Order Management**: View and manage all orders
- **IBAN Validation**: Automatic validation of bank account numbers
- **Email Notifications**: Automated order confirmation emails

### 🔐 Authentication
- Demo login system with admin/user roles
- Admin credentials: `admin` / `admin123`
- Protected admin routes and features

### 💳 Payment Processing
- Card payment simulation
- Bank transfer with payment reference generation
- Order status tracking (pending/paid)
- Payment confirmation emails via Mailgun
- Fallback email storage in database

## 🚀 Tech Stack

### Frontend
- **React 18.3.1** - UI library
- **TypeScript 5.6.2** - Type safety
- **Vite 6.3.5** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Headless UI components
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Storage for images
  - Authentication (ready for expansion)
- **Hono** - Edge server framework

### Payment & Validation
- **IBAN Validation** - Custom implementation
- **Mailgun** - Email service integration

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for backend)

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/saaysalim/OnlineShoping.git
cd OnlineShoping
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Supabase**

Create a Supabase project at [supabase.com](https://supabase.com) and set up:

- Create a table named `kv_store_f3a661bc`:
```sql
CREATE TABLE kv_store_f3a661bc (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);
```

- Create a storage bucket named `pictures` for product images

- Update `src/utils/supabase/info.tsx` with your credentials:
```typescript
export const projectId = 'your-project-id'
export const publicAnonKey = 'your-anon-key'
```

4. **Configure environment variables** (optional for email)

Create a `.env` file in the Supabase function directory:
```env
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_domain
MAIL_FROM=noreply@yourdomain.com
```

5. **Start the development server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### For Customers

1. **Browse Products**: View available products on the home page
2. **Search & Filter**: Use the search bar or category tabs
3. **Add to Cart**: Click "Add to Cart" on any product
4. **Checkout**: 
   - Fill in billing information
   - Select payment method
   - Complete purchase
5. **View Orders**: Check order history in the Orders panel

### For Admins

1. **Login**: Click "Login" and use admin credentials (`admin` / `admin123`)
2. **Add Products**:
   - Click "Add New Product"
   - Fill in product details
   - Upload an image or provide URL
   - Set category and price
3. **Configure Bank**:
   - Click "Bank Settings"
   - Enter account details with IBAN
   - Save configuration
4. **Manage Orders**: 
   - View all orders in Orders Panel
   - Mark bank transfers as paid

## 📁 Project Structure

```
online-shopping-management-system/
├── src/
│   ├── components/
│   │   ├── AdminPanel.tsx          # Product & bank management
│   │   ├── CheckoutPage.tsx        # Checkout & payment flow
│   │   ├── ProductCard.tsx         # Product display card
│   │   ├── ProductDetails.tsx      # Product detail modal
│   │   ├── ShoppingCart.tsx        # Cart sidebar
│   │   ├── LoginModal.tsx          # Authentication modal
│   │   ├── BankSettings.tsx        # Bank configuration
│   │   ├── OrdersPanel.tsx         # Order management
│   │   ├── IntroPage.tsx           # About page
│   │   └── ui/                     # Reusable UI components
│   ├── utils/
│   │   ├── iban.ts                 # IBAN validation
│   │   ├── images.ts               # Image upload helper
│   │   └── supabase/
│   │       └── info.tsx            # Supabase config
│   ├── supabase/
│   │   └── functions/
│   │       └── server/
│   │           ├── index.tsx       # API endpoints
│   │           └── kv_store.tsx    # Database helpers
│   ├── styles/
│   │   └── globals.css             # Global styles
│   ├── types/
│   │   └── alias-modules.d.ts      # TypeScript declarations
│   ├── App.tsx                     # Main application
│   └── main.tsx                    # Entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🔧 Configuration

### Payment Methods

The application supports:
- **Card Payments**: Demo implementation (no actual charges)
- **Bank Transfer**: Real bank account configuration with IBAN validation

### Email Configuration

Two modes available:
1. **Mailgun Integration**: Set environment variables for automated emails
2. **Fallback Mode**: Emails stored in database for manual processing

### Local Storage Keys

- `osm_user`: Current user session
- `osm_bank`: Bank account configuration
- `osm_orders`: Local order cache

## 🎨 Customization

### Styling
- Modify `src/styles/globals.css` for global styles
- Update theme colors in CSS variables
- Customize component styles directly

### Features
- Add new payment methods in `CheckoutPage.tsx`
- Extend product schema in type definitions
- Add custom validation rules

## 🚧 Development

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Type Checking
```bash
npx tsc --noEmit
```

## 📝 API Endpoints

### Products
- `POST /make-server-f3a661bc/products` - Create product
- `GET /make-server-f3a661bc/products` - List products
- `GET /make-server-f3a661bc/products/:id` - Get product details

### Orders
- `POST /make-server-f3a661bc/orders` - Create order
- `GET /make-server-f3a661bc/orders/:userId` - Get user orders

### Reviews
- `POST /make-server-f3a661bc/reviews` - Submit review

### Images
- `POST /make-server-f3a661bc/images` - Upload image
- `GET /make-server-f3a661bc/images` - List images

### Cart
- `GET /make-server-f3a661bc/cart/:userId` - Get cart
- `POST /make-server-f3a661bc/cart/:userId` - Add to cart
- `PUT /make-server-f3a661bc/cart/:userId/:productId` - Update quantity
- `DELETE /make-server-f3a661bc/cart/:userId/:productId` - Remove item

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Salim Saay** - [GitHub Profile](https://github.com/saaysalim)

## 🙏 Acknowledgments

- Based in Limerick, Ireland
- Next-day delivery service
- Built with modern web technologies
- Designed for scalability and performance

## 📞 Support

For support, email salim.saay@ul.ie or open an issue on GitHub.

## 🗺️ Roadmap

- [ ] Real payment gateway integration (Stripe/PayPal)
- [ ] Advanced product filtering and sorting
- [ ] Wishlist functionality
- [ ] Product recommendations
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Inventory management
- [ ] Shipping integration
- [ ] Customer notifications system
- [ ] Advanced search with Elasticsearch

---

**Made with ❤️ in Limerick, Ireland**


  - To access admin features (add products, set bank account), open the app and click the Login button in the header.
  - For demo purposes the following credentials are available:
    - Admin user: username `admin` password `admin123` (gives `admin` role)
    - Any other username will create a regular user (role `user`).
  - Once signed in as the admin, the **Add New Product** button appears in the header. Click it to open the product dialog and add items.

  Adding new users

  - This demo implements simple client-side authentication for convenience. To create a new user just click `Login`, enter the desired username and a password (not persisted securely in this demo). That will save a demo user in localStorage and sign you in as a `user` role.
  - To create another admin account in this demo, sign in with the admin credentials above and then use your own user management workflow (not included) or modify the demo code to accept additional admin usernames.

  Bank account for receiving payments

  - Admins can set and update the bank account used to receive funds from the **Add New Product** dialog: edit the account name, IBAN and bank name and click `Save`.
  - The bank account data is stored locally in the browser (localStorage) in this demo; replace this with a secure server-side settings store before production.

  If you want, I can: add secure server-side auth (Supabase/Auth0), persist bank account details to the backend, or add a proper user management UI.
#   O n l i n e S h o p i n g 
 
 
