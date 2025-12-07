/**
 * XHETON QUICK REFERENCE GUIDE
 * Version: 0.0.001
 */

// ============================================
// DEVELOPMENT COMMANDS
// ============================================

// Start development server
// npm run dev

// Build for production
// npm run build

// Start production server
// npm run start

// ============================================
// PROJECT STRUCTURE
// ============================================

/*
src/
├── app/                    # Next.js App Router
│   ├── page.js            # Landing page (/)
│   ├── layout.js          # Root layout
│   ├── globals.css        # Global styles
│   ├── dashboard/         # /dashboard
│   ├── sales/             # /sales
│   ├── inventory/         # /inventory
│   ├── purchases/         # /purchases
│   ├── pos/               # /pos
│   ├── warehouse/         # /warehouse
│   ├── expenses/          # /expenses
│   ├── analytics/         # /analytics
│   ├── settings/          # /settings
│   └── menu/              # /menu (mobile)
├── components/
│   ├── ui/                # ShadCN components
│   ├── DashboardLayout.jsx
│   ├── LandingPage.jsx
│   └── XhetonLogo.jsx
└── lib/
    ├── utils.js           # Utility functions
    ├── store.js           # Zustand store
    └── constants.js       # App constants
*/

// ============================================
// KEY FILES
// ============================================

// version.json - Version tracking
// package.json - Dependencies
// README.md - Documentation
// SETUP_SUMMARY.md - Setup details

// ============================================
// ROUTES
// ============================================

export const ROUTES = {
  LANDING: '/',
  DASHBOARD: '/dashboard',
  SALES: '/sales',
  INVENTORY: '/inventory',
  PURCHASES: '/purchases',
  POS: '/pos',
  WAREHOUSE: '/warehouse',
  EXPENSES: '/expenses',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
  MENU: '/menu',
};

// ============================================
// STYLING UTILITIES
// ============================================

export const STYLES = {
  // Containers
  container: 'xheton-container',
  page: 'xheton-page',
  
  // Cards
  card: 'xheton-card',
  
  // Typography
  heading: 'xheton-heading',
  subheading: 'xheton-subheading',
  text: 'xheton-text',
  
  // Components
  button: 'xheton-button',
  input: 'xheton-input',
  tableRow: 'xheton-table-row',
  
  // Layout
  centered: 'xheton-centered',
};

// ============================================
// COLOR PALETTE
// ============================================

export const COLORS = {
  primary: {
    emerald: {
      50: '#f0fdf4',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
    }
  },
  status: {
    success: 'emerald',
    warning: 'amber',
    error: 'red',
    info: 'blue',
  }
};

// ============================================
// TESTING CHECKLIST
// ============================================

export const TESTING_CHECKLIST = [
  '✓ Landing page loads',
  '✓ Dashboard displays KPIs',
  '✓ All navigation links work',
  '✓ Mobile navigation appears on small screens',
  '✓ Desktop sidebar works',
  '✓ Charts render correctly',
  '✓ Tables display data',
  '✓ Animations are smooth',
  '✓ Dark mode (if enabled)',
  '✓ Responsive at all breakpoints',
];

// ============================================
// TIPS & BEST PRACTICES
// ============================================

/*
1. Always use xheton-* utility classes for consistency
2. Test on mobile (375px) and desktop (1920px)
3. Keep animations subtle and professional
4. Maintain proper spacing (p-4, p-6, p-8)
5. Use semantic HTML elements
6. Ensure accessibility (ARIA labels, keyboard nav)
7. Keep components small and reusable
8. Follow the established color system
9. Update version.json on each change
10. Document new features
*/

// ============================================
// COMMON PATTERNS
// ============================================

// Page Layout Pattern
/*
import DashboardLayout from '@/components/DashboardLayout';

export default function YourPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <h1 className="xheton-heading">Your Title</h1>
        {/* Your content *\/}
      </div>
    </DashboardLayout>
  );
}
*/

// Card Pattern
/*
<Card className="hover:shadow-xl transition-all">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content *\/}
  </CardContent>
</Card>
*/

// Table Pattern
/*
<Table>
  <TableHeader>
    <TableRow className="hover:bg-transparent">
      <TableHead className="font-semibold">Column</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow className="xheton-table-row">
      <TableCell>Data</TableCell>
    </TableRow>
  </TableBody>
</Table>
*/

// ============================================
// DEPLOYMENT
// ============================================

/*
When ready to deploy:

1. Build the project:
   npm run build

2. Test the production build:
   npm run start

3. Deploy to Vercel (recommended):
   - Connect GitHub repository
   - Vercel auto-deploys on push

4. Or deploy to other platforms:
   - Netlify
   - Railway
   - AWS
   - Your own server
*/

// ============================================
// SUPPORT
// ============================================

export const SUPPORT = {
  documentation: 'See README.md and SETUP_SUMMARY.md',
  issues: 'Check for errors in browser console',
  server: 'npm run dev to restart',
  styles: 'Clear browser cache if styles don\'t update',
};

// ============================================
// VERSION HISTORY
// ============================================

export const VERSION_HISTORY = [
  {
    version: '0.0.001',
    date: '2025-12-06',
    changes: [
      'Initial setup complete',
      'All pages created',
      'Navigation implemented',
      'Design system established',
      'Mobile responsive',
      'Dark mode support',
    ]
  }
];
