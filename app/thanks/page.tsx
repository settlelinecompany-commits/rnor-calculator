"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, Calculator, Calendar } from "lucide-react";

export default function ThanksPage() {
  // Fire GTM event on mount
  useEffect(() => {
    // Check if GTM is available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'thank_you_view', {
        event_category: 'conversion',
        event_label: 'booking_confirmation'
      });
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#f6f0e8]">
      <div className="mx-auto max-w-4xl px-6 py-10">
        
        {/* Thank You Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-serif tracking-tight mb-2">Thank You!</h1>
          <p className="text-neutral-700 max-w-2xl mx-auto">
            Your consultation has been scheduled. {"We'll send you a confirmation email with meeting details shortly."}
          </p>
        </div>

        {/* Next Steps Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              What to Bring to Your Call
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-green-700">Essential Documents</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>RSU statements from your employer</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Brokerage account cost basis information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Previous year tax returns (if available)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Employment offer letter or contract</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold text-green-700">Helpful Information</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Dates of previous India visits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Current salary and bonus structure</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Any existing tax planning strategies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Questions about your specific situation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preparation Tips */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              How to Prepare
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Gather Documents</h3>
                <p className="text-sm text-neutral-600">
                  Collect all the documents listed above. {"Don't worry if you don't have everything."}
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Think About Goals</h3>
                <p className="text-sm text-neutral-600">
                  Consider what you want to achieve with your RNOR status and tax planning.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Prepare Questions</h3>
                <p className="text-sm text-neutral-600">
                  Write down any specific questions you have about your situation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Need to Reschedule?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-neutral-600">
                {"If you need to reschedule or have any questions before the call, please don't hesitate to reach out."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="outline"
                  onClick={() => window.open('mailto:hello@yourcompany.com?subject=Reschedule Consultation', '_blank')}
                >
                  Email Us
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.open('tel:+15551234567', '_blank')}
                >
                  Call Us
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="text-center space-y-4">
          <Button 
            onClick={() => window.location.href = '/'}
            className="mr-4"
          >
            Back to Calculator
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/book'}
          >
            Book Another Call
          </Button>
        </div>
      </div>
    </main>
  );
}
