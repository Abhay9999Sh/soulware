//catch all signin routes - acc to clerk docs for customized route

import { SignIn } from "@clerk/nextjs";

const Page = () => {
  return (
    <SignIn 
      appearance={{
        elements: {
          formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-sm normal-case',
          card: 'shadow-lg',
          headerTitle: 'text-2xl font-bold',
          headerSubtitle: 'text-gray-600'
        }
      }}
      afterSignInUrl="/onboarding"
      redirectUrl="/onboarding"
      signUpUrl="/signup"
    />
  );
};

export default Page;
