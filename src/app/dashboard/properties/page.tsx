'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BuyBox, SearchResult } from '@/types';
import { ArrowLeft, MapPin, Home } from 'lucide-react';

function PropertiesContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedBuyBoxId = searchParams.get('buyBoxId');

  const [buyBoxes, setBuyBoxes] = useState<BuyBox[]>([]);
  const [selectedBuyBox, setSelectedBuyBox] = useState<string>(selectedBuyBoxId || '');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [loadingProperties, setLoadingProperties] = useState(false);

  const fetchBuyBoxes = useCallback(async () => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/buybox', {
        headers: { 'x-user-id': user.uid },
      });
      if (response.ok) {
        const data = await response.json();
        setBuyBoxes(data.buyBoxes || []);
      }
    } catch (error) {
      console.error('Error fetching buy boxes:', error);
    }
  }, [user]);

  const runSearch = useCallback(async (buyBoxId: string) => {
    if (!user || !buyBoxId) return;
    
    setLoadingProperties(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.uid,
        },
        body: JSON.stringify({ buyBoxId }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setSearchResult(data.result);
      }
    } catch (error) {
      console.error('Error running search:', error);
    } finally {
      setLoadingProperties(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchBuyBoxes();
    }
  }, [user, fetchBuyBoxes]);

  useEffect(() => {
    if (selectedBuyBox) {
      runSearch(selectedBuyBox);
    }
  }, [selectedBuyBox, runSearch]);

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Great Deal': return 'bg-green-100 text-green-800 border-green-200';
      case 'Good Deal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Fair': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Over-Priced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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

  const currentBuyBox = buyBoxes.find(bb => bb.id === selectedBuyBox);

  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Properties</h1>
          <p className="text-gray-600">
            Find properties that match your investment criteria.
          </p>
        </div>

        {/* Buy Box Selector */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Buy Box</CardTitle>
            <CardDescription>
              Choose which investment criteria to use for property matching
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Select value={selectedBuyBox} onValueChange={setSelectedBuyBox}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a buy box" />
                  </SelectTrigger>
                  <SelectContent>
                    {buyBoxes.map((buyBox) => (
                      <SelectItem key={buyBox.id} value={buyBox.id}>
                        {buyBox.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {currentBuyBox && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">{currentBuyBox.name}</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Strategy:</strong> {currentBuyBox.criteria.strategy}</p>
                    <p><strong>Locations:</strong> {currentBuyBox.criteria.locations.join(', ')}</p>
                    <p><strong>Price:</strong> ${currentBuyBox.criteria.priceMin?.toLocaleString() || 'Any'} - ${currentBuyBox.criteria.priceMax?.toLocaleString() || 'Any'}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Properties Results */}
        {loadingProperties ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Finding matching properties...</p>
          </div>
        ) : searchResult ? (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {searchResult.totalFound} Properties Found
              </h2>
              <p className="text-gray-600">
                Matching &ldquo;{searchResult.buyBoxName}&rdquo; criteria
              </p>
            </div>

            <div className="space-y-6">
              {searchResult.listings.map((listing) => (
                <Card key={listing.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{listing.address}</h3>
                          <Badge className={getBadgeColor(listing.badge)}>
                            {listing.badge}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <MapPin className="w-4 h-4" />
                          <span>{listing.city}, {listing.state} {listing.zipCode}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          ${listing.price.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${Math.round(listing.price / listing.sqft)}/sq ft
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <p className="text-2xl font-semibold">{listing.beds}</p>
                        <p className="text-sm text-gray-600">Beds</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <p className="text-2xl font-semibold">{listing.baths}</p>
                        <p className="text-sm text-gray-600">Baths</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <p className="text-2xl font-semibold">{listing.sqft.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Sq Ft</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <p className="text-2xl font-semibold">{listing.yearBuilt}</p>
                        <p className="text-sm text-gray-600">Built</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-700">{listing.description}</p>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-semibold text-blue-600">
                          Score: {listing.score}/100
                        </span>
                        {listing.matchReasons.length > 0 && (
                          <div className="text-sm">
                            <span className="text-green-600 font-medium">✓ </span>
                            <span className="text-green-600">
                              {listing.matchReasons.slice(0, 2).join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                      <Button variant="outline">
                        View Details
                      </Button>
                    </div>

                    {listing.dealBreakers.length > 0 && (
                      <div className="mt-3 p-3 bg-red-50 rounded-lg">
                        <span className="text-sm font-medium text-red-600">⚠ Concerns: </span>
                        <span className="text-sm text-red-600">
                          {listing.dealBreakers.join(', ')}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : selectedBuyBox ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Home className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Properties Found
              </h3>
              <p className="text-gray-600">
                No properties match your current buy box criteria. Try adjusting your requirements.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a Buy Box
                </h3>
                <p className="text-gray-600 mb-4">
                  Choose a buy box above to see matching properties.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <PropertiesContent />
    </Suspense>
  );
} 