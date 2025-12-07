'use client';

// =====================================================
// XHETON v0.0.012 - Onboarding Start Page
// Collect business information and create default branch
// =====================================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, Loader2, Building2, Phone, Globe } from 'lucide-react';

const COUNTRIES = [
  'Uganda',
  'Kenya',
  'Tanzania',
  'Rwanda',
  'South Sudan',
  'Other',
];

const INDUSTRIES = [
  'Retail',
  'Wholesale',
  'Manufacturing',
  'Services',
  'E-commerce',
  'Restaurant/Hospitality',
  'Healthcare',
  'Education',
  'Other',
];

export default function OnboardingStartPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    businessName: '',
    phone: '',
    country: 'Uganda',
    industry: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.businessName) {
      setError('Business name is required');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/onboarding/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save business information');
      }

      // Proceed to plan selection
      router.push('/onboarding/plan');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      <div className="w-full max-w-2xl">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">XHETON</h1>
          <p className="text-gray-600">by XHENVOLT</p>
          <div className="mt-6">
            <h2 className="text-2xl font-bold text-gray-900">Welcome to XHETON!</h2>
            <p className="text-gray-600 mt-2">
              Let's set up your account in 2 simple steps
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-semibold">
              1
            </div>
            <div className="ml-2 text-sm font-medium text-blue-600">Business Info</div>
          </div>
          <div className="w-24 h-1 bg-gray-300 mx-4"></div>
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 text-gray-600 font-semibold">
              2
            </div>
            <div className="ml-2 text-sm font-medium text-gray-500">Select Plan</div>
          </div>
        </div>

        {/* Onboarding Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Tell us about your business
          </h3>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="businessName" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Business Name *
              </Label>
              <Input
                id="businessName"
                name="businessName"
                type="text"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Enter your business name"
                required
                disabled={loading}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                This will be used as your company name in the system
              </p>
            </div>

            <div>
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+256 700 000 000"
                disabled={loading}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="country" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Country *
              </Label>
              <Select
                value={formData.country}
                onValueChange={(value) => handleSelectChange('country', value)}
                disabled={loading}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="industry">Industry</Label>
              <Select
                value={formData.industry}
                onValueChange={(value) => handleSelectChange('industry', value)}
                disabled={loading}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.push('/auth/login')}
                disabled={loading}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Continue'
                )}
              </Button>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-gray-500 mt-8">
          © 2025 XHENVOLT. All rights reserved.
        </p>
      </div>
    </div>
  );
}
