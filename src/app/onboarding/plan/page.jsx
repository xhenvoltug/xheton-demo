'use client';

// =====================================================
// XHETON v0.0.012 - Onboarding Plan Selection Page
// Select subscription plan or start free trial
// =====================================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, Check, Sparkles } from 'lucide-react';

export default function OnboardingPlanPage() {
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/onboarding/plan');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch plans');
      }

      setPlans(data.plans || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFreeTrial = async () => {
    setActivating(true);
    setError('');

    try {
      const response = await fetch('/api/onboarding/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType: 'trial',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to activate free trial');
      }

      // Success! Redirect to dashboard
      router.push('/dashboard');

    } catch (err) {
      setError(err.message);
      setActivating(false);
    }
  };

  const handleSelectPlan = (planId) => {
    // Redirect to checkout page (placeholder for now)
    router.push(`/payments/checkout?plan=${planId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">XHETON</h1>
          <p className="text-gray-600">by XHENVOLT</p>
          <div className="mt-6">
            <h2 className="text-2xl font-bold text-gray-900">Choose Your Plan</h2>
            <p className="text-gray-600 mt-2">
              Start with a free 30-day trial. No credit card required.
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white font-semibold">
              <Check className="h-5 w-5" />
            </div>
            <div className="ml-2 text-sm font-medium text-green-600">Business Info</div>
          </div>
          <div className="w-24 h-1 bg-blue-600 mx-4"></div>
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-semibold">
              2
            </div>
            <div className="ml-2 text-sm font-medium text-blue-600">Select Plan</div>
          </div>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Free Trial Banner */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white text-center shadow-xl">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8" />
            </div>
            <h3 className="text-3xl font-bold mb-3">Start Your Free 30-Day Trial</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Try XHETON for free for 30 days. Access all features, no credit card required.
              Cancel anytime.
            </p>
            <Button
              onClick={handleFreeTrial}
              disabled={activating}
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              {activating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Activating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Free Trial
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-xl font-semibold text-gray-900 text-center mb-8">
            Or choose a paid plan
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-lg shadow-lg p-8 ${
                  plan.is_popular ? 'ring-2 ring-blue-600' : ''
                }`}
              >
                {plan.is_popular && (
                  <div className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4">
                    POPULAR
                  </div>
                )}

                <h4 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.plan_name}
                </h4>

                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">
                      UGX {plan.price_monthly?.toLocaleString()}
                    </span>
                    <span className="text-gray-600 ml-2">/month</span>
                  </div>
                  {plan.price_annual > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      or UGX {plan.price_annual?.toLocaleString()}/year
                      {plan.discount_annual_percent > 0 && (
                        <span className="text-green-600 ml-1">
                          (Save {plan.discount_annual_percent}%)
                        </span>
                      )}
                    </p>
                  )}
                </div>

                <p className="text-gray-600 mb-6">{plan.description}</p>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">
                      Up to {plan.max_users} users
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">
                      Up to {plan.max_branches} branch{plan.max_branches !== 1 ? 'es' : ''}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">
                      {plan.max_storage_gb}GB storage
                    </span>
                  </li>
                  {plan.features && typeof plan.features === 'object' && Object.values(plan.features).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full ${
                    plan.is_popular
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-800 hover:bg-gray-900'
                  }`}
                >
                  Select Plan
                </Button>
              </div>
            ))}
          </div>

          {plans.length === 0 && !error && (
            <p className="text-center text-gray-600">
              No pricing plans available. Please contact support.
            </p>
          )}
        </div>

        <p className="text-center text-xs text-gray-500 mt-12">
          © 2025 XHENVOLT. All rights reserved.
        </p>
      </div>
    </div>
  );
}
