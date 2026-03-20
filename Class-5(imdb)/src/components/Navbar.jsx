import { Link } from "react-router-dom";

function Navbar() {

   


  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-slate-900 text-white shadow-md">
      
      {/* Left Side: Logo and Title */}
      <div className="flex items-center space-x-3 cursor-pointer">
        <div className="bg-blue-600 p-2 rounded-lg">
          {/* Movie Reel SVG Icon */}
         
        </div>
        <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          CineMatch
        </h1>
      </div>

      {/* Right Side: Navigation Links */}
      <div className="flex space-x-10 items-center">
        <Link to="/" className="text-sm font-semibold text-gray-300 hover:text-blue-400 transition-all duration-300 uppercase tracking-wide">
          Movies
        </Link>
        <Link to="/watchlist" className="text-sm font-semibold text-gray-300 hover:text-blue-400 transition-all duration-300 uppercase tracking-wide">
          Watchlist
        </Link>
        <Link to="/mood" className="text-sm font-semibold text-gray-300 hover:text-blue-400 transition-all duration-300 uppercase tracking-wide">
          Mood Selector
        </Link>
      </div>


    </nav>
  )
}

export default Navbar