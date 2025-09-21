"use client";
//catch all signin routes - acc to clerk docs for customized route

import { SignIn } from "@clerk/nextjs";
import { useAuthLoading } from "@/hooks/useAuthLoading";

const Page = () => {
  const { isLoading } = useAuthLoading();

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-600 border-t-transparent"></div>
            <p className="text-sm text-gray-600 font-medium">Signing you in...</p>
          </div>
        </div>
      )}
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white transition-colors',
            card: 'shadow-lg',
            headerTitle: 'text-2xl font-bold',
            headerSubtitle: 'text-gray-600',
            socialButtonsBlockButton: 'border border-gray-300 hover:bg-gray-50 transition-colors',
            dividerLine: 'bg-gray-300',
            dividerText: 'text-gray-500',
            formFieldInput: 'border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            footerActionLink: 'text-blue-600 hover:text-blue-700',
          }
        }}
        afterSignInUrl="/onboarding"
        redirectUrl="/onboarding"
        routing="path"
        path="/signin"
        signUpUrl="/signup"
        forceRedirectUrl="/onboarding"
      />
    </div>
  );
};

export default Page;
