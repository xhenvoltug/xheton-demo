# XHETON Sales & Inventory System

## Version 0.0.003

**The Future of Sales, Inventory, and Business Automation**

Built by Xhenvolt Technologies | Powered by Next.js 16

---

## 🚀 Overview

XHETON is a next-generation business management platform that combines sales, inventory, procurement, point-of-sale, warehouse management, expense tracking, and AI-powered analytics in one unified system.

**Why XHETON?**
- 🎯 Modern architecture built with Next.js 16, React 19, and Tailwind CSS v4
- 🎨 Beautiful, future-ready UI with ShadCN/UI and Framer Motion
- 📊 Advanced analytics with Recharts and AI forecasting
- 📱 Mobile-first design with responsive layouts
- ⚡ Lightning-fast performance and smooth animations
- 🌙 Full dark mode support
- 🔒 Enterprise-grade security features

---

## 🎨 Tech Stack

### Core Framework
- **Next.js 16** - App Router, Server Components
- **React 19** - Latest React features
- **Tailwind CSS v4** - Modern utility-first styling

### UI Components
- **ShadCN/UI** - Accessible, customizable components
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons

### Data Visualization
- **Recharts** - Interactive charts and graphs

### State Management
- **Zustand** - Lightweight state management
- **TanStack React Query** - Server state management

### Forms & Validation
- **React Hook Form** - Performant forms
- **Zod** - TypeScript-first schema validation

---

## 🚀 Getting Started

### Installation

1. Install dependencies
```bash
npm install
```

2. Run the development server
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

---

## 📦 Modules

### ✅ MODULE A — SALES (Complete)

**Sales Management**
- `/sales/list` - Sales list with advanced filtering and search
- `/sales/new` - Create new sales with dynamic line items
- `/sales/pos` - Touch-friendly POS interface with cart management

**Customer Management**
- `/sales/customers/list` - Customer database with search
- `/sales/customers/new` - Add new customers with full contact details
- `/sales/customers/[id]` - Customer profile with purchase history

**Invoice Management**
- `/sales/invoices/list` - Invoice list with status tracking
- `/sales/invoices/[id]` - Detailed invoice view with PDF-ready layout

**Features:**
- Dynamic product search with autocomplete
- Real-time cart calculations (subtotal, tax, discounts)
- Payment method selection (Cash, Card, Mobile Money, Bank Transfer)
- Customer purchase history tracking
- Outstanding balance management
- Mobile-responsive tables and cards
- Smooth Framer Motion transitions

---

### ✅ MODULE B — INVENTORY (Complete)

**Product Management**
- `/inventory/products/list` - Product catalog with filters
- `/inventory/products/new` - Add products with detailed specifications
- `/inventory/products/[id]` - Product details with stock by warehouse

**Category Management**
- `/inventory/categories/list` - Organize products into categories
- Quick create/edit dialog for categories

**Stock Adjustments**
- `/inventory/adjustments/list` - View all stock adjustments
- `/inventory/adjustments/new` - Create adjustments with reason tracking

**Warehouse Transfers**
- `/inventory/transfers/list` - Track transfers between locations
- `/inventory/transfers/new` - Create multi-item transfers

**Batch & Serial Tracking**
- `/inventory/batches/list` - Track product batches and expiry dates
- `/inventory/batches/[id]` - Batch details with movement history

**Features:**
- Low stock alerts and indicators
- Multi-warehouse stock tracking
- Batch/serial number management
- Expiry date tracking
- Stock movement history
- Profit margin calculations
- Barcode support
- Product dimensions and weight tracking

---

## 🎨 Shared Components

**DataTable** - Advanced table with sorting, selection, and variants
**PageHeader** - Consistent headers with title, subtitle, and actions
**FilterBar** - Search and filter controls with mobile sheet
**FormCard** - Structured form sections with descriptions
**StatCard** - KPI cards with icons and trend indicators
**ConfirmDialog** - Modal confirmations with variants
**MobileCard** - Stacked card view for mobile tables

**Animation Features:**
- Staggered list animations
- Fade + slide page transitions
- Scale effects on modals
- Smooth hover interactions
- Touch-optimized micro-interactions

---

## 📱 Responsive Design

**Mobile Optimization:**
- POS interface optimized for tablets and touch screens
- Tables convert to stacked cards on mobile
- Filter sheets for better mobile UX
- Sticky totals sidebar on mobile POS
- Bottom navigation for quick access
- Optimized tap targets (44px minimum)

**Desktop Experience:**
- Multi-column layouts
- Sidebar navigation
- Advanced filtering
- Data-dense tables
- Keyboard shortcuts ready

---

## 🌙 Dark Mode

Full dark mode support across all modules:
- Automatic theme switching
- Gradient backgrounds adapt to theme
- Chart colors optimized for both themes
- Proper contrast ratios
- Consistent UI element styling

---

## 📊 Features Implemented

- ✅ **Sales Module** - Complete with POS, invoices, and customers
- ✅ **Inventory Module** - Products, categories, adjustments, transfers, batches
- ✅ **Shared Components** - 7 reusable components with animations
- ✅ **Mobile Responsive** - All pages work perfectly on mobile
- ✅ **Dark/Light Themes** - Seamless theme switching
- ✅ **Form Validation** - Toast notifications for user feedback
- ✅ **Smooth Animations** - Framer Motion throughout

---

## 🔮 Coming Soon

- 🔄 **Purchases Module** - Supplier management and purchase orders
- 🏭 **Warehouse Module** - Multi-location inventory management
- 💰 **Expenses Module** - Cost tracking and reporting
- 📈 **Analytics Module** - Advanced reporting and insights
- ⚙️ **Settings Module** - System configuration
- 🔐 **Authentication** - User login and permissions

---

**Built with ❤️ by Xhenvolt Technologies**

*Engineering the future of business management*
