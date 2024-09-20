"use client"; // Ensure this is a Client Component

import Link from "next/link"; // Import Link for navigation
import { usePathname } from "next/navigation"; // Hook to access current path

const Tabs = () => {
  const pathname = usePathname();

  return (
    <div className="w-full">
      <div className="flex justify-center space-x-4">
        <Link
          href="/sudoku"
          className={`py-2 px-4 ${
            pathname === "/sudoku" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Sudoku
        </Link>
        <Link
          href="/tictactoe"
          className={`py-2 px-4 ${
            pathname === "/tictactoe" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Tic-Tac-Toe
        </Link>
      </div>
    </div>
  );
};

export default Tabs;
