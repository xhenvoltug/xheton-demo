'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Plus, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const mockGanttTasks = [
  { id: 'TSK-001', name: 'Requirements Analysis', start: '2025-10-01', end: '2025-10-15', progress: 100, dependencies: [] },
  { id: 'TSK-002', name: 'Database Design', start: '2025-10-16', end: '2025-11-01', progress: 100, dependencies: ['TSK-001'] },
  { id: 'TSK-003', name: 'API Development', start: '2025-11-02', end: '2025-12-10', progress: 65, dependencies: ['TSK-002'] },
  { id: 'TSK-004', name: 'Frontend Development', start: '2025-11-15', end: '2025-12-20', progress: 40, dependencies: ['TSK-002'] },
  { id: 'TSK-005', name: 'Testing & QA', start: '2025-12-11', end: '2025-12-22', progress: 0, dependencies: ['TSK-003', 'TSK-004'] },
  { id: 'MIL-001', name: 'Beta Release', start: '2025-12-23', end: '2025-12-23', progress: 0, isMilestone: true, dependencies: ['TSK-005'] }
];

const months = ['Oct 2025', 'Nov 2025', 'Dec 2025'];
const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

export default function GanttChartPage() {
  const [zoomLevel, setZoomLevel] = useState('week');
  const [isDragging, setIsDragging] = useState(null);

  const getTaskPosition = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const projectStart = new Date('2025-10-01');
    const totalDays = 90;

    const startOffset = Math.floor((start - projectStart) / (1000 * 60 * 60 * 24));
    const duration = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const startPercent = (startOffset / totalDays) * 100;
    const widthPercent = (duration / totalDays) * 100;

    return { left: `${startPercent}%`, width: `${widthPercent}%` };
  };

  return (
    <DashboardLayout>
      <div className="xheton-page">
        <PageHeader
          title="Gantt Chart"
          subtitle="Visual project timeline and dependencies"
          actions={[
            <Button key="zoom-out" variant="outline" className="rounded-2xl" onClick={() => setZoomLevel('month')}>
              <ZoomOut className="h-4 w-4 mr-2" />
              Month View
            </Button>,
            <Button key="zoom-in" variant="outline" className="rounded-2xl" onClick={() => setZoomLevel('week')}>
              <ZoomIn className="h-4 w-4 mr-2" />
              Week View
            </Button>,
            <Button key="milestone" className="rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Milestone
            </Button>
          ]}
        />

        <Card className="rounded-3xl shadow-lg border-0 p-6 overflow-x-auto">
          <div className="min-w-[1200px]">
            {/* Timeline Header */}
            <div className="flex border-b pb-4 mb-4">
              <div className="w-64 flex-shrink-0 font-semibold">Task Name</div>
              <div className="flex-1 grid grid-cols-12 gap-1">
                {months.map((month, idx) => (
                  <div key={idx} className="col-span-4 text-center font-semibold text-sm text-gray-700 dark:text-gray-300">
                    {month}
                  </div>
                ))}
              </div>
            </div>

            {/* Week Headers */}
            {zoomLevel === 'week' && (
              <div className="flex border-b pb-2 mb-4">
                <div className="w-64 flex-shrink-0"></div>
                <div className="flex-1 grid grid-cols-12 gap-1">
                  {[...Array(12)].map((_, idx) => (
                    <div key={idx} className="text-center text-xs text-gray-500">
                      W{idx + 1}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gantt Rows */}
            <div className="space-y-3">
              {mockGanttTasks.map((task, idx) => {
                const position = getTaskPosition(task.start, task.end);
                
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center group"
                  >
                    <div className="w-64 flex-shrink-0">
                      <div className="flex items-center gap-2">
                        {task.isMilestone ? (
                          <Calendar className="h-4 w-4 text-purple-600" />
                        ) : (
                          <div className={`w-3 h-3 rounded-full ${task.progress === 100 ? 'bg-emerald-500' : task.progress > 0 ? 'bg-blue-500' : 'bg-gray-300'}`} />
                        )}
                        <span className="font-mono text-sm text-gray-600">{task.id}</span>
                        <span className="text-sm font-medium truncate">{task.name}</span>
                      </div>
                    </div>

                    <div className="flex-1 relative h-10">
                      {/* Grid Lines */}
                      <div className="absolute inset-0 grid grid-cols-12 gap-1 pointer-events-none">
                        {[...Array(12)].map((_, idx) => (
                          <div key={idx} className="border-r border-gray-200 dark:border-gray-700" />
                        ))}
                      </div>

                      {/* Task Bar */}
                      {task.isMilestone ? (
                        <div 
                          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rotate-45 bg-purple-600 cursor-pointer hover:scale-110 transition-transform z-10"
                          style={{ left: position.left }}
                        />
                      ) : (
                        <div
                          className="absolute top-1/2 -translate-y-1/2 h-6 rounded-lg cursor-move transition-all hover:scale-105 z-10"
                          style={{ 
                            left: position.left, 
                            width: position.width,
                            backgroundColor: task.progress === 100 ? '#10b981' : task.progress > 0 ? '#3b82f6' : '#9ca3af'
                          }}
                          onMouseDown={() => setIsDragging(task.id)}
                        >
                          <div 
                            className="h-full bg-white bg-opacity-30 rounded-lg"
                            style={{ width: `${task.progress}%` }}
                          />
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
                            {task.progress}%
                          </span>
                        </div>
                      )}

                      {/* Dependencies Lines */}
                      {task.dependencies.length > 0 && (
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-50">
                          {/* Placeholder for dependency lines - would need SVG for production */}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Today Indicator */}
            <div className="flex mt-8">
              <div className="w-64 flex-shrink-0"></div>
              <div className="flex-1 relative">
                <div className="absolute top-0 h-full border-l-2 border-red-500" style={{ left: '70%' }}>
                  <div className="absolute -top-6 -left-8 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    Today
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card className="rounded-3xl shadow-lg border-0 p-6">
            <h3 className="font-semibold mb-3">Legend</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-emerald-500 rounded" />
                <span className="text-sm">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded" />
                <span className="text-sm">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 rounded" />
                <span className="text-sm">Not Started</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-600 rounded rotate-45" />
                <span className="text-sm">Milestone</span>
              </div>
            </div>
          </Card>

          <Card className="rounded-3xl shadow-lg border-0 p-6">
            <h3 className="font-semibold mb-3">Project Timeline</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Start Date:</span>
                <span className="font-semibold">2025-10-01</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">End Date:</span>
                <span className="font-semibold">2025-12-25</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-semibold">86 days</span>
              </div>
            </div>
          </Card>

          <Card className="rounded-3xl shadow-lg border-0 p-6">
            <h3 className="font-semibold mb-3">Critical Path</h3>
            <div className="space-y-2">
              <div className="text-xs font-mono text-gray-600 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                TSK-001 → TSK-002 → TSK-003 → TSK-005
              </div>
              <p className="text-sm text-gray-600">
                Critical tasks that directly impact project deadline
              </p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
