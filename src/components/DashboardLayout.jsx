'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, ShoppingCart, Package, ShoppingBag, 
  CreditCard, Warehouse, Receipt, TrendingUp, Settings,
  Menu, X, Bell, Search, User, ChevronDown, ChevronRight, Home,
  Users, FileText, PackageCheck, Truck, MapPin, TrendingDown, Box,
  Building2, Shield, UserCog, Percent, BellRing, Plug,
  DollarSign, UserCheck, Wallet, AlertCircle, Calendar, Briefcase,
  ClipboardList, BarChart3, UserCircle, Clock, Banknote, Factory,
  Wrench, Phone, Tag, Target, MessageSquare, Megaphone, Mail, Phone as PhoneIcon,
  Activity, Monitor, AlertTriangle, Zap, FolderOpen, HelpCircle, Eye, BookOpen,
  Cpu, CreditCard as CardIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import XhetonLogo from '@/components/XhetonLogo';

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: LayoutDashboard,
    standalone: true 
  },
  {
    name: 'Sales',
    icon: ShoppingCart,
    group: true,
    defaultOpen: false,
    items: [
      { name: 'Sales List', href: '/sales/list', icon: FileText },
      { name: 'Point of Sale', href: '/sales/pos', icon: CreditCard },
      { name: 'Customers', href: '/customers', icon: Users },
      { name: 'Invoices', href: '/sales/invoices/list', icon: FileText },
    ]
  },
  {
    name: 'Purchases',
    icon: ShoppingBag,
    group: true,
    defaultOpen: false,
    items: [
      { name: 'Purchase Orders', href: '/purchases/orders', icon: ShoppingBag },
      { name: 'Supplier Invoices', href: '/purchases/invoices', icon: FileText },
      { name: 'Goods Received (GRN)', href: '/purchases/grn', icon: PackageCheck },
      { name: 'Suppliers', href: '/suppliers', icon: Users },
    ]
  },
  {
    name: 'Inventory',
    icon: Package,
    group: true,
    defaultOpen: false,
    items: [
      { name: 'Products', href: '/inventory/products/list', icon: Package },
      { name: 'Categories', href: '/inventory/categories/list', icon: Box },
      { name: 'Stock Movements', href: '/inventory/movements', icon: TrendingDown },
      { name: 'Warehouses', href: '/warehouses', icon: Warehouse },
      { name: 'Price History', href: '/products/price-history', icon: TrendingUp },
      { name: 'Batches', href: '/inventory/batches/list', icon: PackageCheck },
    ]
  },
  {
    name: 'Manufacturing',
    icon: Factory,
    group: true,
    defaultOpen: false,
    items: [
      { name: 'Bill of Materials', href: '/manufacturing/bom', icon: FileText },
      { name: 'Manufacturing Orders', href: '/manufacturing/orders', icon: Factory },
      { name: 'Work Orders', href: '/manufacturing/work-orders', icon: ClipboardList },
      { name: 'Production Planning', href: '/manufacturing/planning', icon: Calendar },
      { name: 'Machines & Work Centers', href: '/manufacturing/machines', icon: Wrench },
    ]
  },
  {
    name: 'CRM',
    icon: Users,
    group: true,
    defaultOpen: false,
    items: [
      { name: 'Leads', href: '/crm/leads', icon: Tag },
      { name: 'Opportunities', href: '/crm/opportunities', icon: Target },
      { name: 'Activities', href: '/crm/activities', icon: Phone },
      { name: 'Lead Sources', href: '/crm/sources', icon: TrendingUp },
    ]
  },
  {
    name: 'Asset Management',
    icon: Package,
    group: true,
    defaultOpen: false,
    items: [
      { name: 'Asset Register', href: '/assets/register', icon: Package },
      { name: 'Depreciation', href: '/assets/depreciation', icon: TrendingDown },
      { name: 'Maintenance', href: '/assets/maintenance', icon: Wrench },
      { name: 'Disposal & Write-Off', href: '/assets/disposal', icon: AlertCircle },
      { name: 'Asset Transfers', href: '/assets/transfers', icon: Truck },
    ]
  },
  {
    name: 'Finance',
    icon: DollarSign,
    group: true,
    defaultOpen: false,
    items: [
      { name: 'Expenses', href: '/expenses', icon: Receipt },
      { name: 'Expense Categories', href: '/expenses/categories', icon: Box },
      { name: 'Payments', href: '/payments', icon: CreditCard },
      { name: 'Bank & Cash Accounts', href: '/accounts', icon: Wallet },
      { name: 'All Transactions', href: '/accounts/transactions', icon: FileText },
    ]
  },
  {
    name: 'Credit Control',
    icon: AlertCircle,
    group: true,
    defaultOpen: false,
    items: [
      { name: 'Customer Credit', href: '/credit/customers', icon: UserCheck },
      { name: 'Supplier Credit', href: '/credit/suppliers', icon: Users },
    ]
  },
  {
    name: 'Warehouse',
    icon: Warehouse,
    group: true,
    defaultOpen: false,
    items: [
      { name: 'Locations', href: '/warehouse/locations/list', icon: MapPin },
      { name: 'Stock Movement', href: '/warehouse/stock-movement/list', icon: TrendingUp },
      { name: 'Bin Management', href: '/warehouse/bins/list', icon: Box },
    ]
  },
  {
    name: 'Project Management',
    icon: Briefcase,
    group: true,
    defaultOpen: false,
    items: [
      { name: 'Dashboard', href: '/projects/dashboard', icon: LayoutDashboard },
      { name: 'Projects', href: '/projects/dashboard', icon: Briefcase },
      { name: 'Tasks', href: '/projects/tasks', icon: ClipboardList },
      { name: 'Gantt Chart', href: '/projects/gantt', icon: Calendar },
      { name: 'Reports', href: '/projects/reports', icon: BarChart3 },
    ]
  },
  {
    name: 'Budgeting',
    icon: DollarSign,
    group: true,
    defaultOpen: false,
    items: [
      { name: 'Overview', href: '/budgeting/overview', icon: LayoutDashboard },
      { name: 'Planner', href: '/budgeting/planner', icon: Calendar },
      { name: 'Expenses', href: '/budgeting/expenses', icon: Receipt },
      { name: 'Payments', href: '/budgeting/payments', icon: CreditCard },
      { name: 'Reports', href: '/budgeting/reports', icon: BarChart3 },
    ]
  },
  {
    name: 'Human Resource Management',
    icon: Users,
    group: true,
    defaultOpen: false,
    items: [
      { name: 'Dashboard', href: '/hr/dashboard', icon: LayoutDashboard },
      { name: 'Employees', href: '/hr/employees', icon: UserCircle },
      { name: 'Attendance', href: '/hr/attendance', icon: Clock },
      { name: 'Leave', href: '/hr/leave', icon: Calendar },
    ]
  },
  {
    name: 'Payroll & Compensation',
    icon: Banknote,
    group: true,
    defaultOpen: false,
    items: [
      { name: 'Dashboard', href: '/payroll/dashboard', icon: LayoutDashboard },
      { name: 'Salary Structure', href: '/payroll/structure', icon: Building2 },
      { name: 'Payroll Processing', href: '/payroll/processing', icon: ClipboardList },
      { name: 'Payslips', href: '/payroll/payslips', icon: FileText },
      { name: 'Statutory Compliance', href: '/payroll/compliance', icon: Shield },
    ]
  },
  {
    name: 'Supplier Management',
    icon: Users,
    group: true,
    defaultOpen: false,
    items: [
      { name: 'Dashboard', href: '/suppliers/dashboard', icon: LayoutDashboard },
      { name: 'Supplier Directory', href: '/suppliers/directory', icon: Users },
      { name: 'Evaluations', href: '/suppliers/evaluations', icon: BarChart3 },
    ]
  },
  {
    name: 'Procurement & Purchasing',
    icon: ShoppingBag,
    group: true,
    defaultOpen: false,
    items: [
      { name: 'Dashboard', href: '/procurement/dashboard', icon: LayoutDashboard },
      { name: 'RFQs', href: '/procurement/rfq', icon: FileText },
      { name: 'Purchase Orders', href: '/procurement/po', icon: ShoppingCart },
      { name: 'Goods Receiving', href: '/procurement/grn', icon: PackageCheck },
      { name: 'Supplier Invoices', href: '/procurement/invoices', icon: Receipt },
    ]
  },
  {
    name: 'Point of Sale',
    icon: CreditCard,
    group: true,
    defaultOpen: false,
    items: [
      { name: 'Dashboard', href: '/pos/dashboard', icon: LayoutDashboard },
      { name: 'Sale', href: '/pos/sale', icon: ShoppingCart },
      { name: 'Cash Register', href: '/pos/cash-register', icon: DollarSign },
      { name: 'Returns & Refunds', href: '/pos/returns', icon: TrendingDown },
    ]
  },
  {
    name: 'Accounting',
    icon: Banknote,
    group: true,
    defaultOpen: false,
    items: [
      { name: 'Chart of Accounts', href: '/accounting/coa', icon: FileText },
      { name: 'Journals', href: '/accounting/journals', icon: FileText },
      { name: 'Financial Statements', href: '/accounting/statements', icon: BarChart3 },
    ]
  },
  {
    name: 'Delivery & Logistics',
    icon: Truck,
    group: true,
    defaultOpen: false,
    items: [
      { name: 'Dashboard', href: '/delivery/dashboard', icon: LayoutDashboard },
      { name: 'Delivery Orders', href: '/delivery/orders', icon: ClipboardList },
      { name: 'Create Delivery', href: '/delivery/create', icon: PackageCheck },
      { name: 'Track Delivery', href: '/delivery/tracking', icon: MapPin },
      { name: 'Delivery Receipt', href: '/delivery/receipt', icon: FileText },
    ]
  },
  {
    name: 'Analytics',
    icon: TrendingUp,
    group: true,
    defaultOpen: false,
    items: [
      { name: 'Dashboard', href: '/analytics/dashboard', icon: LayoutDashboard },
      { name: 'Forecast', href: '/analytics/forecast', icon: TrendingUp },
    ]
  },
  {
    name: 'Audit & Monitoring',
    icon: Shield,
    group: true,
    defaultOpen: false,
    items: [
      { name: 'Activity Logs', href: '/audit/logs', icon: Activity },
      { name: 'User Sessions', href: '/audit/sessions', icon: Monitor },
      { name: 'System Events', href: '/audit/events', icon: Clock },
      { name: 'Security Alerts', href: '/audit/security', icon: AlertTriangle },
    ]
  },
  {
    name: 'Membership',
    icon: Users,
    group: true,
    defaultOpen: false,
    items: [
      { name: 'Member Directory', href: '/membership/directory', icon: Users },
      { name: 'Membership Plans', href: '/membership/plans', icon: Package },
      { name: 'Billing Cycles', href: '/membership/billing', icon: Calendar },
      { name: 'Member Wallet', href: '/membership/wallet', icon: Wallet },
      { name: 'Analytics', href: '/membership/analytics', icon: BarChart3 },
    ]
  },
  {
    name: 'Communication',
    icon: MessageSquare,
    group: true,
    defaultOpen: false,
    items: [
      { name: 'Internal Chat', href: '/communication/chat', icon: MessageSquare },
      { name: 'Announcements', href: '/communication/announcements', icon: Megaphone },
      { name: 'Internal Email', href: '/communication/email', icon: Mail },
      { name: 'Contacts', href: '/communication/contacts', icon: Users },
    ]
  },
  {
    name: 'Automation',
    icon: Zap,
    group: true,
    defaultOpen: false,
    items: [
      { name: 'Dashboard', href: '/automation/dashboard', icon: LayoutDashboard },
      { name: 'Workflow Builder', href: '/automation/builder', icon: Zap },
      { name: 'Trigger Logs', href: '/automation/logs', icon: Activity },
      { name: 'Templates', href: '/automation/templates', icon: FileText },
    ]
  },
  {
    name: 'Documents',
    icon: FolderOpen,
    group: true,
    defaultOpen: false,
    items: [
      { name: 'Document Library', href: '/documents/library', icon: FolderOpen },
      { name: 'Document Viewer', href: '/documents/viewer', icon: Eye },
      { name: 'Permissions', href: '/documents/permissions', icon: Shield },
      { name: 'Activity Audit', href: '/documents/audit', icon: Activity },
    ]
  },
  {
    name: 'Support',
    icon: HelpCircle,
    group: true,
    defaultOpen: false,
    items: [
      { name: 'Tickets', href: '/support/tickets', icon: MessageSquare },
      { name: 'Ticket Details', href: '/support/ticket-details', icon: FileText },
      { name: 'Help Center', href: '/support/help-center', icon: BookOpen },
      { name: 'Analytics', href: '/support/analytics', icon: BarChart3 },
    ]
  },
  {
    name: 'Communications',
    icon: Bell,
    group: true,
    defaultOpen: false,
    items: [
      { name: 'Notification Center', href: '/notifications', icon: Bell },
      { name: 'Notification Settings', href: '/notifications/settings', icon: BellRing },
      { name: 'Messages', href: '/messages', icon: MessageSquare },
    ]
  },
  {
    name: 'Monitoring',
    icon: Activity,
    group: true,
    defaultOpen: false,
    items: [
      { name: 'Audit Logs', href: '/audit/logs', icon: FileText },
      { name: 'Session Monitor', href: '/audit/session-monitor', icon: Monitor },
      { name: 'System Health', href: '/audit/system-health', icon: Cpu },
    ]
  },
  {
    name: 'Billing',
    icon: CardIcon,
    group: true,
    defaultOpen: false,
    items: [
      { name: 'Subscription Overview', href: '/billing/overview', icon: LayoutDashboard },
      { name: 'Plans (UGX)', href: '/billing/plans', icon: Package },
      { name: 'Payment Methods', href: '/billing/payment-methods', icon: CreditCard },
      { name: 'Invoices', href: '/billing/invoices', icon: FileText },
      { name: 'Usage', href: '/billing/usage', icon: BarChart3 },
    ]
  },
  {
    name: 'Settings',
    icon: Settings,
    group: true,
    defaultOpen: false,
    items: [
      { name: 'Business Info', href: '/settings/business-info', icon: Building2 },
      { name: 'Branches', href: '/settings/branches/list', icon: MapPin },
      { name: 'Roles', href: '/settings/roles/list', icon: Shield },
      { name: 'Permissions', href: '/settings/permissions/matrix', icon: Shield },
      { name: 'Users', href: '/settings/users/list', icon: UserCog },
      { name: 'Taxes', href: '/settings/taxes', icon: Percent },
      { name: 'Notifications', href: '/settings/notifications', icon: BellRing },
      { name: 'Integrations', href: '/settings/integrations', icon: Plug },
    ]
  },
];

const mobileNavigation = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Sales', href: '/sales/list', icon: ShoppingCart },
  { name: 'Inventory', href: '/inventory/products/list', icon: Package },
  { name: 'More', href: '/menu', icon: Menu },
];

function NavGroup({ item, pathname, isOpen, onToggle }) {
  const Icon = item.icon;
  const hasActiveChild = item.items?.some(child => pathname.startsWith(child.href));

  return (
    <div>
      <button
        onClick={onToggle}
        className={`
          w-full group flex items-center justify-between gap-x-3 rounded-xl px-4 py-3 text-sm font-semibold leading-6 
          transition-all duration-200
          ${hasActiveChild
            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }
        `}
      >
        <div className="flex items-center gap-x-3">
          <Icon className={`h-5 w-5 shrink-0 ${hasActiveChild ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`} />
          {item.name}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="ml-8 mt-1 space-y-1">
              {item.items.map((subItem) => {
                const SubIcon = subItem.icon;
                const isActive = pathname === subItem.href || pathname.startsWith(subItem.href);
                return (
                  <Link
                    key={subItem.name}
                    href={subItem.href}
                    className={`
                      group flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium
                      transition-all duration-200
                      ${isActive 
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }
                    `}
                  >
                    <SubIcon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    {subItem.name}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openGroup, setOpenGroup] = useState(null);
  const pathname = usePathname();

  const handleGroupToggle = (groupName) => {
    setOpenGroup(openGroup === groupName ? null : groupName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-emerald-50 via-slate-50 to-gray-100 dark:bg-gradient-to-bl dark:from-gray-950 dark:via-black dark:to-emerald-900">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: 0 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ duration: 0.3 }}
        className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col z-50"
      >
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 px-6 pb-4 shadow-xl">
          <div className="flex h-20 shrink-0 items-center space-x-3 border-b border-gray-200 dark:border-gray-800">
            <XhetonLogo className="w-10 h-10" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                XHETON
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">v0.0.011</p>
            </div>
          </div>
          
          <nav className="flex flex-1 flex-col space-y-2">
            {navigation.map((item) => {
              if (item.group) {
                return (
                  <NavGroup 
                    key={item.name} 
                    item={item} 
                    pathname={pathname} 
                    isOpen={openGroup === item.name}
                    onToggle={() => handleGroupToggle(item.name)}
                  />
                );
              }

              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center gap-x-3 rounded-xl px-4 py-3 text-sm font-semibold leading-6 
                    transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </motion.aside>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-2xl">
        <div className="flex justify-around items-center h-16 px-2">
          {mobileNavigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors
                  ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}
                `}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Navigation */}
        <div className="sticky top-0 z-40 flex h-20 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="hidden lg:block p-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2.5 text-gray-700 dark:text-gray-300"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Search */}
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1 items-center max-w-md">
              <Search className="pointer-events-none absolute left-3 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-10 w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            <button
              type="button"
              className="relative p-2.5 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
            >
              <Bell className="h-6 w-6" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500"></span>
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-x-2 text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatar.png" />
                    <AvatarFallback className="bg-emerald-600 text-white">AD</AvatarFallback>
                  </Avatar>
                  <span className="hidden lg:block">Admin User</span>
                  <ChevronDown className="h-4 w-4 hidden lg:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Keyboard shortcuts</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Page Content */}
        <main className="py-8 pb-24 lg:pb-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
