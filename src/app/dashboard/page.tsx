'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BuyBox, SearchResult } from '@/types';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [buyBoxes, setBuyBoxes] = useState<BuyBox[]>([]);
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;
    
    try {
      // Fetch buy boxes
      const buyBoxResponse = await fetch('/api/buybox', {
        headers: { 'x-user-id': user.uid },
      });
      if (buyBoxResponse.ok) {
        const buyBoxData = await buyBoxResponse.json();
        setBuyBoxes(buyBoxData.buyBoxes);
      }

      // Fetch recent searches
      const resultsResponse = await fetch('/api/results', {
        headers: { 'x-user-id': user.uid },
      });
      if (resultsResponse.ok) {
        const resultsData = await resultsResponse.json();
        setRecentSearches(resultsData.results.slice(0, 3)); // Show only 3 most recent
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoadingData(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user, fetchDashboardData]);



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Your investment overview and recent activity.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Total Buy Boxes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{buyBoxes.length}</div>
              <p className="text-sm text-gray-600 mt-1">Active investment criteria</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Recent Searches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{recentSearches.length}</div>
              <p className="text-sm text-gray-600 mt-1">Property searches this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Properties Found</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {recentSearches.reduce((total, search) => total + search.totalFound, 0)}
              </div>
              <p className="text-sm text-gray-600 mt-1">Total matching properties</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Your Buy Boxes</CardTitle>
            <CardDescription>
              Manage your investment criteria and search for properties
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingData ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : buyBoxes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-4">No buy boxes created yet</p>
                <Button asChild>
                  <Link href="/dashboard/buy-boxes/create">Create Your First Buy Box</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {buyBoxes.slice(0, 5).map((buyBox) => (
                  <Link 
                    key={buyBox.id} 
                    href={`/dashboard/properties?buyBoxId=${buyBox.id}`}
                    className="block p-4 border rounded-lg hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-lg">{buyBox.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{buyBox.criteria.strategy}</p>
                        <div className="flex gap-4 text-sm text-gray-500">
                          <span>📍 {buyBox.criteria.locations.slice(0, 2).join(', ')}{buyBox.criteria.locations.length > 2 && ` +${buyBox.criteria.locations.length - 2} more`}</span>
                          <span>💰 ${buyBox.criteria.priceMin?.toLocaleString() || '0'} - ${buyBox.criteria.priceMax?.toLocaleString() || '∞'}</span>
                          <span>🏠 {buyBox.criteria.bedsMin || 'Any'}+ beds</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Button variant="outline" size="sm">
                          Search Properties
                        </Button>
                      </div>
                    </div>
                  </Link>
                ))}
                <div className="pt-4">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/dashboard/buy-boxes">View All Buy Boxes</Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
} 