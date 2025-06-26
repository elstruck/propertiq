'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 pb-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Proper<span className="text-blue-600">TiQ</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Find great real estate investment deals with our AI-powered buy box analysis tool. 
            Free service for Tennessee investors.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Badge variant="secondary">Free Forever</Badge>
            <Badge variant="secondary">Tennessee Real Estate</Badge>
            <Badge variant="secondary">Investment Analysis</Badge>
          </div>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/signup">Get Started Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎯 Smart Buy Box
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Define your investment criteria with our step-by-step wizard. 
                Set price ranges, property specs, and financial hurdles.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🏠 Property Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get CarGurus-style deal ratings: Great Deal, Good Deal, Fair, or Over-Priced. 
                See detailed scoring breakdown for every property.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🤝 Agent Connection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Connect with licensed Tennessee REALTOR® for investment-friendly 
                real estate services. Free lead generation tool.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Investment Strategies */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Supporting All Investment Strategies
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="text-base py-2 px-4">Buy & Hold</Badge>
            <Badge variant="outline" className="text-base py-2 px-4">Fix & Flip</Badge>
            <Badge variant="outline" className="text-base py-2 px-4">BRRRR</Badge>
            <Badge variant="outline" className="text-base py-2 px-4">Short-Term Rental</Badge>
            <Badge variant="outline" className="text-base py-2 px-4">Land Investment</Badge>
            <Badge variant="outline" className="text-base py-2 px-4">Commercial</Badge>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-blue-600 text-white p-12 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Next Deal?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join investors using ProperTiQ to analyze Tennessee real estate opportunities
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/signup">Start Analyzing Properties</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
