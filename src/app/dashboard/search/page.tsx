'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BuyBox, SearchResult } from '@/types';

export default function SearchPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [buyBoxes, setBuyBoxes] = useState<BuyBox[]>([]);
  const [selectedBuyBox, setSelectedBuyBox] = useState<string>('');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAllResults, setShowAllResults] = useState(false);

  const fetchBuyBoxes = useCallback(async () => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/buybox', {
        headers: {
          'x-user-id': user.uid,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setBuyBoxes(data.buyBoxes);
      }
    } catch (error) {
      console.error('Error fetching buy boxes:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchBuyBoxes();
  }, [fetchBuyBoxes]);

  const runSearch = async () => {
    if (!selectedBuyBox || !user) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.uid,
        },
        body: JSON.stringify({
          buyBoxId: selectedBuyBox,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setSearchResult(data.result);
      }
    } catch (error) {
      console.error('Error running search:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Great Deal': return 'bg-green-100 text-green-800';
      case 'Good Deal': return 'bg-blue-100 text-blue-800';
      case 'Fair': return 'bg-gray-100 text-gray-800';
      case 'Over-Priced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const viewResults = () => {
    setShowAllResults(true);
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Properties</h1>
          <p className="text-gray-600">Find investment opportunities using your buy boxes</p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Search Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Run Property Search</CardTitle>
                <CardDescription>
                  Select a buy box to search for matching properties
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Select Buy Box
                  </label>
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

                {selectedBuyBox && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Buy Box Details</h4>
                    {(() => {
                      const buyBox = buyBoxes.find(bb => bb.id === selectedBuyBox);
                      if (!buyBox) return null;
                      
                      return (
                        <div className="text-sm space-y-1">
                          <p><strong>Strategy:</strong> {buyBox.criteria.strategy}</p>
                          <p><strong>Locations:</strong> {buyBox.criteria.locations.join(', ')}</p>
                          <p><strong>Price:</strong> ${buyBox.criteria.priceMin?.toLocaleString() || 'Any'} - ${buyBox.criteria.priceMax?.toLocaleString() || 'Any'}</p>
                        </div>
                      );
                    })()}
                  </div>
                )}

                <Button 
                  onClick={runSearch} 
                  disabled={!selectedBuyBox || loading}
                  className="w-full"
                >
                  {loading ? 'Searching...' : 'Run Search'}
                </Button>

                {buyBoxes.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-gray-500 mb-2">No buy boxes found</p>
                    <Button 
                      variant="outline" 
                      onClick={() => router.push('/dashboard/buy-boxes/create')}
                    >
                      Create Buy Box
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {searchResult ? (
              <Card>
                <CardHeader>
                  <CardTitle>Search Results</CardTitle>
                  <CardDescription>
                    Found {searchResult.totalFound} properties matching &ldquo;{searchResult.buyBoxName}&rdquo;
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(showAllResults ? searchResult.listings : searchResult.listings.slice(0, 5)).map((listing) => (
                      <div key={listing.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{listing.address}</h3>
                            <p className="text-sm text-gray-600">
                              {listing.city}, {listing.state} {listing.zipCode}
                            </p>
                          </div>
                          <Badge className={getBadgeColor(listing.badge)}>
                            {listing.badge}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Price:</span> ${listing.price.toLocaleString()}
                          </div>
                          <div>
                            <span className="font-medium">Beds/Baths:</span> {listing.beds}/{listing.baths}
                          </div>
                          <div>
                            <span className="font-medium">Sq Ft:</span> {listing.sqft.toLocaleString()}
                          </div>
                          <div>
                            <span className="font-medium">Score:</span> {listing.score}/100
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">{listing.description}</p>
                        </div>
                        
                        {listing.matchReasons.length > 0 && (
                          <div className="mt-2">
                            <span className="text-sm font-medium text-green-600">Match reasons: </span>
                            <span className="text-sm text-green-600">
                              {listing.matchReasons.join(', ')}
                            </span>
                          </div>
                        )}
                        
                        {listing.dealBreakers.length > 0 && (
                          <div className="mt-1">
                            <span className="text-sm font-medium text-red-600">Concerns: </span>
                            <span className="text-sm text-red-600">
                              {listing.dealBreakers.join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {searchResult.listings.length > 5 && !showAllResults && (
                      <div className="text-center py-4">
                        <p className="text-gray-600 mb-4">
                          Showing 5 of {searchResult.listings.length} results
                        </p>
                        <Button onClick={viewResults}>
                          View All Results
                        </Button>
                      </div>
                    )}
                    
                    {showAllResults && (
                      <div className="text-center py-4">
                        <p className="text-gray-600 mb-4">
                          Showing all {searchResult.listings.length} results
                        </p>
                        <Button variant="outline" onClick={() => setShowAllResults(false)}>
                          Show Less
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Ready to Find Great Deals?
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Select a buy box and run a search to see matching properties with CarGurus-style deal ratings.
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Badge className="bg-green-100 text-green-800">Great Deal</Badge>
                      <Badge className="bg-blue-100 text-blue-800">Good Deal</Badge>
                      <Badge className="bg-gray-100 text-gray-800">Fair</Badge>
                      <Badge className="bg-red-100 text-red-800">Over-Priced</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 