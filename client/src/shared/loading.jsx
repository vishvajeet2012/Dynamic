// components/LoadingBar.jsx
export default function LoadingBar() {
  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 animate-loading-bar"></div>
    </div>
  )
}
// styles/globals.css