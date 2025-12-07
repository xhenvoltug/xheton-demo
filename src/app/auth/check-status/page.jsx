'use client';

// =====================================================
// XHETON v0.0.012 - Check Status Page
// Validate subscription and redirect to appropriate page
// =====================================================

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function CheckStatusPage() {
  const router = useRouter();
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const response = await fetch('/api/auth/check-status');
      const data = await response.json();

      console.log('Status check result:', data);

      if (data.redirectTo) {
        // Wait a moment before redirecting
        setTimeout(() => {
          router.push(data.redirectTo);
        }, 500);
      } else {
        // No redirect specified, go to dashboard
        router.push('/dashboard');
      }

    } catch (error) {
      console.error('Status check failed:', error);
      // On error, redirect to login
      router.push('/auth/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="text-center">
        <div className="mb-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Checking your account status...
        </h2>
        <p className="text-gray-600">
          Please wait while we verify your subscription
        </p>
      </div>
    </div>
  );
}
