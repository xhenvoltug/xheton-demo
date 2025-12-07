'use client';

import { useCallback } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FileUpload({ 
  accept = 'image/*,.pdf,.csv', 
  multiple = false, 
  onFilesSelected,
  maxSize = 5 * 1024 * 1024, // 5MB default
  files = [],
  onRemove
}) {
  const handleFileChange = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(file => file.size <= maxSize);
    
    if (validFiles.length !== selectedFiles.length) {
      alert(`Some files exceed the ${(maxSize / 1024 / 1024).toFixed(0)}MB limit`);
    }
    
    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  }, [maxSize, onFilesSelected]);

  return (
    <div className="space-y-4">
      <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl cursor-pointer bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-12 h-12 mb-4 text-gray-400" />
          <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {accept.split(',').join(', ')} (Max {(maxSize / 1024 / 1024).toFixed(0)}MB)
          </p>
        </div>
        <input
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
        />
      </label>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl">
              <span className="text-sm text-gray-900 dark:text-white truncate">
                {file.name}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onRemove && onRemove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
