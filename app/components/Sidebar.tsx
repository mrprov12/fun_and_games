"use client"; // Client component for Link usage

import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col space-y-4 p-4 bg-gray-700 w-1/4 h-screen text-white">
      <Link
        href="/sudoku"
        className={`py-3 px-4 text-left rounded-lg ${
          pathname === "/sudoku"
            ? "bg-blue-500 text-white"
            : "bg-gray-600 hover:bg-gray-500"
        }`}
      >
        Sudoku
      </Link>
      <Link
        href="/tictactoe"
        className={`py-3 px-4 text-left rounded-lg ${
          pathname === "/tictactoe"
            ? "bg-blue-500 text-white"
            : "bg-gray-600 hover:bg-gray-500"
        }`}
      >
        Tic-Tac-Toe
      </Link>
    </div>
  );
};

export default Sidebar;
