'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BuyBoxCriteria, InvestmentStrategy } from '@/types';

export default function CreateBuyBoxPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [buyBoxName, setBuyBoxName] = useState('');
  
  const [criteria, setCriteria] = useState<BuyBoxCriteria>({
    strategy: 'Buy-&-Hold',
    locations: [],
    killSwitches: {
      floodZone: false,
      hoa: false,
      manufactured: false,
      fixerUpper: false,
    },
    toleranceBand: 10,
  });

  const updateCriteria = (updates: Partial<BuyBoxCriteria>) => {
    setCriteria(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/buybox', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.uid,
        },
        body: JSON.stringify({
          name: buyBoxName,
          criteria,
        }),
      });

      if (response.ok) {
        router.push('/dashboard/buy-boxes');
      } else {
        console.error('Failed to create buy box');
      }
    } catch (error) {
      console.error('Error creating buy box:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(5, prev + 1));
  const prevStep = () => setCurrentStep(prev => Math.max(1, prev - 1));

  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create Buy Box</h1>
          <p className="text-gray-600">Define your investment criteria</p>
        </div>

        <div className="max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Buy Box Wizard - Step {currentStep} of 5</CardTitle>
            <CardDescription>
              Complete all steps to create your investment criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={currentStep.toString()} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="1">Strategy</TabsTrigger>
                <TabsTrigger value="2">Geography</TabsTrigger>
                <TabsTrigger value="3">Property</TabsTrigger>
                <TabsTrigger value="4">Financial</TabsTrigger>
                <TabsTrigger value="5">Final</TabsTrigger>
              </TabsList>

              {/* Step 1: Strategy */}
              <TabsContent value="1" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="buyBoxName">Buy Box Name</Label>
                    <Input
                      id="buyBoxName"
                      value={buyBoxName}
                      onChange={(e) => setBuyBoxName(e.target.value)}
                      placeholder="e.g., Nashville Buy & Hold"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="strategy">Investment Strategy</Label>
                    <Select 
                      value={criteria.strategy} 
                      onValueChange={(value: InvestmentStrategy) => updateCriteria({ strategy: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a strategy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Buy-&-Hold">Buy & Hold</SelectItem>
                        <SelectItem value="Flip">Flip</SelectItem>
                        <SelectItem value="BRRRR">BRRRR</SelectItem>
                        <SelectItem value="STR">Short-Term Rental</SelectItem>
                        <SelectItem value="Land">Land</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              {/* Step 2: Geography */}
              <TabsContent value="2" className="space-y-6">
                <div>
                  <Label htmlFor="locations">Target Locations</Label>
                  <Input
                    id="locations"
                    placeholder="Enter ZIP codes or cities (comma separated)"
                    value={criteria.locations.join(', ')}
                    onChange={(e) => updateCriteria({ 
                      locations: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                    })}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Examples: Nashville, 37206, Chattanooga, 37402
                  </p>
                </div>
              </TabsContent>

              {/* Step 3: Property Criteria */}
              <TabsContent value="3" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priceMin">Min Price ($)</Label>
                    <Input
                      id="priceMin"
                      type="number"
                      value={criteria.priceMin || ''}
                      onChange={(e) => updateCriteria({ priceMin: parseInt(e.target.value) || undefined })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="priceMax">Max Price ($)</Label>
                    <Input
                      id="priceMax"
                      type="number"
                      value={criteria.priceMax || ''}
                      onChange={(e) => updateCriteria({ priceMax: parseInt(e.target.value) || undefined })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bedsMin">Min Beds</Label>
                    <Input
                      id="bedsMin"
                      type="number"
                      value={criteria.bedsMin || ''}
                      onChange={(e) => updateCriteria({ bedsMin: parseInt(e.target.value) || undefined })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bedsMax">Max Beds</Label>
                    <Input
                      id="bedsMax"
                      type="number"
                      value={criteria.bedsMax || ''}
                      onChange={(e) => updateCriteria({ bedsMax: parseInt(e.target.value) || undefined })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bathsMin">Min Baths</Label>
                    <Input
                      id="bathsMin"
                      type="number"
                      step="0.5"
                      value={criteria.bathsMin || ''}
                      onChange={(e) => updateCriteria({ bathsMin: parseFloat(e.target.value) || undefined })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bathsMax">Max Baths</Label>
                    <Input
                      id="bathsMax"
                      type="number"
                      step="0.5"
                      value={criteria.bathsMax || ''}
                      onChange={(e) => updateCriteria({ bathsMax: parseFloat(e.target.value) || undefined })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sqftMin">Min Sq Ft</Label>
                    <Input
                      id="sqftMin"
                      type="number"
                      value={criteria.sqftMin || ''}
                      onChange={(e) => updateCriteria({ sqftMin: parseInt(e.target.value) || undefined })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sqftMax">Max Sq Ft</Label>
                    <Input
                      id="sqftMax"
                      type="number"
                      value={criteria.sqftMax || ''}
                      onChange={(e) => updateCriteria({ sqftMax: parseInt(e.target.value) || undefined })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="yearBuiltMin">Min Year Built</Label>
                    <Input
                      id="yearBuiltMin"
                      type="number"
                      value={criteria.yearBuiltMin || ''}
                      onChange={(e) => updateCriteria({ yearBuiltMin: parseInt(e.target.value) || undefined })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hoaMax">Max HOA ($/month)</Label>
                    <Input
                      id="hoaMax"
                      type="number"
                      value={criteria.hoaMax || ''}
                      onChange={(e) => updateCriteria({ hoaMax: parseInt(e.target.value) || undefined })}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Step 4: Financial Criteria */}
              <TabsContent value="4" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="capRateMin">Min Cap Rate (%)</Label>
                    <Input
                      id="capRateMin"
                      type="number"
                      step="0.1"
                      value={criteria.capRateMin || ''}
                      onChange={(e) => updateCriteria({ capRateMin: parseFloat(e.target.value) || undefined })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cocReturnMin">Min Cash-on-Cash Return (%)</Label>
                    <Input
                      id="cocReturnMin"
                      type="number"
                      step="0.1"
                      value={criteria.cocReturnMin || ''}
                      onChange={(e) => updateCriteria({ cocReturnMin: parseFloat(e.target.value) || undefined })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cashFlowMin">Min Monthly Cash Flow ($)</Label>
                    <Input
                      id="cashFlowMin"
                      type="number"
                      value={criteria.cashFlowMin || ''}
                      onChange={(e) => updateCriteria({ cashFlowMin: parseInt(e.target.value) || undefined })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Kill Switches</h3>
                  <div className="space-y-2">
                    {Object.entries({
                      floodZone: 'Avoid Flood Zones',
                      hoa: 'Avoid HOA Properties',
                      manufactured: 'Avoid Manufactured Homes',
                      fixerUpper: 'Avoid Fixer-Uppers',
                    }).map(([key, label]) => (
                      <label key={key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={criteria.killSwitches[key as keyof typeof criteria.killSwitches]}
                          onChange={(e) => updateCriteria({
                            killSwitches: {
                              ...criteria.killSwitches,
                              [key]: e.target.checked,
                            }
                          })}
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="toleranceBand">Tolerance Band (%)</Label>
                  <Input
                    id="toleranceBand"
                    type="number"
                    min="0"
                    max="50"
                    value={criteria.toleranceBand}
                    onChange={(e) => updateCriteria({ toleranceBand: parseInt(e.target.value) || 10 })}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Flexibility percentage for criteria matching
                  </p>
                </div>
              </TabsContent>

              {/* Step 5: Review & Submit */}
              <TabsContent value="5" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Review Your Buy Box</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p><strong>Name:</strong> {buyBoxName}</p>
                    <p><strong>Strategy:</strong> {criteria.strategy}</p>
                    <p><strong>Locations:</strong> {criteria.locations.join(', ')}</p>
                    <p><strong>Price Range:</strong> ${criteria.priceMin?.toLocaleString() || 'Any'} - ${criteria.priceMax?.toLocaleString() || 'Any'}</p>
                    <p><strong>Bedrooms:</strong> {criteria.bedsMin || 'Any'} - {criteria.bedsMax || 'Any'}</p>
                    <p><strong>Bathrooms:</strong> {criteria.bathsMin || 'Any'} - {criteria.bathsMax || 'Any'}</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between mt-8">
              <Button 
                variant="outline" 
                onClick={prevStep} 
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep < 5 ? (
                <Button onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={loading || !buyBoxName}
                >
                  {loading ? 'Creating...' : 'Create Buy Box'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </AppLayout>
  );
} 