export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Welcome to the Home Page</h1>
      <p className="mt-4 text-lg">This is where the main content will go.</p>
      <div className="mt-6">
        <a href="/login" className="text-blue-500 hover:underline">
          Go to Login
        </a>
      </div>
    </div>
  );
}