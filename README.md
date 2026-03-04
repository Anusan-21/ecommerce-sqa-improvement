# need to replace


A modern Single Store Ecommerce platform built with a **TypeScript** backend (Express, Prisma, PostgreSQL, Redis) and a **Next.js** frontend. Features include user authentication, product management, cart, checkout, order processing, analytics, and real-time chat via Socket.IO, WebRTC. The application is fully Dockerized for easy setup and development.

[Demo Video](https://youtu.be/qJDXcQ_sxSI) | [Live Demo](https://ss-ecommerce-one.vercel.app) | [API Documentation](https://ss-ecommerce-one.vercel.app/api-docs)

## 🚀 Quick Start

Get up and running in **5 minutes**:

```bash
# 1. Clone the repository
git clone https://github.com/Abdelrahman-Aboalkhair/ss-ecommerce.git
cd ss-ecommerce

# 2. Set up environment variables
cp server/.env.example server/.env
cp client/.env.example client/.env.local

# 3. Start with Docker (recommended)
docker compose up --build

# 4. Seed the database
cd server && npm run seed

# 5. Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000/api/v1
# API Docs: http://localhost:5000/api-docs
```

**🧪 Test Accounts (After Seeding):**

| Role           | Email                    | Password      | Permissions                           |
| -------------- | ------------------------ | ------------- | ------------------------------------- |
| **Superadmin** | `superadmin@example.com` | `password123` | Full system access, can create admins |
| **Admin**      | `admin@example.com`      | `password123` | Product management, order processing  |
| **User**       | `user@example.com`       | `password123` | Basic shopping, cart, checkout        |

> 💡 **Note**: These accounts are created when you run the database seeder. See [🌱 Seeding the Database](#-seeding-the-database) section for details.

## 📋 Table of Contents

- [🚀 Quick Start](#-quick-start)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [⚙️ Prerequisites](#️-prerequisites)
- [🔧 Installation](#-installation)
  - [🐳 Docker Setup](#-docker-setup)
  - [💻 Non-Docker Setup](#-non-docker-setup)
- [🏃‍♂️ Running the Application](#️-running-the-application)
- [🌱 Seeding the Database](#-seeding-the-database)
- [📚 API Documentation](#-api-documentation)
- [🧪 Testing](#-testing)
- [🚀 Deployment](#-deployment)
- [🔒 Security Considerations](#-security-considerations)
- [⚡ Performance & Optimization](#-performance--optimization)
- [🐛 Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## ✨ Features

### **1. User Authentication & Authorization**

#### 🔄 Authentication Flow

```
[App Starts]
    |
    v
GET /me (with cookie)
    |
+--> 200 OK => set user in Redux => Auth ready
    |
+--> 401 Unauthorized
    |
    v
POST /refresh (cookie-based)
    |
+--> 200 OK => new token => retry /me => set user
    |
+--> 401 => logout
```

- **🔐 Sign‑up / Sign‑in** — Email & password, social login (Facebook, Google, Twitter, Apple)
- **📧 Email Verification & Password Reset** — `/auth/verify-email`, `/auth/password-reset/[token]` flows
- **👥 Role‑Based Access Control** — User, Admin, Superadmin roles enforced via `authorizeRole` middleware
- **🚫 Error Pages** — Custom `forbidden`, `unauthorized` and error boundary components

### **2. Product & Catalog Management**

- **🔄 CRUD Operations** — Products, Categories, Attributes, Sections, Variants
- **🎨 Variant System** — Combine attributes (size, color, material, etc.) into SKU variants
- **🖼️ Image Galleries & Uploads** — Cloudinary integration for product images, sliders, assets
- **🔍 Filtering & Browsing** — CategoryBrowser, ProductFilters, DependentDropdown components

### **3. Shopping Cart & Checkout**

- **🛒 Persistent Cart** — Guest + authenticated carts with quantity management (`QuantitySelector`)
- **💳 Stripe Integration** — Checkout pages with success, failure, and cancel callbacks

### **4. Order & Shipment Workflow**

- **📦 Order Lifecycle** — Pending → Shipped → Delivered → Returned statuses
- **🚚 Shipment Tracking** — Shipment module with tracking, webhook support for external updates
- **🔗 Webhooks** — `/webhook` endpoint for payment and shipping event handling

### **5. Real‑time Chat & Calls**

- **💬 Socket.IO Chat** — Real‑time customer‑to‑admin messaging, persisted in DB
- **📞 WebRTC Audio/Video** — Call screens, `useWebRTCCall`, `AudioPlayer`, `CallControls`

### **6. Admin Dashboard & Analytics**

- **📊 Modular Dashboard** — Users, Orders, Products, Inventory, Transactions, Logs, Reports sections
- **📈 Interactive Charts** — Area, Bar, Donut, RevenueOverTime (Recharts)
- **🔌 Analytics APIs** — REST v1 & v2, GraphQL v1 & v2, Redis caching

### **7. API Layer & Security**

- **🌐 REST & GraphQL** — Versioned endpoints (`/v1`, `/v2`) with Express and Apollo
- **🔐 JWT Authentication** — `protect` & `optionalAuth` middleware, CORS, input validation
- **📝 Error Handling & Logging** — Centralized `globalError` handler, Winston logs, rate limiting

### **8. DevOps & Deployment**

- **🐳 Docker Compose** — Containerized Next.js (client) & Express (server) services
- **⚡ Hot‑Reload** — Nodemon for server, Fast refresh for client
- **📖 API Documentation** — Swagger UI (`docs/swagger.ts`)

## 📸 Screenshots

### 🏠 Homepage & Authentication

<p float="left">
  <img src="./assets/screenshots/homepage.png" width="300" />
  <img src="./assets/screenshots/sign-in.png" width="300" />
  <img src="./assets/screenshots/sign-up.png" width="300" />
</p>

### 🛒 E-commerce Flow

<p float="left">
  <img src="./assets/screenshots/product_detail.png" width="300" />
  <img src="./assets/screenshots/cart.png" width="300" />
  <img src="./assets/screenshots/payment.png" width="300" />
  <img src="./assets/screenshots/track_your_order.png" width="300" />
  <img src="./assets/screenshots/your_orders.png" width="300" />
</p>

### 📊 Admin Dashboards

<p float="left">
  <img src="./assets/screenshots/dashboard_overview.png" width="300" />
  <img src="./assets/screenshots/products_dashboard.png" width="300" />
  <img src="./assets/screenshots/attributes_dashboard.png" width="300" />
  <img src="./assets/screenshots/inventory_dashboard.png" width="300" />
  <img src="./assets/screenshots/reports_dashboard.png" width="300" />
  <img src="./assets/screenshots/analytics_dashboard.png" width="300" />
  <img src="./assets/screenshots/logs_dashboard.png" width="300" />
</p>

### 💬 Communication & Support

<p float="left">
  <img src="./assets/screenshots/dashboard_chat.png" width="300" />
  <img src="./assets/screenshots/user_chat.png" width="300" />
</p>

## 🛠️ Tech Stack

### **Backend**

- **🟢 Node.js** v22
- **🚀 Express.js** - Web framework
- **📘 TypeScript** - Type safety
- **🗄️ Prisma ORM** - Database toolkit
- **🐘 PostgreSQL** - Primary database
- **🔴 Redis** - Caching & sessions
- **🔌 Socket.IO** - Real-time communication
- **📝 Winston** - Logging
- **☁️ Cloudinary** - Image storage
- **💳 Stripe** - Payment processing

### **Frontend**

- **⚛️ Next.js** - React framework
- **📘 TypeScript** - Type safety
- **🎨 Tailwind CSS** - Styling
- **🔄 Redux Toolkit** - State management
- **📊 Recharts** - Data visualization
- **🎭 Framer Motion** - Animations

### **Infrastructure**

- **🐳 Docker & Docker Compose** - Containerization
- **🌐 WSL2** - Development environment
- **📦 npm** - Package management

## 📁 Project Structure

```
├── client/                          # Next.js frontend
│   ├── app/                        # App router pages
│   │   ├── (auth)/                # Authentication pages
│   │   ├── (private)/             # Protected pages
│   │   ├── (public)/              # Public pages
│   │   ├── components/            # React components
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── lib/                   # Utilities & configs
│   │   ├── store/                 # Redux store
│   │   └── types/                 # TypeScript types
│   ├── public/                    # Static assets
│   └── package.json
├── server/                         # Express.js backend
│   ├── src/
│   │   ├── modules/               # Feature modules
│   │   │   ├── auth/             # Authentication
│   │   │   ├── products/         # Product management
│   │   │   ├── orders/           # Order processing
│   │   │   └── analytics/        # Analytics & reports
│   │   ├── shared/               # Shared utilities
│   │   └── docs/                 # API documentation
│   ├── prisma/                   # Database schema & migrations
│   └── seeds/                    # Database seeding
├── docker-compose.yml            # Docker services
└── collections/                  # Postman collections
```

## ⚙️ Prerequisites

### **Required Software**

- **Node.js** v22 or higher ([Download](https://nodejs.org/))
- **npm** v10 or higher
- **Docker** and **Docker Compose** (for Docker setup) ([Download](https://www.docker.com/))
- **PostgreSQL** v15 and **Redis** v7 (for non-Docker setup)

### **Optional but Recommended**

- **WSL2** (for Windows users)
- **VS Code** with extensions:
  - Prisma
  - TypeScript
  - Docker
  - Tailwind CSS IntelliSense

### **WSL2 Configuration**

For WSL2 users, ensure Docker Desktop is configured with WSL2 integration and `localhostForwarding=true` in `~/.wslconfig`.

## 🔧 Installation

### 🐳 Docker Setup (Recommended)

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Abdelrahman-Aboalkhair/ss-ecommerce.git
   cd ss-ecommerce
   ```

2. **Set Up Environment Variables**:

   ```bash
   cp server/.env.example server/.env
   cp client/.env.example client/.env.local
   ```

3. **Configure Environment Variables**:
   Edit `server/.env` with your credentials:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/ss_ecommerce"

   # Redis
   REDIS_HOST=localhost
   REDIS_PORT=6379

   # JWT Secrets
   JWT_SECRET=your_jwt_secret_here
   REFRESH_TOKEN_SECRET=your_refresh_token_secret_here

   # Session
   SESSION_SECRET=your_session_secret_here
   COOKIE_SECRET=your_cookie_secret_here

   # External Services
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret

   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

   # Social Login (optional)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   FACEBOOK_APP_ID=your_facebook_app_id
   FACEBOOK_APP_SECRET=your_facebook_app_secret
   ```

4. **Build and Start Services**:

   ```bash
   docker compose up --build
   ```

5. **Run Database Migrations**:
   ```bash
   docker compose exec server npx prisma migrate dev
   ```

### 💻 Non-Docker Setup

1. **Install PostgreSQL and Redis**:

   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib redis-server

   # macOS
   brew install postgresql redis

   # Start services
   sudo service postgresql start
   sudo service redis-server start
   ```

2. **Configure PostgreSQL**:

   ```bash
   sudo -u postgres psql
   ```

   ```sql
   CREATE USER your_username WITH PASSWORD 'your_password';
   CREATE DATABASE ss_ecommerce;
   GRANT ALL PRIVILEGES ON DATABASE ss_ecommerce TO your_username;
   \q
   ```

3. **Clone and Install Dependencies**:

   ```bash
   git clone https://github.com/Abdelrahman-Aboalkhair/ss-ecommerce.git
   cd ss-ecommerce

   # Install backend dependencies
   cd server && npm install

   # Install frontend dependencies
   cd ../client && npm install
   ```

4. **Set Up Environment Variables**:
   Follow the same environment variable setup as Docker setup.

5. **Run Database Migrations**:
   ```bash
   cd server
   npx prisma migrate dev
   ```

## 🏃‍♂️ Running the Application

### 🐳 Docker

```bash
# Start all services
docker compose up

# Start in background
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

**Access URLs:**

- 🌐 **Frontend**: http://localhost:3000
- 🔌 **Backend API**: http://localhost:5000/api/v1
- 📖 **Swagger Docs**: http://localhost:5000/api-docs
- 🎯 **GraphQL**: http://localhost:5000/api/v1/graphql

### 💻 Non-Docker

1. **Start Backend**:

   ```bash
   cd server
   npm run dev
   ```

2. **Start Frontend** (in new terminal):

   ```bash
   cd client
   npm run dev
   ```

3. **Access URLs** (same as Docker setup)

## 🌱 Seeding the Database

Populate the database with test data for development and testing:

```bash
# Navigate to server directory
cd server

# Run seeding script
npm run seed
```

**🧪 Seeded Test Data:**

### **User Accounts**

- **Superadmin**: `superadmin@example.com` / `password123`
- **Admin**: `admin@example.com` / `password123`
- **User**: `user@example.com` / `password123`

### **Product Data**

- **Category**: Electronics
- **Product**: Smartphone X
- **Variant**: SMART-X-001 ($599.99, 50 in stock)

### **Role Permissions**

| Role           | Can Access                  | Can Manage                     |
| -------------- | --------------------------- | ------------------------------ |
| **Superadmin** | Everything                  | Users, Admins, System Settings |
| **Admin**      | Products, Orders, Analytics | Products, Categories, Orders   |
| **User**       | Shopping, Cart, Checkout    | Own Profile, Orders            |

**🔄 Re-seeding:**

- The seeder uses `upsert` operations, so it's safe to run multiple times
- Running the seeder will clean up existing data and create fresh test data

**📊 Verify Seeding:**

```bash
# Check seeded data in database
psql -h localhost -p 5432 -U your_username -d ss_ecommerce

# Verify users
SELECT email, role FROM "User";

# Verify products
SELECT name, slug FROM "Product";
```

## 📚 API Documentation

### **Swagger UI**

- **URL**: http://localhost:5000/api-docs
- **Features**: Interactive API documentation, test endpoints directly

### **GraphQL Playground**

- **URL**: http://localhost:5000/api/v1/graphql
- **Features**: GraphQL schema exploration, query testing

### **API Endpoints Overview**

```
/api/v1/auth/*          # Authentication endpoints
/api/v1/users/*         # User management
/api/v1/products/*      # Product catalog
/api/v1/cart/*          # Shopping cart
/api/v1/orders/*        # Order management
/api/v1/analytics/*     # Analytics & reports
/api/v1/webhooks/*      # Webhook handlers
```

## 🧪 Testing

### **🧪 Testing with Seeded Accounts**

After running the database seeder, you can test different user roles and permissions:

#### **1. Superadmin Testing**

```bash
# Login as Superadmin
Email: superadmin@example.com
Password: password123

# Test Features:
- Create new admin users
- Access all system settings
- Manage all users and products
- View analytics and reports
```

#### **2. Admin Testing**

```bash
# Login as Admin
Email: admin@example.com
Password: password123

# Test Features:
- Manage products and categories
- Process orders
- View order analytics
- Cannot create other admins
```

#### **3. User Testing**

```bash
# Login as User
Email: user@example.com
Password: password123

# Test Features:
- Browse products
- Add items to cart
- Complete checkout process
- View order history
- Update profile
```

### **🔍 Testing Different Scenarios**

1. **Role-Based Access Control**:

   - Try accessing admin features as a regular user
   - Test admin creation (only superadmin can do this)
   - Verify user permissions are enforced

2. **Product Management**:

   - Add/edit products as admin
   - Browse products as user
   - Test product filtering and search

3. **Order Processing**:
   - Create orders as user
   - Process orders as admin
   - Test order status updates

### **API Testing with Postman**

1. **Import Collections**:

   - Navigate to `/collections` folder
   - Import `.json` collection files into Postman

2. **Set Environment Variables**:

   ```json
   {
     "baseUrl": "http://localhost:5000/api/v1",
     "token": "your_jwt_token_here"
   }
   ```

3. **Test Authentication Flow**:
   - Sign in with test accounts
   - Use returned tokens in subsequent requests
   - Test protected endpoints with different roles

### **Running Automated Tests**

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

## 🚀 Deployment

### **Production Checklist**

1. **Environment Variables**:

   - Update all environment variables for production
   - Use strong, unique secrets
   - Configure production database URLs

2. **Database Setup**:

   - Use managed PostgreSQL (e.g., Neon, Supabase)
   - Use managed Redis (e.g., Upstash, Redis Cloud)
   - Run migrations: `npx prisma migrate deploy`

3. **External Services**:

   - **Stripe**: Configure webhook endpoints and secrets
   - **Cloudinary**: Set up production cloud
   - **Social Login**: Update redirect URLs for production domains

4. **Deployment Platforms**:
   - **Frontend**: Vercel, Netlify, or AWS Amplify
   - **Backend**: AWS ECS, Heroku, Render, or DigitalOcean
   - **Database**: Managed PostgreSQL service
   - **Redis**: Managed Redis service

### **Environment-Specific Configuration**

**Development**:

```env
NODE_ENV=development
DATABASE_URL=postgresql://localhost:5432/ss_ecommerce_dev
```

**Production**:

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@prod-db-host:5432/ss_ecommerce_prod
```

## 🔒 Security Considerations

### **Authentication & Authorization**

- ✅ JWT tokens with short expiration
- ✅ Refresh tokens in httpOnly cookies
- ✅ Role-based access control
- ✅ Input validation and sanitization
- ✅ Rate limiting on auth endpoints

### **Data Protection**

- ✅ HTTPS enforcement in production
- ✅ Secure cookie settings
- ✅ SQL injection prevention (Prisma ORM)
- ✅ XSS protection
- ✅ CSRF protection

### **API Security**

- ✅ CORS configuration
- ✅ Request size limits
- ✅ Error message sanitization
- ✅ API rate limiting
- ✅ Request logging

### **Best Practices**

- 🔒 Use environment variables for secrets
- 🔒 Regular dependency updates
- 🔒 Database connection pooling
- 🔒 Input validation on all endpoints
- 🔒 Proper error handling

## ⚡ Performance & Optimization

### **Frontend Optimizations**

- 🚀 Next.js App Router for better performance
- 🖼️ Image optimization with Next.js Image component
- 📦 Code splitting and lazy loading
- 🎨 Tailwind CSS for optimized CSS
- 🔄 Redux Toolkit for efficient state management

### **Backend Optimizations**

- 🗄️ Database indexing on frequently queried fields
- 🔴 Redis caching for expensive operations
- 📊 Connection pooling for database
- 🚀 Compression middleware
- 📝 Efficient logging with Winston

### **Database Optimizations**

```sql
-- Example indexes for better performance
CREATE INDEX idx_products_category ON "Product"(categoryId);
CREATE INDEX idx_orders_user ON "Order"(userId);
CREATE INDEX idx_orders_status ON "Order"(status);
```

### **Monitoring & Analytics**

- 📊 Built-in analytics dashboard
- 📈 Performance monitoring
- 🔍 Error tracking
- 📝 Request logging

## 🐛 Troubleshooting

### **Common Issues & Solutions**

#### **1. Database Connection Issues**

```bash
# Check if PostgreSQL is running
sudo service postgresql status

# Check connection
psql -h localhost -U your_username -d ss_ecommerce

# Reset database (if needed)
npx prisma migrate reset
```

#### **2. Redis Connection Issues**

```bash
# Check if Redis is running
redis-cli ping

# Should return: PONG
```

#### **3. Docker Issues**

```bash
# Clean up Docker
docker system prune -a

# Rebuild containers
docker compose down
docker compose up --build
```

#### **4. Port Conflicts**

```bash
# Check what's using port 3000
lsof -i :3000

# Check what's using port 5000
lsof -i :5000
```

#### **5. Environment Variables**

```bash
# Verify environment variables are loaded
cd server
node -e "console.log(process.env.DATABASE_URL)"
```

#### **6. Authentication Issues**

- Check JWT secret configuration
- Verify cookie settings
- Ensure CORS is properly configured
- Check social login redirect URLs

### **Debug Mode**

```bash
# Enable debug logging
DEBUG=* npm run dev

# Check Prisma queries
DEBUG=prisma:* npm run dev
```

### **Getting Help**

1. Check the [Issues](../../issues) page
2. Search existing discussions
3. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Environment details
   - Expected vs actual behavior

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### **Development Workflow**

1. **Fork the Repository**:

   ```bash
   git clone https://github.com/your-username/ss-ecommerce.git
   cd ss-ecommerce
   ```

2. **Create a Feature Branch**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Set Up Development Environment**:

   ```bash
   # Follow installation instructions above
   docker compose up --build
   ```

4. **Make Your Changes**:

   - Follow the existing code style
   - Add tests for new features
   - Update documentation if needed

5. **Test Your Changes**:

   ```bash
   # Backend tests
   cd server && npm test

   # Frontend tests
   cd client && npm test

   # Type checking
   cd client && npm run type-check
   ```

6. **Commit Your Changes**:

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

7. **Push and Create Pull Request**:
   ```bash
   git push origin feature/your-feature-name
   ```

### **Code Style Guidelines**

- **TypeScript**: Use strict mode, avoid `any` types
- **React**: Use functional components with hooks
- **CSS**: Use Tailwind CSS classes
- **Backend**: Follow Express.js best practices
- **Database**: Use Prisma migrations for schema changes

### **Good First Issues**

Looking for a place to start? Check out these labels:

- `good first issue` - Perfect for newcomers
- `documentation` - Help improve docs
- `bug` - Fix existing issues
- `enhancement` - Add new features

### **Reporting Issues**

When reporting issues, please include:

- **Description**: What happened?
- **Steps**: How to reproduce?
- **Expected**: What should happen?
- **Actual**: What actually happened?
- **Environment**: OS, browser, Node.js version
- **Screenshots**: If applicable

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Next.js** team for the amazing React framework
- **Prisma** team for the excellent ORM
- **Tailwind CSS** for the utility-first CSS framework
- **Stripe** for payment processing
- **Cloudinary** for image management

## 📞 Support

- 📧 **Email**: [abdalrahman.aboalkhair.1@gmail.com]
- 💬 **Discussions**: [GitHub Discussions](../../discussions)
- 🐛 **Issues**: [GitHub Issues](../../issues)
- 📖 **Documentation**: [Wiki](../../wiki)

---

**Made with ❤️ by Abdelrahman Aboalkhair**
