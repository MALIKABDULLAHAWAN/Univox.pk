export const metadata = {
  title: 'Universities - UniVox PK',
  description: 'Browse Pakistani universities with budget-adjusted rankings',
};

export default function UniversitiesPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Universities</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* University cards will be rendered here */}
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">Loading universities...</p>
        </div>
      </div>
    </main>
  );
}