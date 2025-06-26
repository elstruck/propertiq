'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Home, 
  Target,
  BarChart3,
  PieChart
} from 'lucide-react';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');

  // Mock data
  const metrics = {
    totalSearches: 47,
    searchChange: 23,
    avgDealScore: 72,
    scoreChange: -5,
    propertiesFound: 189,
    propertiesChange: 12,
    bestDeals: 8,
    dealsChange: 3,
  };

  const topBuyBoxes = [
    { name: 'Nashville Buy & Hold', searches: 15, avgScore: 78, properties: 45 },
    { name: 'Chattanooga Flip', searches: 12, avgScore: 68, properties: 34 },
    { name: 'Tennessee BRRRR', searches: 8, avgScore: 82, properties: 29 },
    { name: 'Memphis STR', searches: 6, avgScore: 65, properties: 22 },
  ];

  const recentFinds = [
    { address: '1234 Music Row', city: 'Nashville', price: 285000, score: 95, badge: 'Great Deal' },
    { address: '5678 Lookout Dr', city: 'Chattanooga', price: 165000, score: 88, badge: 'Great Deal' },
    { address: '9101 Beale Street', city: 'Memphis', price: 125000, score: 85, badge: 'Good Deal' },
  ];

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Great Deal': return 'bg-green-100 text-green-800 border-green-200';
      case 'Good Deal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Fair': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Over-Priced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
            <p className="text-gray-600">
              Track your investment performance and discover trends.
            </p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Searches</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalSearches}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                +{metrics.searchChange}% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Deal Score</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.avgDealScore}/100</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
                {metrics.scoreChange}% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Properties Found</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.propertiesFound}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                +{metrics.propertiesChange}% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Great Deals</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.bestDeals}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                +{metrics.dealsChange} this month
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Top Performing Buy Boxes */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Buy Boxes</CardTitle>
              <CardDescription>
                Your most active investment criteria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topBuyBoxes.map((buyBox, index) => (
                  <div key={buyBox.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">{buyBox.name}</h4>
                        <p className="text-sm text-gray-600">
                          {buyBox.searches} searches • {buyBox.properties} properties
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">{buyBox.avgScore}</div>
                      <div className="text-xs text-gray-500">avg score</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Great Finds */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Great Finds</CardTitle>
              <CardDescription>
                Your highest scoring properties this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentFinds.map((property) => (
                  <div key={property.address} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{property.address}</h4>
                      <p className="text-sm text-gray-600">{property.city}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">${property.price.toLocaleString()}</span>
                        <Badge className={getBadgeColor(property.badge)}>
                          {property.badge}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">Score: {property.score}/100</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mock Chart Area */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Search Activity Trends</CardTitle>
              <CardDescription>
                Property searches and deal quality over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <PieChart className="w-12 h-12 mx-auto mb-2" />
                  <p>Interactive charts coming soon</p>
                  <p className="text-sm">Real-time analytics dashboard</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
} 