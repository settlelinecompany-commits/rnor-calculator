"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BookPage() {
  // Fire GTM event on mount
  useEffect(() => {
    // Check if GTM is available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'book_view', {
        event_category: 'engagement',
        event_label: 'booking_page_view'
      });
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#f6f0e8]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif tracking-tight mb-2">Book Your Free Consultation</h1>
          <p className="text-neutral-700 max-w-2xl mx-auto">
            Schedule a 15-minute call with our certified tax professionals to discuss your RNOR strategy.
          </p>
        </div>

        {/* Booking Card */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Select Your Preferred Time</CardTitle>
          </CardHeader>
          <CardContent>
            {/* HubSpot Booking Widget */}
            <div className="w-full">
              <iframe
                src="https://meetings.hubspot.com/your-meeting-link"
                width="100%"
                height="600"
                frameBorder="0"
                title="Book a meeting"
                className="rounded-lg"
              />
            </div>
            
            {/* Alternative booking info */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Can't see the booking widget?</h3>
              <p className="text-sm text-blue-800 mb-3">
                If the booking widget isn't loading, you can also:
              </p>
              <ul className="text-sm text-blue-800 space-y-1 mb-4">
                <li>• Email us at: <strong>hello@yourcompany.com</strong></li>
                <li>• Call us at: <strong>+1 (555) 123-4567</strong></li>
                <li>• WhatsApp: <strong>+1 (555) 123-4567</strong></li>
              </ul>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open('mailto:hello@yourcompany.com?subject=RNOR Consultation Request', '_blank')}
              >
                Send Email
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* What to Expect */}
        <Card className="max-w-4xl mx-auto mt-8">
          <CardHeader>
            <CardTitle>What to Expect</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">15-Minute Call</h3>
                <p className="text-sm text-neutral-600">
                  Quick assessment of your RNOR status and tax optimization opportunities.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Personalized Strategy</h3>
                <p className="text-sm text-neutral-600">
                  Custom recommendations for your specific situation and goals.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Next Steps</h3>
                <p className="text-sm text-neutral-600">
                  Clear action plan and follow-up options if you need ongoing support.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="text-center mt-8">
          <Button 
            variant="outline"
            onClick={() => window.history.back()}
          >
            ← Back to Calculator
          </Button>
        </div>
      </div>
    </main>
  );
}
