export const metadata = {
  title: 'UniVox PK - Authentication',
  description: 'Sign in or create an account for UniVox PK',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="w-full max-w-md px-4 py-12 sm:px-6 lg:px-8">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            UniVox PK
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            University reviews for Pakistani students
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}