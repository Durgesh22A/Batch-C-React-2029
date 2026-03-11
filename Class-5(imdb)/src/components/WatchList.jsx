import React from "react";

function WatchList() {
  return (
    <div className="rounded-lg border border-gray-200 m-8 overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse bg-white text-sm text-gray-500">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 font-medium text-gray-900">Poster</th>
            <th className="px-6 py-4 font-medium text-gray-900">Name</th>
            <th className="px-6 py-4 font-medium text-gray-900">Ratings</th>
            <th className="px-6 py-4 font-medium text-gray-900">Popularity</th>
            <th className="px-6 py-4 font-medium text-gray-900">Genre</th>
            <th className="px-6 py-4 font-medium text-gray-900">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 border-t border-gray-100">
          <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4">
              <img 
                className="h-20 w-14 object-cover rounded-md shadow-sm" 
                src="https://m.media-amazon.com/images/I/81IfoBox2TL._AC_UF894,1000_QL80_.jpg" 
                alt="poster" 
              />
            </td>
            <td className="px-6 py-4 font-medium text-gray-900"></td>
            <td className="px-6 py-4"></td>
            <td className="px-6 py-4"></td>
            <td className="px-6 py-4">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">
              
              </span>
            </td>
            <td className="px-6 py-4">
              <button className="font-medium text-red-600 hover:text-red-800 transition-colors cursor-pointer">
                Delete
              </button>
            </td>
          </tr>
          
          {/* Repeat <tr> for more items */}
        </tbody>
      </table>
    </div>
  );
}

export default WatchList;