'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Target, Search } from 'lucide-react';
import { BuyBox } from '@/types';

export default function BuyBoxesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [buyBoxes, setBuyBoxes] = useState<BuyBox[]>([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBuyBoxes();
  }, [fetchBuyBoxes]);

  const handleBuyBoxClick = async (buyBoxId: string) => {
    // Run search directly when clicking on buy box
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user!.uid,
        },
        body: JSON.stringify({
          buyBoxId: buyBoxId,
        }),
      });
      
      if (response.ok) {
        // Navigate to search page or results
        router.push('/dashboard/search');
      }
    } catch (error) {
      console.error('Error running search:', error);
    }
  };

  const getStrategyColor = (strategy: string) => {
    switch (strategy) {
      case 'Buy-&-Hold': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Flip': return 'bg-green-100 text-green-800 border-green-200';
      case 'BRRRR': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'STR': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Land': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
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
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Buy Boxes</h1>
            <p className="text-gray-600">
              Manage your investment criteria and find matching properties.
            </p>
          </div>
          <Button onClick={() => router.push('/dashboard/buy-boxes/create')}>
            <Plus className="w-4 h-4 mr-2" />
            Create Buy Box
          </Button>
        </div>

        {buyBoxes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="text-center">
                <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Buy Boxes Yet
                </h3>
                <p className="text-gray-600 mb-6 max-w-md">
                  Create your first buy box to define your investment criteria and start finding great deals.
                </p>
                <Button onClick={() => router.push('/dashboard/buy-boxes/create')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Buy Box
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Buy Box Name</TableHead>
                    <TableHead>Strategy</TableHead>
                    <TableHead>Locations</TableHead>
                    <TableHead>Price Range</TableHead>
                    <TableHead>Property Specs</TableHead>
                    <TableHead>Financial</TableHead>
                    <TableHead className="w-[120px]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {buyBoxes.map((buyBox) => (
                    <TableRow 
                      key={buyBox.id} 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleBuyBoxClick(buyBox.id)}
                    >
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-semibold">{buyBox.name}</p>
                          <p className="text-xs text-gray-500">
                            Created {new Date(buyBox.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStrategyColor(buyBox.criteria.strategy)}>
                          {buyBox.criteria.strategy}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {buyBox.criteria.locations.slice(0, 2).join(', ')}
                          {buyBox.criteria.locations.length > 2 && (
                            <span className="text-gray-500"> +{buyBox.criteria.locations.length - 2} more</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          ${buyBox.criteria.priceMin?.toLocaleString() || '0'} - 
                          ${buyBox.criteria.priceMax?.toLocaleString() || '∞'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
                          <div>{buyBox.criteria.bedsMin || 'Any'}+ beds, {buyBox.criteria.bathsMin || 'Any'}+ baths</div>
                          <div className="text-xs text-gray-500">
                            {buyBox.criteria.sqftMin ? `${buyBox.criteria.sqftMin.toLocaleString()}+ sqft` : 'Any size'}
                            {buyBox.criteria.yearBuiltMin && `, ${buyBox.criteria.yearBuiltMin}+ year`}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
                          {buyBox.criteria.capRateMin && (
                            <div>Cap Rate: {buyBox.criteria.capRateMin}%+</div>
                          )}
                          {buyBox.criteria.cocReturnMin && (
                            <div>CoC: {buyBox.criteria.cocReturnMin}%+</div>
                          )}
                          {!buyBox.criteria.capRateMin && !buyBox.criteria.cocReturnMin && (
                            <span className="text-gray-500">No targets</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBuyBoxClick(buyBox.id);
                          }}
                        >
                          <Search className="w-4 h-4 mr-1" />
                          Search
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
} 