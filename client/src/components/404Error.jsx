export default function NotFound() {


  return (
    <div className="min-h-screen flex flex-col items-center justify-center  text-black px-4">
      <h1 className="text-8xl font-extrabold text-red-500">404</h1>
      <h2 className="mt-4 text-2xl md:text-3xl font-semibold">
        Oops! Page not found
      </h2>
      <p className="mt-2 text-gray-500 max-w-md text-center">
        Looks like you took a wrong turn. Let’s get you back on track.
      </p>
      <a
        href="/"
        className="mt-6 inline-block text-white px-6 py-3 bg-primaryReds hover:bg-red-600 rounded-lg font-semibold transition-colors duration-300"
      >
 Go Home
      </a>
    </div>
  );
}
