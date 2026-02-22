'use client';

import { ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/page-header';
import { useState } from 'react';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader 
        backLink="/" 
        backText="Back to Home" 
        title="Pricing"
      />
      <main className="container mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
        <div className="space-y-8">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Flexible Plans for Teams of All Sizes</h2>
            <p className="text-lg text-muted-foreground">
              Choose the plan that&apos;s right for you. All plans come with a 365-day free trial.
            </p>
            <div className="flex items-center justify-center space-x-2 pt-4">
                <Label htmlFor="billing-cycle">Monthly</Label>
                <Switch id="billing-cycle" checked={isAnnual} onCheckedChange={setIsAnnual} aria-label="Toggle billing cycle" />
                <Label htmlFor="billing-cycle">Annual (Save 100%)</Label>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Free Plan */}
            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>Free</CardTitle>
                    <CardDescription>For individuals and small projects getting started.</CardDescription>
                    <div className="text-4xl font-bold">FREE<span className="text-base font-normal text-muted-foreground">/month</span></div>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> 1 User</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> 1,000 API Calls/mo</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Community Support</li>
                    </ul>
                </CardContent>
                <CardFooter>
                    <Button variant="secondary" className="w-full">Get Started</Button>
                </CardFooter>
            </Card>

            {/* Pro Plan */}
            <Card className="border-primary shadow-lg flex flex-col">
                <CardHeader>
                    <CardTitle>Pro</CardTitle>
                    <CardDescription>For growing teams that need more power and support.</CardDescription>
                     <div className="text-4xl font-bold">FREE<span className="text-base font-normal text-muted-foreground">/month</span></div>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> 5 Users</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> 100,000 API Calls/mo</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Fine-tuning capabilities</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Email Support</li>
                    </ul>
                </CardContent>
                <CardFooter>
                    <Button className="w-full">Choose Pro</Button>
                </CardFooter>
            </Card>

            {/* Enterprise Plan */}
             <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>Enterprise</CardTitle>
                    <CardDescription>For large organizations with custom needs and security requirements.</CardDescription>
                     <div className="text-4xl font-bold">Custom</div>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Unlimited Users</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Custom API Rate Limits</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> SSO & Advanced Security</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Dedicated Support</li>
                    </ul>
                </CardContent>
                <CardFooter>
                    <Button variant="secondary" className="w-full">Contact Sales</Button>
                </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
