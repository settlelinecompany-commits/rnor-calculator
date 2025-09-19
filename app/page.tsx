"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Page() {
  const [landing, setLanding] = useState<string>(new Date().toISOString().slice(0,10));
  const [rnorYears, setRnorYears] = useState<number>(2);

  // Fake summary text for now (logic comes later)
  const rnorWindow = "FY 2026–27 to 2027–28";

  return (
    <main className="min-h-screen bg-[#f6f0e8]">
      <div className="mx-auto max-w-6xl px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT: Settings */}
        <section className="lg:col-span-2">
          <h1 className="text-3xl font-serif tracking-tight mb-2">Your RNOR Settings</h1>
          <p className="text-neutral-700 max-w-prose mb-6">
            Pick your landing date. We’ll estimate your RNOR window so you can plan high-tax moves smartly.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Landing date in India</Label>
              <Input type="date" value={landing} onChange={(e) => setLanding(e.target.value)} />
              <p className="text-xs text-neutral-500">Change this to see your estimated RNOR window.</p>
            </div>

            <div className="space-y-2">
              <Label>Your region</Label>
              <Select defaultValue="na">
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="na">North America</SelectItem>
                  <SelectItem value="eu">Europe</SelectItem>
                  <SelectItem value="apac">APAC</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-neutral-500">For copy only (doesn’t change math).</p>
            </div>

            <div className="space-y-2">
              <Label>Your currency</Label>
              <Select defaultValue="usd">
                <SelectTrigger><SelectValue placeholder="USD" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD</SelectItem>
                  <SelectItem value="inr">INR</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-neutral-500">For labels only.</p>
            </div>

            <div className="space-y-2">
              <Label>RNOR years (estimate)</Label>
              <Slider value={[rnorYears]} min={2} max={3} step={1} onValueChange={(v) => setRnorYears(v[0])} />
              <p className="text-xs text-neutral-500">Most people fall in 2–3 years.</p>
            </div>
          </div>

          {/* Detailed results (visual only for now) */}
          <div className="mt-10">
            <div className="mb-4 font-medium">Refine results</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card><CardContent className="pt-6"><div className="text-sm text-neutral-500 mb-2">RNOR years</div><div className="text-2xl font-semibold">{rnorYears}</div></CardContent></Card>
              <Card><CardContent className="pt-6"><div className="text-sm text-neutral-500 mb-2">Best year to sell RSUs</div><div className="text-2xl font-semibold">During RNOR</div></CardContent></Card>
              <Card><CardContent className="pt-6"><div className="text-sm text-neutral-500 mb-2">Foreign income taxed in India</div><div className="text-2xl font-semibold">Lower in RNOR</div></CardContent></Card>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-10">
            <h2 className="text-2xl font-serif mb-4">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="bg-white rounded-xl shadow">
              <AccordionItem value="q1">
                <AccordionTrigger>How is RNOR determined?</AccordionTrigger>
                <AccordionContent>By residency tests + your day count in the previous 7 years. We verify this on the call.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2">
                <AccordionTrigger>Will I be double taxed?</AccordionTrigger>
                <AccordionContent>It’s two tax events, not double tax: vest = salary; sale = capital gains. DTAA + Form 67 can credit foreign tax.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3">
                <AccordionTrigger>How many RNOR years can I get?</AccordionTrigger>
                <AccordionContent>Usually 2–3 after you return. Exact count depends on prior India stay.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* RIGHT: Results Summary */}
        <aside className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-2xl">Results Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-xs text-neutral-500 mb-1">YOUR RNOR WINDOW (estimated)</div>
                <div className="text-3xl font-semibold">{rnorWindow}</div>
              </div>
              <div className="border-t pt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Best years to realize foreign gains</span>
                  <span className="text-green-600 font-medium">During RNOR</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Foreign income taxed in India</span>
                  <span className="text-green-600 font-medium">Lower</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>RNOR years</span>
                  <span className="text-green-600 font-medium">{rnorYears}</span>
                </div>
              </div>

              <Button className="w-full" onClick={() => (window.location.href = "/book")}>
                Talk to a CA (Free 15-min)
              </Button>
              <p className="text-xs text-neutral-500">
                Indicative only. We confirm your exact RNOR status on the consultation.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}
