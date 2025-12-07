'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/shared/StatCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, DollarSign, Package, Receipt, Users, MapPin, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const mockBranch = {
  id: 'B001',
  name: 'Main Branch',
  location: 'Nairobi CBD',
  address: '123 Business Park, Upper Hill, Nairobi',
  phone: '+254 700 111 222',
  email: 'main@xheton.com',
  manager: 'John Kamau',
  status: 'Active',
  sales: 'UGX 2,400,000',
  inventory: 'UGX 890,000',
  expenses: 'UGX 145,000'
};

const mockUsers = [
  { id: 1, name: 'John Kamau', role: 'Branch Manager', avatar: null, email: 'john@xheton.com', status: 'Active' },
  { id: 2, name: 'Alice Muthoni', role: 'Sales Associate', avatar: null, email: 'alice@xheton.com', status: 'Active' },
  { id: 3, name: 'David Omondi', role: 'Inventory Clerk', avatar: null, email: 'david@xheton.com', status: 'Active' },
  { id: 4, name: 'Grace Njeri', role: 'Cashier', avatar: null, email: 'grace@xheton.com', status: 'Active' },
];

export default function BranchDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title={mockBranch.name}
          subtitle={`Branch ID: ${mockBranch.id}`}
          badge={
            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              {mockBranch.status}
            </Badge>
          }
          actions={[
            <Button key="edit" variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>,
            <Button key="delete" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          ]}
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              icon={DollarSign}
              label="Total Sales (MTD)"
              value={mockBranch.sales}
              trend={{ value: 12.5, isPositive: true }}
              iconColor="emerald"
            />
            <StatCard
              icon={Package}
              label="Inventory Value"
              value={mockBranch.inventory}
              trend={{ value: 5.2, isPositive: true }}
              iconColor="blue"
            />
            <StatCard
              icon={Receipt}
              label="Expenses (MTD)"
              value={mockBranch.expenses}
              trend={{ value: 3.1, isPositive: false }}
              iconColor="amber"
            />
          </motion.div>

          {/* Branch Info */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 bg-white dark:bg-gray-900/50">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Branch Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</p>
                      <p className="text-gray-900 dark:text-white">{mockBranch.location}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{mockBranch.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
                      <p className="text-gray-900 dark:text-white">{mockBranch.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                      <p className="text-gray-900 dark:text-white">{mockBranch.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Manager</p>
                      <p className="text-gray-900 dark:text-white">{mockBranch.manager}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Users */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 bg-white dark:bg-gray-900/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Branch Users</h3>
                <Button size="sm" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400">{user.email}</TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            {user.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
