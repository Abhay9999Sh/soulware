"use client";
import React from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle } from "lucide-react";

export default function VerificationPending() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Account Under Review
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Hello {user?.firstName}! Your counselor profile has been submitted successfully 
              and is currently being reviewed by our administrative team.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2 text-blue-700">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Profile Submitted</span>
              </div>
              <p className="text-sm text-blue-600 mt-1">
                We'll review your qualifications and credentials
              </p>
            </div>

            <div className="text-left space-y-2 text-sm text-gray-600">
              <p className="font-medium">What happens next:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Our team will verify your credentials</li>
                <li>We'll check your professional background</li>
                <li>You'll receive an email notification once approved</li>
                <li>After approval, you can access your dashboard</li>
              </ul>
            </div>

            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                <strong>Review Time:</strong> Typically 1-3 business days
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Questions?</strong> Contact us at support@soulware.com
              </p>
            </div>

            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline" 
              className="w-full"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
