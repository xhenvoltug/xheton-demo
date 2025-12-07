'use client';

import { useState, use } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatusBadge from '@/components/core/StatusBadge';
import DataTable from '@/components/shared/DataTable';
import { Users, FileText, Activity, Upload, CheckCircle2, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const mockProjectDetails = {
  'PRJ-001': {
    name: 'ERP System Deployment',
    status: 'ongoing',
    progress: 65,
    health: 'good',
    description: 'Complete deployment of enterprise resource planning system across all departments',
    budget: 500000,
    spent: 325000,
    startDate: '2025-10-01',
    deadline: '2025-12-25',
    team: [
      { id: 1, name: 'John Kamau', role: 'Project Manager', avatar: null },
      { id: 2, name: 'Mary Wanjiru', role: 'Lead Developer', avatar: null },
      { id: 3, name: 'James Ochieng', role: 'System Analyst', avatar: null }
    ],
    tasks: [
      { id: 'TSK-001', name: 'Requirements Analysis', status: 'completed', priority: 'high', assignee: 'James Ochieng', deadline: '2025-10-15' },
      { id: 'TSK-002', name: 'Database Design', status: 'completed', priority: 'high', assignee: 'Mary Wanjiru', deadline: '2025-11-01' },
      { id: 'TSK-003', name: 'API Development', status: 'in-progress', priority: 'high', assignee: 'Mary Wanjiru', deadline: '2025-12-10' },
      { id: 'TSK-004', name: 'User Training', status: 'pending', priority: 'medium', assignee: 'John Kamau', deadline: '2025-12-20' }
    ],
    documents: [
      { id: 1, name: 'Project Charter.pdf', size: '2.5 MB', uploadedBy: 'John Kamau', uploadedAt: '2025-10-01' },
      { id: 2, name: 'Technical Specs.docx', size: '1.8 MB', uploadedBy: 'James Ochieng', uploadedAt: '2025-10-05' }
    ],
    activities: [
      { id: 1, action: 'Task completed', description: 'Database Design completed by Mary Wanjiru', timestamp: '2025-11-01 14:30' },
      { id: 2, action: 'Team member added', description: 'James Ochieng joined the project', timestamp: '2025-10-02 09:15' }
    ]
  }
};

export default function ProjectDetailPage({ params }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const project = mockProjectDetails[unwrappedParams.id] || mockProjectDetails['PRJ-001'];

  const taskColumns = [
    { header: 'Task ID', accessor: 'id', render: (row) => <span className="font-mono text-sm">{row.id}</span> },
    { header: 'Task Name', accessor: 'name', render: (row) => <span className="font-semibold">{row.name}</span> },
    { header: 'Status', accessor: 'status', render: (row) => <StatusBadge variant={row.status === 'completed' ? 'success' : row.status === 'in-progress' ? 'info' : 'default'}>{row.status}</StatusBadge> },
    { header: 'Priority', accessor: 'priority', render: (row) => <StatusBadge variant={row.priority === 'high' ? 'error' : 'pending'}>{row.priority}</StatusBadge> },
    { header: 'Assignee', accessor: 'assignee' },
    { header: 'Deadline', accessor: 'deadline' }
  ];

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title={project.name}
          subtitle={`Project ID: ${unwrappedParams.id}`}
          actions={[
            <Button key="team" variant="outline" className="rounded-2xl">
              <Users className="h-4 w-4 mr-2" />
              Manage Team
            </Button>,
            <Button key="edit" className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600">
              Edit Project
            </Button>
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[
            { label: 'Progress', value: `${project.progress}%`, color: 'from-blue-500 to-cyan-500', icon: TrendingUp },
            { label: 'Budget Used', value: `${((project.spent / project.budget) * 100).toFixed(0)}%`, color: 'from-purple-500 to-pink-500', icon: DollarSign },
            { label: 'Team Size', value: project.team.length, color: 'from-emerald-500 to-teal-500', icon: Users },
            { label: 'Tasks', value: project.tasks.length, color: 'from-amber-500 to-orange-500', icon: CheckCircle2 }
          ].map((stat, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
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

        <Card className="rounded-3xl shadow-lg border-0 p-6 mb-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            AI Status Summary (Placeholder)
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            Project is <span className="font-semibold text-blue-600">on track</span> with {project.progress}% completion. 
            Budget utilization at {((project.spent / project.budget) * 100).toFixed(0)}%. 
            Estimated completion: {project.deadline}.
          </p>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl">
            <TabsTrigger value="overview" className="rounded-xl">Overview</TabsTrigger>
            <TabsTrigger value="tasks" className="rounded-xl">Tasks</TabsTrigger>
            <TabsTrigger value="documents" className="rounded-xl">Documents</TabsTrigger>
            <TabsTrigger value="activity" className="rounded-xl">Activity Log</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="rounded-3xl shadow-lg border-0 p-6">
                <h3 className="text-lg font-semibold mb-4">Project Timeline</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Start Date</span>
                    <span className="font-semibold">{project.startDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Deadline</span>
                    <span className="font-semibold">{project.deadline}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status</span>
                    <StatusBadge variant="info">{project.status}</StatusBadge>
                  </div>
                </div>
              </Card>

              <Card className="rounded-3xl shadow-lg border-0 p-6">
                <h3 className="text-lg font-semibold mb-4">Budget</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Budget</span>
                    <span className="font-semibold">UGX {project.budget.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Spent</span>
                    <span className="font-semibold text-blue-600">UGX {project.spent.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Remaining</span>
                    <span className="font-semibold text-emerald-600">UGX {(project.budget - project.spent).toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="h-2 rounded-full bg-blue-500" style={{ width: `${(project.spent / project.budget) * 100}%` }} />
                  </div>
                </div>
              </Card>

              <Card className="rounded-3xl shadow-lg border-0 p-6 md:col-span-2">
                <h3 className="text-lg font-semibold mb-4">Team Members</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {project.team.map(member => (
                    <div key={member.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{member.name}</div>
                        <div className="text-xs text-gray-600">{member.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tasks">
            <Card className="rounded-3xl shadow-lg border-0">
              <DataTable columns={taskColumns} data={project.tasks} />
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card className="rounded-3xl shadow-lg border-0 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Documents</h3>
                <Button className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
              <div className="space-y-3">
                {project.documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <div>
                        <div className="font-semibold">{doc.name}</div>
                        <div className="text-sm text-gray-600">Uploaded by {doc.uploadedBy} • {doc.uploadedAt}</div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600">{doc.size}</span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="rounded-3xl shadow-lg border-0 p-6">
              <h3 className="text-lg font-semibold mb-6">Activity Log</h3>
              <div className="space-y-4">
                {project.activities.map(activity => (
                  <div key={activity.id} className="flex gap-4">
                    <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-500" />
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{activity.action}</div>
                      <div className="text-sm text-gray-600">{activity.description}</div>
                      <div className="text-xs text-gray-500 mt-1">{activity.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
