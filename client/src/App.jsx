import { useState, useEffect } from "react";
import {
  Search,
  PlusCircle,
  FileText,
  Settings,
  Box,
  Sun,
  Moon,
} from "lucide-react";

function Card({ children }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg">
      {children}
    </div>
  );
}

function CardContent({ children }) {
  return <div className="text-center">{children}</div>;
}

function Button({ children, className, onClick }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded ${className}`}>
      {children}
    </button>
  );
}

function Input({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
    />
  );
}

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const categories = [
    "Electronics",
    "Furniture",
    "Appliances",
    "Miscellaneous",
  ];
  const items = [
    { name: "Laptop", category: "Electronics" },
    { name: "Sofa", category: "Furniture" },
    { name: "Refrigerator", category: "Appliances" },
  ];

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-gray-600 text-white flex items-center gap-2"
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />} Toggle Mode
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button className="flex items-center gap-2 bg-blue-600 text-white">
          <Search size={16} /> Search
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {categories.map((category) => (
          <Card key={category}>
            <CardContent>
              <Box className="w-8 h-8 mx-auto mb-2 text-gray-600 dark:text-gray-300" />
              <p className="font-semibold">{category}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Inventory Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map((item, index) => (
            <Card key={index}>
              <CardContent>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.category}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <Button className="flex items-center gap-2 bg-green-600 text-white">
          <PlusCircle size={16} /> Add Item
        </Button>
        <Button className="flex items-center gap-2 bg-gray-600 text-white">
          <FileText size={16} /> Generate Report
        </Button>
        <Button className="flex items-center gap-2 bg-yellow-600 text-white">
          <Settings size={16} /> Settings
        </Button>
      </div>
    </div>
  );
}
