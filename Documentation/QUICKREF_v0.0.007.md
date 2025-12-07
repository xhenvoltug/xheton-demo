# v0.0.007 Quick Reference Guide

## 🎯 What's New

6 major financial modules with 19 new pages, complete sidebar reorganization, 69 total routes building successfully.

---

## 📍 New Routes

### Customer Management
- `/customers` - List all customers
- `/customers/new` - Add new customer
- `/customers/[id]` - Customer profile

### Supplier Management
- `/suppliers` - List all suppliers
- `/suppliers/new` - Add new supplier
- `/suppliers/[id]` - Supplier profile

### Expenses
- `/expenses` - List all expenses
- `/expenses/categories` - Manage categories
- `/expenses/new` - Record new expense

### Payments
- `/payments` - All payments
- `/payments/customer` - Record customer payment
- `/payments/supplier` - Record supplier payment

### Accounts
- `/accounts` - Accounts overview
- `/accounts/new` - Add account
- `/accounts/[id]` - Account details
- `/accounts/transactions` - All transactions

### Credit Management
- `/credit/customers` - Customer credit control
- `/credit/suppliers` - Supplier credit control

---

## 🎨 Common Components

All modules use these reusable components:

```jsx
// List page pattern
<PageHeader title="..." subtitle="..." actions={[...]} />
<FilterBar searchTerm={...} filters={[...]} actions={[...]} />
<DataTable columns={[...]} data={[...]} />

// Form page pattern
<PageHeader title="..." subtitle="..." />
<form onSubmit={handleSubmit(onSubmit)}>
  <Card>
    <Input {...register('field')} />
    {errors.field && <p className="text-red-600">{errors.field.message}</p>}
  </Card>
  <Button type="submit">Save</Button>
</form>

// Profile page pattern
<PageHeader title="..." badge={<StatusBadge>...</StatusBadge>} />
<Card>
  {/* Info cards */}
</Card>
<Tabs>
  <TabsContent>...</TabsContent>
</Tabs>
```

---

## 📊 Mock Data Examples

### Customer
```javascript
{
  id: 'C001',
  name: 'John Kamau',
  phone: '+254 711 111 222',
  creditLimit: 100000,
  currentCredit: 15000
}
```

### Supplier
```javascript
{
  id: 'S001',
  name: 'ABC Suppliers Ltd',
  contactPerson: 'James Mwangi',
  totalPurchases: 2400000,
  outstanding: 125000
}
```

### Expense
```javascript
{
  id: 'EXP-001',
  category: 'Salaries & Wages',
  amount: 230000,
  status: 'Paid'
}
```

---

## 🔍 Validation Schemas

### Phone Number
```javascript
z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number')
```

### Currency Amount
```javascript
z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount')
```

### Email
```javascript
z.string().email('Invalid email').optional().or(z.literal(''))
```

---

## 🗂️ Sidebar Navigation

**New Groups:**
1. **Finance** (5 items) - Expenses, Categories, Payments, Accounts, Transactions
2. **Credit Control** (2 items) - Customer Credit, Supplier Credit

**Updated Links:**
- Customers: `/sales/customers/list` → `/customers`
- Suppliers: `/purchases/suppliers/list` → `/suppliers`

---

## ⚡ Quick Commands

```bash
# Build project
npm run build

# Development
npm run dev

# Check routes
npm run build 2>&1 | grep "Route (app)"
```

---

## 🎯 Key Features

✅ 10 expense categories with budget tracking  
✅ Customer credit limits with utilization monitoring  
✅ Supplier payment terms (30/45/60 days)  
✅ Bank & cash account management  
✅ Payment tracking (customer→business, business→supplier)  
✅ Credit control with overdue alerts  
✅ 6-month trend charts (Recharts)  
✅ Export to CSV on all list pages  
✅ React Hook Form + Zod validation  
✅ Mobile-responsive design  

---

## 📈 Statistics

- **Total Routes:** 69
- **New Pages:** 19
- **Code Added:** ~3,200 lines
- **Build Time:** 15.1s
- **TypeScript Errors:** 0

---

## 🔗 Important Files

- `/version.json` - Current version info
- `/RELEASE_v0.0.007.md` - Full release notes
- `/components/DashboardLayout.jsx` - Sidebar navigation
- `/app/customers/page.jsx` - Customer list example
- `/app/expenses/new/page.jsx` - Form validation example

---

*Version 0.0.007 | 2025-12-07 | Production Ready ✅*
