'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Plus, Search, MapPin, Package } from 'lucide-react';

export default function WarehousePage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Warehouse Management
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Manage warehouse locations, bins, and stock movements
            </p>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg">
            <Plus className="mr-2 h-4 w-4" />
            Add Location
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Warehouses', value: '5', icon: MapPin },
            { label: 'Total Bins', value: '234', icon: Package },
            { label: 'Movements Today', value: '89', icon: Package },
            { label: 'Utilization', value: '78%', icon: Package },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardDescription className="text-sm">{stat.label}</CardDescription>
                    <Icon className="h-5 w-5 text-emerald-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Warehouse Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Warehouse Locations</CardTitle>
              <CardDescription>Overview of all warehouse facilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'Main Warehouse', location: 'New York', bins: 120, utilization: 85 },
                  { name: 'South Distribution', location: 'Texas', bins: 80, utilization: 72 },
                  { name: 'West Coast Hub', location: 'California', bins: 65, utilization: 68 },
                ].map((warehouse, index) => (
                  <Card key={index} className="hover:shadow-xl transition-all border-2 hover:border-emerald-500">
                    <CardHeader>
                      <CardTitle className="text-lg">{warehouse.name}</CardTitle>
                      <CardDescription>{warehouse.location}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Total Bins:</span>
                        <span className="font-semibold">{warehouse.bins}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Utilization:</span>
                        <Badge variant="outline" className="border-emerald-500 text-emerald-700 dark:text-emerald-400">
                          {warehouse.utilization}%
                        </Badge>
                      </div>
                      <Button variant="outline" className="w-full mt-4">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
