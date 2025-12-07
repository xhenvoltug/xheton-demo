'use client';

import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export function FilterBar({ 
  searchValue = '',
  onSearchChange = () => {},
  filters = [], // { label, value, options: [{label, value}], onChange }
  onClearFilters = () => {},
  className = ''
}) {
  const hasActiveFilters = filters.some(f => f.value);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col sm:flex-row gap-3 mb-6 ${className}`}
    >
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-11 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
        />
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:flex items-center gap-3">
        {filters && filters.map((filter, idx) => (
          <Select key={idx} value={filter.value} onValueChange={filter.onChange}>
            <SelectTrigger className="w-[180px] h-11 bg-white dark:bg-gray-900">
              <SelectValue placeholder={filter.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All {filter.label}</SelectItem>
              {filter.options && filter.options.map((option, optIdx) => (
                <SelectItem key={optIdx} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
        
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClearFilters}
            className="h-11"
          >
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {/* Mobile Filters */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto h-11">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-emerald-500 text-white rounded-full">
                  {filters.filter(f => f.value).length}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              {filters && filters.map((filter, idx) => (
                <div key={idx} className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {filter.label}
                  </label>
                  <Select value={filter.value} onValueChange={filter.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={`Select ${filter.label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {filter.options && filter.options.map((option, optIdx) => (
                        <SelectItem key={optIdx} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
              
              {hasActiveFilters && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={onClearFilters}
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear All Filters
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.div>
  );
}

export default FilterBar;
