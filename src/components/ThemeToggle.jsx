// src/components/ThemeToggle.jsx

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

/**
* Dark Mode / Light Mode Toggle
* - Saves preference to localStorage
* - Applies Tailwind 'dark' class to <html> tag
*/

export default function ThemeToggle() {
 const [theme, setTheme] = useState(() => {
   return localStorage.getItem("theme") || "light";
 });

 // Apply theme to <html> class
 useEffect(() => {
   const root = document.documentElement;

   if (theme === "dark") {
     root.classList.add("dark");
   } else {
     root.classList.remove("dark");
   }

   localStorage.setItem("theme", theme);
 }, [theme]);

 // Toggle theme
 const toggleTheme = () => {
   setTheme(theme === "light" ? "dark" : "light");
 };

 return (
   <button
     onClick={toggleTheme}
     className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 shadow"
   >
     {theme === "light" ? (
       <Sun className="w-5 h-5 text-yellow-600" />
     ) : (
       <Moon className="w-5 h-5 text-gray-300" />
     )}
   </button>
 );
}