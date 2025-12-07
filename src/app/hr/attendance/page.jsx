'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock, Download, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const mockAttendance = [
  { date: '2025-12-07', present: 45, absent: 2, late: 1 },
  { date: '2025-12-06', present: 46, absent: 1, late: 1 },
  { date: '2025-12-05', present: 44, absent: 3, late: 1 }
];

export default function AttendancePage() {
  const router = useRouter();

  const totalStaff = 48;
  const todayPresent = mockAttendance[0]?.present || 0;
  const todayAbsent = mockAttendance[0]?.absent || 0;
  const attendanceRate = ((todayPresent / totalStaff) * 100).toFixed(1);

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Attendance & Time Tracking"
          subtitle="Monitor employee attendance and shifts"
          actions={[
            <Button key="export" variant="outline" className="rounded-2xl">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>,
            <Button key="manual" className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600">
              <Plus className="h-4 w-4 mr-2" />
              Manual Entry
            </Button>
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[
            { label: 'Total Staff', value: totalStaff, color: 'from-blue-500 to-cyan-500' },
            { label: 'Present Today', value: todayPresent, color: 'from-emerald-500 to-teal-500' },
            { label: 'Absent Today', value: todayAbsent, color: 'from-red-500 to-rose-500' },
            { label: 'Attendance Rate', value: `${attendanceRate}%`, color: 'from-purple-500 to-pink-500' }
          ].map((stat, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <Card className={`rounded-3xl shadow-lg border-0 overflow-hidden bg-gradient-to-br ${stat.color} text-white p-6`}>
                <div className="text-sm opacity-90 mb-1">{stat.label}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="rounded-3xl shadow-lg border-0 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
              Attendance Calendar
            </h3>
            <div className="space-y-3">
              {mockAttendance.map((day, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                  <span className="font-semibold">{day.date}</span>
                  <div className="flex gap-4 text-sm">
                    <span className="text-emerald-600 font-semibold">Present: {day.present}</span>
                    <span className="text-red-600 font-semibold">Absent: {day.absent}</span>
                    <span className="text-amber-600 font-semibold">Late: {day.late}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-3xl shadow-lg border-0 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              Recent Check-Ins
            </h3>
            <div className="space-y-3">
              {[
                { name: 'John Kamau', time: '08:00 AM', status: 'on-time' },
                { name: 'Mary Wanjiru', time: '08:15 AM', status: 'on-time' },
                { name: 'James Ochieng', time: '09:05 AM', status: 'late' }
              ].map((entry, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                  <span className="font-semibold">{entry.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">{entry.time}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${entry.status === 'on-time' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {entry.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
