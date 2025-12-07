'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  LayoutDashboard, ShoppingCart, Package, ShoppingBag, 
  CreditCard, Warehouse, Receipt, TrendingUp, Settings,
  ChevronRight
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, description: 'Overview & analytics' },
  { name: 'Sales', href: '/sales', icon: ShoppingCart, description: 'Invoices & customers' },
  { name: 'Inventory', href: '/inventory', icon: Package, description: 'Stock management' },
  { name: 'Purchases', href: '/purchases', icon: ShoppingBag, description: 'Orders & suppliers' },
  { name: 'POS', href: '/pos', icon: CreditCard, description: 'Point of sale' },
  { name: 'Warehouse', href: '/warehouse', icon: Warehouse, description: 'Locations & bins' },
  { name: 'Expenses', href: '/expenses', icon: Receipt, description: 'Track expenses' },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp, description: 'Business insights' },
  { name: 'Settings', href: '/settings', icon: Settings, description: 'Configuration' },
];

export default function MenuPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Menu
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Access all features and modules
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={item.href}>
                  <Card className="p-6 hover:shadow-xl transition-all border-2 hover:border-emerald-500 dark:hover:border-emerald-400 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
