# XHETON Developer Quick Start Guide

## 🚀 Running the Application

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev

# Open in browser
http://localhost:3000
```

---

## 📂 Project Structure

```
xheton/
├── src/
│   ├── app/                    # Next.js 16 App Router
│   │   ├── sales/             # Sales module (8 pages)
│   │   ├── inventory/         # Inventory module (10 pages)
│   │   ├── dashboard/         # Main dashboard
│   │   ├── pricing/           # Pricing page
│   │   ├── layout.js          # Root layout
│   │   ├── page.js            # Landing page
│   │   └── globals.css        # Global styles
│   │
│   ├── components/
│   │   ├── shared/            # Reusable components (7 files)
│   │   ├── ui/                # ShadCN components
│   │   ├── DashboardLayout.jsx
│   │   ├── LandingPage.jsx
│   │   └── XhetonLogo.jsx
│   │
│   └── lib/
│       ├── store.js           # Zustand state
│       ├── constants.js       # App constants
│       └── utils.js           # Utility functions
│
├── public/
│   └── favicon.svg
│
├── version.json               # Version tracking
├── README.md                  # Project documentation
└── MODULES_SUMMARY.md        # Detailed module docs
```

---

## 🎨 Using Shared Components

### DataTable

```jsx
import DataTable from '@/components/shared/DataTable';

const columns = [
  {
    header: 'Name',
    accessor: 'name',
    render: (row) => <span>{row.name}</span>
  }
];

<DataTable 
  columns={columns} 
  data={myData}
  selectable={true}
  selectedRows={selected}
  onSelectRow={handleSelect}
  variant="compact" // or "default" or "comfortable"
/>
```

### PageHeader

```jsx
import PageHeader from '@/components/shared/PageHeader';

<PageHeader
  title="Page Title"
  subtitle="Description text"
  actions={[
    <Button key="action">Action</Button>
  ]}
/>
```

### FilterBar

```jsx
import FilterBar from '@/components/shared/FilterBar';

const filters = [
  {
    label: 'Status',
    value: statusFilter,
    options: [
      { label: 'Active', value: 'active' }
    ],
    onChange: setStatusFilter
  }
];

<FilterBar
  searchValue={search}
  onSearchChange={setSearch}
  filters={filters}
  onClearFilters={() => {}}
/>
```

### FormCard

```jsx
import FormCard from '@/components/shared/FormCard';

<FormCard 
  title="Section Title"
  description="Section description"
  footer={<Button>Save</Button>}
>
  {/* Form content */}
</FormCard>
```

### StatCard

```jsx
import StatCard from '@/components/shared/StatCard';
import { DollarSign } from 'lucide-react';

<StatCard
  title="Revenue"
  value="$12,450"
  change={{ value: 12.5, isPositive: true }}
  icon={DollarSign}
/>
```

### MobileCard

```jsx
import MobileCard from '@/components/shared/MobileCard';

<MobileCard
  onClick={() => router.push('/detail')}
  data={[
    { label: 'ID', value: 'INV-001' },
    { label: 'Amount', value: '$1,299' }
  ]}
/>
```

---

## 🎭 Animations with Framer Motion

### Page Transition

```jsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
>
  {/* Content */}
</motion.div>
```

### Staggered List

```jsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.03 }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

<motion.div variants={container} initial="hidden" animate="show">
  {items.map(item => (
    <motion.div key={item.id} variants={item}>
      {/* Item content */}
    </motion.div>
  ))}
</motion.div>
```

### Modal Scale

```jsx
<motion.div
  initial={{ scale: 0.9, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  exit={{ scale: 0.9, opacity: 0 }}
>
  {/* Modal content */}
</motion.div>
```

---

## 📱 Responsive Patterns

### Table to Card on Mobile

```jsx
{/* Desktop */}
<div className="hidden md:block">
  <DataTable columns={columns} data={data} />
</div>

{/* Mobile */}
<div className="md:hidden space-y-3">
  {data.map(item => (
    <MobileCard key={item.id} data={[...]} />
  ))}
</div>
```

### Responsive Grid

```jsx
{/* 1 col mobile, 2 tablet, 4 desktop */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Cards */}
</div>
```

---

## 🎨 Styling Guidelines

### Custom Classes (globals.css)

```css
.xheton-page          /* Standard page wrapper */
.xheton-card          /* Standard card styling */
.xheton-container     /* Container with max-width */
.xheton-heading       /* Heading with gradient */
.xheton-button        /* Gradient button */
.xheton-table-row     /* Animated table row */
```

### Color Classes

```jsx
// Emerald (Primary)
bg-emerald-600        text-emerald-600
bg-emerald-100        dark:bg-emerald-900/30

// Status Colors
bg-emerald-100        // Success/Active/Paid
bg-yellow-100         // Warning/Pending
bg-red-100           // Danger/Overdue
bg-blue-100          // Info/In Progress
bg-gray-100          // Neutral/Inactive
```

---

## 🔄 State Management

### Local State (Forms)

```jsx
const [formData, setFormData] = useState({
  name: '',
  email: ''
});

const handleChange = (field, value) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};
```

### Zustand Global State

```jsx
import { useStore } from '@/lib/store';

const { user, theme, toggleTheme } = useStore();
```

---

## 🍞 Toast Notifications

```jsx
import toast from 'react-hot-toast';

toast.success('Operation successful!');
toast.error('Something went wrong');
toast.loading('Processing...');
```

---

## 🧭 Navigation

### Programmatic Navigation

```jsx
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push('/sales/list');
```

### Link Component

```jsx
import Link from 'next/link';

<Link href="/sales/list">View Sales</Link>
```

---

## 📋 Form Patterns

### Select Dropdown

```jsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Input with Label

```jsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

<div>
  <Label htmlFor="name">Name</Label>
  <Input
    id="name"
    type="text"
    value={name}
    onChange={(e) => setName(e.target.value)}
    className="mt-2"
  />
</div>
```

---

## 🎯 Common Patterns

### List Page Pattern

```jsx
export default function ListPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  
  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader title="Title" actions={[...]} />
        <FilterBar {...filterProps} />
        <DataTable columns={columns} data={data} />
      </div>
    </DashboardLayout>
  );
}
```

### Form Page Pattern

```jsx
export default function FormPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({});
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate
    // Save
    toast.success('Saved!');
    router.push('/list');
  };
  
  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader title="New Item" />
        <form onSubmit={handleSubmit}>
          <FormCard title="Details">
            {/* Fields */}
          </FormCard>
          <Button type="submit">Save</Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
```

### Detail Page Pattern

```jsx
export default function DetailPage({ params }) {
  const { id } = use(params);
  
  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader title={item.name} actions={[...]} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>{/* Details */}</Card>
          <Card>{/* History */}</Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
```

---

## 🛠️ Troubleshooting

### Component Not Found
```bash
# Make sure path alias is correct
import Component from '@/components/shared/Component';
```

### Dark Mode Not Working
```jsx
// Check parent has dark class
<html className={theme === 'dark' ? 'dark' : ''}>
```

### Animation Not Smooth
```jsx
// Ensure Framer Motion variants are correct
// Check transition settings
transition={{ type: 'spring', duration: 0.3 }}
```

---

## 📦 Adding New Pages

1. Create file in `/src/app/module/page.jsx`
2. Import `DashboardLayout` and shared components
3. Use consistent patterns (PageHeader, etc.)
4. Add to navigation in `constants.js`
5. Test mobile responsiveness
6. Add animations

---

## 🎨 Design Checklist

- ✅ PageHeader with title and actions
- ✅ Proper spacing (mb-6, mb-8)
- ✅ Rounded corners (rounded-xl)
- ✅ Shadows (shadow-sm, shadow-lg)
- ✅ Animations (Framer Motion)
- ✅ Mobile cards for tables
- ✅ Dark mode colors
- ✅ Consistent button styles
- ✅ Form validation
- ✅ Toast notifications

---

**Happy Coding! 🚀**

For questions or issues, refer to:
- `README.md` - Overview and features
- `MODULES_SUMMARY.md` - Detailed module docs
- ShadCN docs: https://ui.shadcn.com
- Framer Motion docs: https://www.framer.com/motion
