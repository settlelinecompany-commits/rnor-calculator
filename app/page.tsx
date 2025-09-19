"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Page() {
  const router = useRouter();
  const [landing, setLanding] = useState<string>(new Date().toISOString().slice(0,10));
  const [past7yrIndiaDays, setPast7yrIndiaDays] = useState<number>(0);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build query string
    const params = new URLSearchParams();
    params.set('date', landing);
    
    // Include d7 parameter if advanced options are shown (even if value is 0)
    if (showAdvanced) {
      params.set('d7', past7yrIndiaDays.toString());
    }
    
    // Navigate to results page
    router.push(`/results?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-[#f6f0e8]">
      <div className="mx-auto max-w-6xl px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT: Settings */}
        <section className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl font-serif tracking-tight mb-2">Your RNOR Settings</h1>
            <p className="text-neutral-700 max-w-prose">
              Pick your landing date. We&apos;ll estimate your RNOR window so you can plan high-tax moves smartly.
            </p>
          </div>

          {/* Form Card */}
          <Card>
            <CardHeader>
              <CardTitle>Calculate Your RNOR Status</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="landing-date">Landing date in India *</Label>
                    <Input 
                      id="landing-date"
                      type="date" 
                      value={landing} 
                      onChange={(e) => setLanding(e.target.value)}
                      className="w-full"
                      required
                    />
                    <p className="text-xs text-neutral-500">When did you land in India?</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="region">Your region</Label>
                    <Select defaultValue="na">
                      <SelectTrigger id="region">
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="na">North America</SelectItem>
                        <SelectItem value="eu">Europe</SelectItem>
                        <SelectItem value="apac">APAC</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-neutral-500">For copy only (doesn&apos;t change math).</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Your currency</Label>
                    <Select defaultValue="usd">
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD</SelectItem>
                        <SelectItem value="inr">INR</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-neutral-500">For labels only.</p>
                  </div>

                  <div className="space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="w-full"
                    >
                      {showAdvanced ? 'Hide' : 'Show'} Advanced Options
                    </Button>
                    <p className="text-xs text-neutral-500">Optional: Days in India (past 7 years)</p>
                  </div>
                </div>

                {/* Advanced Options */}
                {showAdvanced && (
                  <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                    <Label htmlFor="india-days">Days in India (past 7 years)</Label>
                    <Input 
                      id="india-days"
                      type="number" 
                      value={past7yrIndiaDays} 
                      onChange={(e) => setPast7yrIndiaDays(parseInt(e.target.value) || 0)}
                      placeholder="0"
                      min="0"
                      max="2555"
                      className="w-full"
                    />
                    <p className="text-xs text-neutral-500">
                      Enter days spent in India in the past 7 years. If &gt;729 days, you&apos;ll get 1 RNOR year instead of 2.
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <Button type="submit" className="w-full" size="lg">
                  Calculate My RNOR Status
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="q1">
                  <AccordionTrigger>How is RNOR determined?</AccordionTrigger>
                  <AccordionContent>By residency tests + your day count in the previous 7 years. We verify this on the call.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="q2">
                  <AccordionTrigger>Will I be double taxed?</AccordionTrigger>
                  <AccordionContent>It&apos;s two tax events, not double tax: vest = salary; sale = capital gains. DTAA + Form 67 can credit foreign tax.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="q3">
                  <AccordionTrigger>How many RNOR years can I get?</AccordionTrigger>
                  <AccordionContent>Usually 2–3 after you return. Exact count depends on prior India stay.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="q4">
                  <AccordionTrigger>What are the advanced options?</AccordionTrigger>
                  <AccordionContent>If you&apos;ve spent more than 729 days in India in the past 7 years, you&apos;ll get 1 RNOR year instead of 2. This affects your tax planning strategy.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </section>

        {/* RIGHT: Info Sidebar */}
        <aside className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-2xl">What is RNOR?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span><strong>NR:</strong> Non-Resident</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span><strong>RNOR:</strong> Resident but Not Ordinarily Resident</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span><strong>ROR:</strong> Resident and Ordinarily Resident</span>
                </div>
              </div>
              
              <div className="border-t pt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span>Best years to realize foreign gains</span>
                  <span className="text-green-600 font-medium">During RNOR</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Foreign income taxed in India</span>
                  <span className="text-green-600 font-medium">Lower</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Capital gains on foreign assets</span>
                  <span className="text-green-600 font-medium">Tax-free</span>
                </div>
              </div>

              <Button 
                className="w-full" 
                onClick={() => (window.location.href = "/book")}
                variant="outline"
              >
                Talk to a CA (Free 15-min)
              </Button>
              <p className="text-xs text-neutral-500">
                Get personalized advice on your RNOR strategy.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}
