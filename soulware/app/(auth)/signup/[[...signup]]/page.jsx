import { SignUp } from "@clerk/nextjs";

const page = () => {
  return (
    <SignUp 
      appearance={{
        elements: {
          formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-sm normal-case',
          card: 'shadow-lg',
          headerTitle: 'text-2xl font-bold',
          headerSubtitle: 'text-gray-600'
        }
      }}
      afterSignUpUrl="/onboarding"
      redirectUrl="/onboarding"
      signInUrl="/signin"
    />
  );
};
export default page;
