'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Save, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const roles = ['Super Admin', 'Branch Manager', 'Sales Associate', 'Inventory Clerk', 'Accountant'];

const permissionMatrix = [
  {
    module: 'Sales',
    actions: ['View', 'Create', 'Edit', 'Delete', 'Export'],
    defaults: {
      'Super Admin': [true, true, true, true, true],
      'Branch Manager': [true, true, true, false, true],
      'Sales Associate': [true, true, true, false, false],
      'Inventory Clerk': [true, false, false, false, false],
      'Accountant': [true, false, false, false, true]
    }
  },
  {
    module: 'Inventory',
    actions: ['View', 'Create', 'Edit', 'Delete', 'Adjust'],
    defaults: {
      'Super Admin': [true, true, true, true, true],
      'Branch Manager': [true, true, true, true, true],
      'Sales Associate': [true, false, false, false, false],
      'Inventory Clerk': [true, true, true, false, true],
      'Accountant': [true, false, false, false, false]
    }
  },
  {
    module: 'Purchases',
    actions: ['View', 'Create', 'Approve', 'Delete'],
    defaults: {
      'Super Admin': [true, true, true, true],
      'Branch Manager': [true, true, true, false],
      'Sales Associate': [false, false, false, false],
      'Inventory Clerk': [true, true, false, false],
      'Accountant': [true, false, true, false]
    }
  },
  {
    module: 'Warehouse',
    actions: ['View', 'Manage Locations', 'Stock Movement', 'Manage Bins'],
    defaults: {
      'Super Admin': [true, true, true, true],
      'Branch Manager': [true, true, true, true],
      'Sales Associate': [true, false, false, false],
      'Inventory Clerk': [true, true, true, true],
      'Accountant': [true, false, false, false]
    }
  },
  {
    module: 'Expenses',
    actions: ['View', 'Create', 'Approve', 'Delete'],
    defaults: {
      'Super Admin': [true, true, true, true],
      'Branch Manager': [true, true, true, false],
      'Sales Associate': [false, false, false, false],
      'Inventory Clerk': [false, false, false, false],
      'Accountant': [true, true, true, false]
    }
  },
  {
    module: 'Analytics',
    actions: ['View Dashboard', 'View Forecast', 'Export Reports'],
    defaults: {
      'Super Admin': [true, true, true],
      'Branch Manager': [true, true, true],
      'Sales Associate': [true, false, false],
      'Inventory Clerk': [true, false, false],
      'Accountant': [true, true, true]
    }
  },
  {
    module: 'Settings',
    actions: ['View', 'Edit', 'Manage Users', 'Manage Roles', 'Manage Branches'],
    defaults: {
      'Super Admin': [true, true, true, true, true],
      'Branch Manager': [true, false, false, false, false],
      'Sales Associate': [false, false, false, false, false],
      'Inventory Clerk': [false, false, false, false, false],
      'Accountant': [true, false, false, false, false]
    }
  }
];

export default function PermissionMatrixPage() {
  const [permissions, setPermissions] = useState(() => {
    const initial = {};
    permissionMatrix.forEach(module => {
      roles.forEach(role => {
        module.actions.forEach((action, idx) => {
          const key = `${module.module}-${role}-${action}`;
          initial[key] = module.defaults[role][idx];
        });
      });
    });
    return initial;
  });

  const togglePermission = (module, role, action) => {
    const key = `${module}-${role}-${action}`;
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    toast.success('Permission matrix saved successfully');
  };

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Permission Matrix"
          subtitle="Comprehensive role-based access control matrix"
          actions={[
            <Button key="export" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Matrix
            </Button>,
            <Button
              key="save"
              onClick={handleSave}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          ]}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-6 bg-white dark:bg-gray-900/50 overflow-x-auto">
            <div className="min-w-[1200px]">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 dark:border-gray-700">
                    <th className="sticky left-0 bg-white dark:bg-gray-900 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white border-r dark:border-gray-700">
                      Module / Action
                    </th>
                    {roles.map((role) => (
                      <th key={role} className="px-4 py-3 text-center">
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                          {role}
                        </Badge>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {permissionMatrix.map((module, moduleIdx) => (
                    <>
                      <tr key={module.module} className="bg-gray-50 dark:bg-gray-800/50">
                        <td
                          colSpan={roles.length + 1}
                          className="sticky left-0 px-4 py-2 font-semibold text-gray-900 dark:text-white"
                        >
                          {module.module}
                        </td>
                      </tr>
                      {module.actions.map((action, actionIdx) => (
                        <tr
                          key={`${module.module}-${action}`}
                          className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                        >
                          <td className="sticky left-0 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-600 dark:text-gray-400 border-r dark:border-gray-700">
                            {action}
                          </td>
                          {roles.map((role) => {
                            const key = `${module.module}-${role}-${action}`;
                            return (
                              <td key={key} className="px-4 py-3 text-center">
                                <div className="flex justify-center">
                                  <Checkbox
                                    checked={permissions[key]}
                                    onCheckedChange={() => togglePermission(module.module, role, action)}
                                  />
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
