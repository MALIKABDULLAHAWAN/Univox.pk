export const metadata = {
  title: 'UniVox PK - University Reviews Pakistan',
  description: 'Student-first university review platform with budget-adjusted rankings',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}