# 🛒 Ecommerce SQA Improvement Project

[Original Repository](https://github.com/Abdelrahman-Aboalkhair/ecommerce) | [Enhanced Repository](https://github.com/Anusan-21/ecommerce-sqa-improvement) | [Internal SQA Report](./Software_Quality_Assurance_and_Testing_7020SCN_Report.docx)

---

## 🚀 Project Overview

This project represents a professionally **quality-assured e-commerce platform** built with:

- **Backend:** TypeScript + Node.js (Express) + Prisma + PostgreSQL + Redis
- **Frontend:** Next.js + Tailwind CSS + Redux Toolkit

The repository was transformed from a zero-test codebase into a **production-ready system** through **automated testing**, **CI/CD pipelines**, and **structured quality assurance practices** based on **ISO/IEC 25010** and **McCall’s Quality Models**.

---

## ✨ Features

### **1. Authentication & RBAC**
- Multi-tier roles: **User**, **Admin**, **SuperAdmin**
- JWT-based access and refresh tokens with secure cookies
- Role hierarchy prevents privilege escalation

### **2. Catalog & Inventory**
- Manage products, categories, and attributes
- Product variants (size, color, etc.) with unique SKUs
- Real-time stock monitoring dashboard

### **3. Shopping & Checkout**
- Persistent cart for guest and authenticated users
- Add/remove items and update quantities
- View order history
- Order lifecycle: Pending → Shipped → Delivered → Returned

### **4. Admin Dashboard**
- Users, Orders, Products, Inventory, Transactions, Logs, Reports
- Interactive charts with Recharts
- Analytics APIs with REST & GraphQL, Redis caching

### **5. DevOps & SQA**
- Dockerized backend and database (PostgreSQL + Redis)
- Automated unit, integration, and E2E tests
- CI/CD pipelines via GitHub Actions

---

## 🛠️ Tech Stack

### Backend & Infrastructure
- Node.js (v20+) + Express.js
- TypeScript (v5.8.3)
- Prisma ORM + PostgreSQL
- Redis + BullMQ
- tsyringe Dependency Injection

### Frontend
- Next.js (LTS)
- TypeScript + Zod validation
- Redux Toolkit + Tailwind CSS + Framer Motion
- Recharts for data visualization

---

## 🔧 Installation & Setup

### **1. Prerequisites**
- Node.js v20+ ([Download](https://nodejs.org/))
- Docker Desktop (for database & Redis isolation)
- Optional: VS Code with extensions for TypeScript, Prisma, Tailwind CSS

### **2. Clone Repository**
```bash
git clone https://github.com/Anusan-21/ecommerce-sqa-improvement.git
cd ecommerce-sqa-improvement

### **Docker Setup (Recommended)**
# Start services
docker compose up --build

# Run migrations
docker compose exec server npx prisma migrate dev



# Seed database
docker compose exec server npm run seed

# Run Migrations
cd src/server
npx prisma migrate dev

# Start Services
# Backend (Terminal 1)
npm run dev

# Frontend (Terminal 2)
cd ../client
npm run dev


