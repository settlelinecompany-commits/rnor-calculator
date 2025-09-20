"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function FAQCard() {
  return (
    <Card className="p-5 md:p-6 rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Frequently Asked Questions</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="q1">
            <AccordionTrigger>How is RNOR determined?</AccordionTrigger>
            <AccordionContent>
              First, we test if you&apos;re Resident in a financial year (≥182 days or ≥60 days with ≥365 days in the 4 prior FYs). If Resident, you are ROR only if both are true: Resident in ≥2 of last 10 FYs and total ≥730 days in last 7 FYs. If either fails, you are RNOR.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>Will I be double taxed?</AccordionTrigger>
            <AccordionContent>
              No. There are two separate tax events: (1) salary-like income at vest/receipt; (2) capital gains on sale. DTAA relief and RNOR rules help prevent double taxation.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger>How many RNOR years can I get?</AccordionTrigger>
            <AccordionContent>
              Typically 1–3 years depending on your past stay and post-landing travel. The calculator shows your likely RNOR window and where it can be extended.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q4">
            <AccordionTrigger>What are the advanced options?</AccordionTrigger>
            <AccordionContent>
              Use the three blocks above to estimate prior India days. If you&apos;re close to thresholds (7-year 730 days or 2-of-10 Resident years), we&apos;ll flag breach risk and suggest a plan.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
