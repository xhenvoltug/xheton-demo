'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/core/StatusBadge';
import { Plus, ChevronRight, Flag, Calendar as CalendarIcon, User, Tag, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const mockTasks = [
  { 
    id: 'TSK-001', 
    name: 'Requirements Analysis', 
    status: 'completed', 
    priority: 'high', 
    assignee: 'James Ochieng', 
    deadline: '2025-10-15',
    project: 'PRJ-001',
    subtasks: [
      { id: 'SUB-001', name: 'Gather stakeholder requirements', status: 'completed' },
      { id: 'SUB-002', name: 'Document use cases', status: 'completed' }
    ]
  },
  { 
    id: 'TSK-002', 
    name: 'Database Design', 
    status: 'completed', 
    priority: 'high', 
    assignee: 'Mary Wanjiru', 
    deadline: '2025-11-01',
    project: 'PRJ-001',
    subtasks: []
  },
  { 
    id: 'TSK-003', 
    name: 'API Development', 
    status: 'in-progress', 
    priority: 'high', 
    assignee: 'Mary Wanjiru', 
    deadline: '2025-12-10',
    project: 'PRJ-001',
    subtasks: [
      { id: 'SUB-003', name: 'Create authentication endpoints', status: 'completed' },
      { id: 'SUB-004', name: 'Build CRUD operations', status: 'in-progress' },
      { id: 'SUB-005', name: 'Implement validation', status: 'pending', microtasks: [
        { id: 'MIC-001', name: 'Input validation', status: 'pending' },
        { id: 'MIC-002', name: 'Schema validation', status: 'pending' }
      ]}
    ]
  }
];

export default function TaskManagerPage() {
  const [expandedTasks, setExpandedTasks] = useState({});

  const toggleTaskExpansion = (taskId) => {
    setExpandedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'high': 'text-red-600 bg-red-50',
      'medium': 'text-amber-600 bg-amber-50',
      'low': 'text-blue-600 bg-blue-50'
    };
    return colors[priority] || colors.low;
  };

  const getStatusVariant = (status) => {
    const map = { 'completed': 'success', 'in-progress': 'info', 'pending': 'default' };
    return map[status] || 'default';
  };

  const calculateProgress = (task) => {
    if (task.subtasks.length === 0) return task.status === 'completed' ? 100 : task.status === 'in-progress' ? 50 : 0;
    const completed = task.subtasks.filter(st => st.status === 'completed').length;
    return Math.round((completed / task.subtasks.length) * 100);
  };

  const columns = [
    { 
      header: '', 
      accessor: 'expand',
      render: (row) => row.subtasks.length > 0 ? (
        <ChevronRight 
          className={`h-4 w-4 cursor-pointer transition-transform ${expandedTasks[row.id] ? 'rotate-90' : ''}`}
          onClick={() => toggleTaskExpansion(row.id)}
        />
      ) : null
    },
    { header: 'Task ID', accessor: 'id', render: (row) => <span className="font-mono text-sm">{row.id}</span> },
    { header: 'Task Name', accessor: 'name', render: (row) => <span className="font-semibold">{row.name}</span> },
    { 
      header: 'Priority', 
      accessor: 'priority',
      render: (row) => (
        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${getPriorityColor(row.priority)} w-fit`}>
          <Flag className="h-3 w-3" />
          <span className="text-xs font-semibold capitalize">{row.priority}</span>
        </div>
      )
    },
    { header: 'Status', accessor: 'status', render: (row) => <StatusBadge variant={getStatusVariant(row.status)}>{row.status}</StatusBadge> },
    { 
      header: 'Progress', 
      accessor: 'progress',
      render: (row) => {
        const progress = calculateProgress(row);
        return (
          <div className="flex items-center gap-2">
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${progress === 100 ? 'bg-emerald-500' : progress > 50 ? 'bg-blue-500' : 'bg-amber-500'}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-semibold">{progress}%</span>
          </div>
        );
      }
    },
    { 
      header: 'Assignee', 
      accessor: 'assignee',
      render: (row) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{row.assignee}</span>
        </div>
      )
    },
    { 
      header: 'Deadline', 
      accessor: 'deadline',
      render: (row) => (
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{row.deadline}</span>
        </div>
      )
    },
    { 
      header: 'Labels', 
      accessor: 'labels',
      render: () => (
        <div className="flex gap-1">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Backend</span>
        </div>
      )
    }
  ];

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Task Manager"
          subtitle="Manage tasks with multi-level hierarchy"
          actions={[
            <Button key="new" className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600">
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          ]}
        />

        <Card className="rounded-3xl shadow-lg border-0 mb-6">
          <DataTable columns={columns} data={mockTasks} />
        </Card>

        {Object.keys(expandedTasks).map(taskId => {
          if (!expandedTasks[taskId]) return null;
          const task = mockTasks.find(t => t.id === taskId);
          if (!task || task.subtasks.length === 0) return null;

          return (
            <motion.div
              key={taskId}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="ml-12 mb-6"
            >
              <Card className="rounded-3xl shadow-lg border-0 border-l-4 border-l-blue-500 p-6">
                <h3 className="text-lg font-semibold mb-4">Subtasks for {task.name}</h3>
                <div className="space-y-3">
                  {task.subtasks.map(subtask => (
                    <div key={subtask.id}>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm text-gray-600">{subtask.id}</span>
                          <span className="font-medium">{subtask.name}</span>
                        </div>
                        <StatusBadge variant={getStatusVariant(subtask.status)}>{subtask.status}</StatusBadge>
                      </div>
                      
                      {subtask.microtasks && subtask.microtasks.length > 0 && (
                        <div className="ml-8 mt-2 space-y-2">
                          {subtask.microtasks.map(microtask => (
                            <div key={microtask.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-900 rounded-xl border">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs text-gray-500">{microtask.id}</span>
                                <span className="text-sm">{microtask.name}</span>
                              </div>
                              <StatusBadge variant={getStatusVariant(microtask.status)}>{microtask.status}</StatusBadge>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          );
        })}

        <Card className="rounded-3xl shadow-lg border-0 p-6">
          <h3 className="text-lg font-semibold mb-4">Mini Gantt Timeline</h3>
          <div className="space-y-3">
            {mockTasks.map(task => (
              <div key={task.id} className="flex items-center gap-4">
                <div className="w-32 font-mono text-sm text-gray-600">{task.id}</div>
                <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-8 relative overflow-hidden">
                  <div 
                    className="absolute h-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center px-3"
                    style={{ width: `${calculateProgress(task)}%` }}
                  >
                    <span className="text-xs font-semibold text-white truncate">{task.name}</span>
                  </div>
                </div>
                <div className="w-24 text-sm text-gray-600">{task.deadline}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
