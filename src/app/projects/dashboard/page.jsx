'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/core/StatusBadge';
import { Plus, LayoutGrid, List, TrendingUp, Clock, AlertTriangle, CheckCircle2, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const mockProjects = [
  { id: 'PRJ-001', name: 'ERP System Deployment', status: 'ongoing', progress: 65, health: 'good', deadline: '2025-12-25', budget: 500000, spent: 325000, team: 8 },
  { id: 'PRJ-002', name: 'Mobile App Development', status: 'ongoing', progress: 82, health: 'excellent', deadline: '2025-12-20', budget: 350000, spent: 287000, team: 6 },
  { id: 'PRJ-003', name: 'Website Redesign', status: 'upcoming', progress: 0, health: 'pending', deadline: '2026-01-15', budget: 150000, spent: 0, team: 4 },
  { id: 'PRJ-004', name: 'Data Migration Project', status: 'overdue', progress: 45, health: 'at-risk', deadline: '2025-12-05', budget: 200000, spent: 180000, team: 5 },
  { id: 'PRJ-005', name: 'Cloud Infrastructure Setup', status: 'ongoing', progress: 90, health: 'good', deadline: '2025-12-15', budget: 450000, spent: 405000, team: 7 }
];

export default function ProjectDashboardPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState('grid');

  const ongoingProjects = mockProjects.filter(p => p.status === 'ongoing').length;
  const upcomingProjects = mockProjects.filter(p => p.status === 'upcoming').length;
  const overdueProjects = mockProjects.filter(p => p.status === 'overdue').length;
  const totalBudget = mockProjects.reduce((sum, p) => sum + p.budget, 0);

  const getHealthColor = (health) => {
    const colors = {
      'excellent': 'text-emerald-600 bg-emerald-50',
      'good': 'text-blue-600 bg-blue-50',
      'at-risk': 'text-amber-600 bg-amber-50',
      'pending': 'text-gray-600 bg-gray-50'
    };
    return colors[health] || colors.pending;
  };

  const getHealthIcon = (health) => {
    if (health === 'excellent') return <CheckCircle2 className="h-5 w-5" />;
    if (health === 'at-risk') return <AlertTriangle className="h-5 w-5" />;
    return <TrendingUp className="h-5 w-5" />;
  };

  const getStatusVariant = (status) => {
    const map = { 'ongoing': 'info', 'upcoming': 'default', 'overdue': 'error', 'completed': 'success' };
    return map[status] || 'default';
  };

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Project Management"
          subtitle="Manage and track all your projects in one place"
          actions={[
            <Button
              key="kanban"
              variant={viewMode === 'kanban' ? 'default' : 'outline'}
              className="rounded-2xl"
              onClick={() => setViewMode('kanban')}
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Kanban
            </Button>,
            <Button
              key="list"
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              className="rounded-2xl"
              onClick={() => setViewMode('grid')}
            >
              <List className="h-4 w-4 mr-2" />
              Grid
            </Button>,
            <Button
              key="new"
              onClick={() => router.push('/projects/new')}
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[
            { label: 'Ongoing Projects', value: ongoingProjects, color: 'from-blue-500 to-cyan-500', icon: TrendingUp },
            { label: 'Upcoming Projects', value: upcomingProjects, color: 'from-purple-500 to-pink-500', icon: Clock },
            { label: 'Overdue Projects', value: overdueProjects, color: 'from-red-500 to-rose-500', icon: AlertTriangle },
            { label: 'Total Budget', value: `UGX ${(totalBudget / 1000000).toFixed(1)}M`, color: 'from-emerald-500 to-teal-500', icon: Calendar }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className={`rounded-3xl shadow-lg border-0 overflow-hidden bg-gradient-to-br ${stat.color} text-white p-6`}>
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="h-8 w-8 opacity-80" />
                </div>
                <div className="text-sm opacity-90 mb-1">{stat.label}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="rounded-3xl shadow-lg border-0 p-6 hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => router.push(`/projects/${project.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">{project.name}</h3>
                      <p className="text-sm text-gray-500 font-mono">{project.id}</p>
                    </div>
                    <StatusBadge variant={getStatusVariant(project.status)}>{project.status}</StatusBadge>
                  </div>

                  <div className={`flex items-center gap-2 p-3 rounded-2xl mb-4 ${getHealthColor(project.health)}`}>
                    {getHealthIcon(project.health)}
                    <span className="text-sm font-semibold capitalize">{project.health} Health</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-semibold text-gray-900">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${project.progress > 80 ? 'bg-emerald-500' : project.progress > 50 ? 'bg-blue-500' : 'bg-amber-500'}`}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Deadline</span>
                      <span className="font-semibold">{project.deadline}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Budget</span>
                      <span className="font-semibold">UGX {(project.spent / 1000).toFixed(0)}K / {(project.budget / 1000).toFixed(0)}K</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Team Size</span>
                      <span className="font-semibold">{project.team} members</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {viewMode === 'kanban' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['upcoming', 'ongoing', 'overdue'].map((status) => (
              <Card key={status} className="rounded-3xl shadow-lg border-0 p-6">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4 capitalize">{status}</h3>
                <div className="space-y-4">
                  {mockProjects.filter(p => p.status === status).map((project) => (
                    <Card 
                      key={project.id} 
                      className="p-4 border-2 cursor-pointer hover:border-blue-500 transition-colors"
                      onClick={() => router.push(`/projects/${project.id}`)}
                    >
                      <h4 className="font-semibold text-sm mb-2">{project.name}</h4>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>{project.progress}%</span>
                        <span>{project.team} team</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                        <div 
                          className="h-1 rounded-full bg-blue-500"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
