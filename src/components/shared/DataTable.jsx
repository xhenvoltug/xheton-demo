'use client';

import { motion } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export function DataTable({ 
  columns = [], 
  data = [], 
  selectable = false,
  selectedRows = [],
  onSelectRow = () => {},
  onSelectAll = () => {},
  variant = 'default' // default | compact | comfortable
}) {
  const safeData = Array.isArray(data) ? data : [];
  const safeColumns = Array.isArray(columns) ? columns : [];
  const allSelected = safeData.length > 0 && selectedRows.length === safeData.length;
  
  const getCellPadding = () => {
    switch(variant) {
      case 'compact': return 'py-2 px-4';
      case 'comfortable': return 'py-6 px-6';
      default: return 'py-4 px-4';
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
            {selectable && (
              <TableHead className={`w-12 ${getCellPadding()}`}>
                <Checkbox 
                  checked={allSelected}
                  onCheckedChange={onSelectAll}
                />
              </TableHead>
            )}
            {safeColumns.map((column, idx) => (
              <TableHead 
                key={idx} 
                className={`font-semibold text-gray-700 dark:text-gray-300 ${getCellPadding()} ${column.className || ''}`}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            style={{ display: 'contents' }}
          >
            {safeData.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={safeColumns.length + (selectable ? 1 : 0)} 
                  className="text-center py-12 text-gray-500 dark:text-gray-400"
                >
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              safeData.map((row, rowIdx) => (
                <motion.div
                  key={rowIdx}
                  variants={item}
                  className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                  style={{ display: 'contents' }}
                  asChild
                >
                  <TableRow>
                    {selectable && (
                      <TableCell className={getCellPadding()}>
                        <Checkbox 
                          checked={selectedRows.includes(row.id || rowIdx)}
                          onCheckedChange={() => onSelectRow(row.id || rowIdx)}
                        />
                      </TableCell>
                    )}
                    {safeColumns.map((column, colIdx) => (
                      <TableCell 
                        key={colIdx} 
                        className={`${getCellPadding()} ${column.cellClassName || ''}`}
                      >
                        {column.render ? column.render(row) : row[column.accessor]}
                      </TableCell>
                    ))}
                  </TableRow>
                </motion.div>
              ))
            )}
          </motion.div>
        </TableBody>
      </Table>
    </div>
  );
}

export default DataTable;
