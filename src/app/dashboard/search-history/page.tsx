'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SearchResult } from '@/types';

export default function SearchHistoryPage() {
  const { user } = useAuth();
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [loading, setLoading] = useState(true);

  const fetchResults = useCallback(async () => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/results', {
        headers: {
          'x-user-id': user.uid,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results);
        if (data.results.length > 0) {
          setSelectedResult(data.results[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

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
      <AppLayout>
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search History</h1>
          <p className="text-gray-600">Review your property search history and findings</p>
        </div>
        {searchResults.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Search Results Yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Run your first property search to see results here.
                </p>
                <Button onClick={() => window.location.href = '/dashboard/search'}>
                  Start Searching
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Search History Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Search History</CardTitle>
                  <CardDescription>
                    Your recent property searches
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {searchResults.map((result) => (
                      <div
                        key={result.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedResult?.id === result.id
                            ? 'bg-blue-50 border border-blue-200'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedResult(result)}
                      >
                        <h4 className="font-medium text-sm">{result.buyBoxName}</h4>
                        <p className="text-xs text-gray-600">
                          {result.totalFound} properties found
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(result.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Results Panel */}
            <div className="lg:col-span-3">
              {selectedResult && (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{selectedResult.buyBoxName}</CardTitle>
                        <CardDescription>
                          {selectedResult.totalFound} properties found • {new Date(selectedResult.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant={viewMode === 'cards' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setViewMode('cards')}
                        >
                          Cards
                        </Button>
                        <Button
                          variant={viewMode === 'table' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setViewMode('table')}
                        >
                          Table
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={viewMode} className="w-full">
                      {/* Cards View */}
                      <TabsContent value="cards">
                        <div className="space-y-4">
                          {selectedResult.listings.map((listing) => (
                            <div key={listing.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-semibold text-lg">{listing.address}</h3>
                                    <Badge className={getBadgeColor(listing.badge)}>
                                      {listing.badge}
                                    </Badge>
                                  </div>
                                  <p className="text-gray-600">
                                    {listing.city}, {listing.state} {listing.zipCode}
                                  </p>
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

                              <p className="text-gray-700 mb-4">{listing.description}</p>

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
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      {/* Table View */}
                      <TabsContent value="table">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Property</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Beds/Baths</TableHead>
                              <TableHead>Sq Ft</TableHead>
                              <TableHead>Year</TableHead>
                              <TableHead>Score</TableHead>
                              <TableHead>Deal</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedResult.listings.map((listing) => (
                              <TableRow key={listing.id} className="cursor-pointer hover:bg-gray-50">
                                <TableCell>
                                  <div>
                                    <p className="font-medium">{listing.address}</p>
                                    <p className="text-sm text-gray-600">
                                      {listing.city}, {listing.state}
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                  ${listing.price.toLocaleString()}
                                </TableCell>
                                <TableCell>{listing.beds}/{listing.baths}</TableCell>
                                <TableCell>{listing.sqft.toLocaleString()}</TableCell>
                                <TableCell>{listing.yearBuilt}</TableCell>
                                <TableCell>
                                  <span className="font-semibold">{listing.score}/100</span>
                                </TableCell>
                                <TableCell>
                                  <Badge className={getBadgeColor(listing.badge)}>
                                    {listing.badge}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
} 