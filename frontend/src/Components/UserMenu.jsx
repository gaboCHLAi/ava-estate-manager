import { Link } from "react-router-dom";
export default function UserMenu() {
  return (
    <div>
      <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
        <Link to="/myCards">
          <span className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
            ჩემი განცხადებები
          </span>
        </Link>
        <Link
          to="/profile"
          className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
        >
          პროფილი
        </Link>
        <div className="border-t">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
          >
            გასვლა
          </button>
        </div>
      </div>
    </div>
  );
}
