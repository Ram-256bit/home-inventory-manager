import React, { useState, useEffect } from "react";

const BASE_URL = "http://localhost:5000";

function App() {
  const [view, setView] = useState("login");
  const [user, setUser] = useState(null);
  const [house, setHouse] = useState(null);
  const [items, setItems] = useState([]);

  // When the dashboard is active and a house is selected, fetch its items
  useEffect(() => {
    if (view === "dashboard" && house) {
      fetchItems();
    }
  }, [view, house]);

  const fetchItems = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/items?house=${encodeURIComponent(house)}`,
      );
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setView("selectHouse");
  };

  const handleHouseSelect = (selectedHouse) => {
    setHouse(selectedHouse);
    setView("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setHouse(null);
    setItems([]);
    setView("login");
  };

  const addItem = async (newItem) => {
    try {
      const payload = { ...newItem, house };
      const res = await fetch(`${BASE_URL}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) {
        fetchItems();
        setView("dashboard");
      } else {
        alert(result.message || "Error adding item");
      }
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Navigation onLogout={handleLogout} setView={setView} />
      {view === "login" && <Login onLogin={handleLogin} setView={setView} />}
      {view === "signup" && <Signup onSignup={handleLogin} setView={setView} />}
      {view === "selectHouse" && (
        <HouseSelection onSelect={handleHouseSelect} />
      )}
      {view === "dashboard" && <Dashboard house={house} items={items} />}
      {view === "addItem" && <AddItem addItem={addItem} />}
      {view === "reports" && <ReportGenerator />}
      {view === "settings" && <Settings />}
      {view === "backup" && <Backup />}
    </div>
  );
}

function Navigation({ onLogout, setView }) {
  return (
    <nav className="flex flex-wrap gap-2 mb-4">
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => setView("dashboard")}
      >
        Dashboard
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => setView("addItem")}
      >
        Add Item
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => setView("reports")}
      >
        Reports
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => setView("settings")}
      >
        Settings
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => setView("backup")}
      >
        Backup
      </button>
      <button
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        onClick={onLogout}
      >
        Logout
      </button>
    </nav>
  );
}

function Login({ onLogin, setView }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        onLogin(data.user);
      } else {
        const errData = await res.json();
        alert(errData.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded p-6">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border border-gray-300 p-2 rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full border border-gray-300 p-2 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          type="submit"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-center">
        Don't have an account?{" "}
        <button
          className="text-blue-500 hover:underline"
          onClick={() => setView("signup")}
        >
          Signup
        </button>
      </p>
    </div>
  );
}

function Signup({ onSignup, setView }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        onSignup(data.user);
      } else {
        const errData = await res.json();
        alert(errData.message || "Signup failed");
      }
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded p-6">
      <h2 className="text-2xl font-bold mb-4">Signup</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border border-gray-300 p-2 rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full border border-gray-300 p-2 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          type="submit"
        >
          Signup
        </button>
      </form>
      <p className="mt-4 text-center">
        Already have an account?{" "}
        <button
          className="text-blue-500 hover:underline"
          onClick={() => setView("login")}
        >
          Login
        </button>
      </p>
    </div>
  );
}

function HouseSelection({ onSelect }) {
  const [houses, setHouses] = useState([]);
  const [selectedHouse, setSelectedHouse] = useState("");

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const res = await fetch(`${BASE_URL}/houses`);
        const data = await res.json();
        setHouses(data);
      } catch (error) {
        console.error("Error fetching houses:", error);
      }
    };
    fetchHouses();
  }, []);

  const handleSelect = () => {
    if (selectedHouse) {
      onSelect(selectedHouse);
    } else {
      alert("Please select a house.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded p-6">
      <h2 className="text-2xl font-bold mb-4">Select House</h2>
      <select
        className="w-full border border-gray-300 p-2 rounded"
        value={selectedHouse}
        onChange={(e) => setSelectedHouse(e.target.value)}
      >
        <option value="">Select a house</option>
        {houses.map((house, index) => (
          <option key={index} value={house}>
            {house}
          </option>
        ))}
      </select>
      <button
        className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        onClick={handleSelect}
      >
        Select
      </button>
    </div>
  );
}

function Dashboard({ house, items }) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Dashboard for {house}</h2>
      <div className="grid gap-4">
        <Search items={items} />
        <CategoryBrowser items={items} />
        <ItemList items={items} />
      </div>
    </div>
  );
}

function Search({ items }) {
  const [query, setQuery] = useState("");
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="bg-white shadow p-4 rounded">
      <h3 className="text-xl font-semibold mb-2">Search Items</h3>
      <input
        className="w-full border border-gray-300 p-2 rounded mb-4"
        type="text"
        placeholder="Search items..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ItemList items={filteredItems} />
    </div>
  );
}

function CategoryBrowser({ items }) {
  const categories = Array.from(new Set(items.map((item) => item.category)));
  const [selectedCategory, setSelectedCategory] = useState("");
  const filteredItems = selectedCategory
    ? items.filter((item) => item.category === selectedCategory)
    : items;

  return (
    <div className="bg-white shadow p-4 rounded mt-4">
      <h3 className="text-xl font-semibold mb-2">Browse by Category</h3>
      <select
        className="w-full border border-gray-300 p-2 rounded mb-4"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">All Categories</option>
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>
      <ItemList items={filteredItems} />
    </div>
  );
}

function ItemList({ items }) {
  return (
    <div className="mt-4">
      <h3 className="text-xl font-semibold mb-2">Item List</h3>
      <div className="flex flex-wrap gap-4">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function ItemCard({ item }) {
  return (
    <div className="border border-gray-300 rounded p-4 w-40">
      <img className="w-full h-auto mb-2" src={item.photo} alt={item.name} />
      <h4 className="font-semibold">{item.name}</h4>
      <p>{item.description}</p>
      <p className="italic text-sm">{item.category}</p>
    </div>
  );
}

function AddItem({ addItem }) {
  const [item, setItem] = useState({
    name: "",
    description: "",
    category: "",
    photo: "",
  });

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addItem(item);
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded p-6">
      <h2 className="text-2xl font-bold mb-4">Add New Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border border-gray-300 p-2 rounded"
          name="name"
          type="text"
          placeholder="Item Name"
          value={item.name}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border border-gray-300 p-2 rounded"
          name="description"
          type="text"
          placeholder="Description"
          value={item.description}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border border-gray-300 p-2 rounded"
          name="category"
          type="text"
          placeholder="Category"
          value={item.category}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border border-gray-300 p-2 rounded"
          name="photo"
          type="text"
          placeholder="Photo URL"
          value={item.photo}
          onChange={handleChange}
          required
        />
        <button
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          type="submit"
        >
          Add Item
        </button>
      </form>
    </div>
  );
}

function ReportGenerator() {
  const generateReport = async (format) => {
    try {
      const res = await fetch(`${BASE_URL}/reports`);
      const data = await res.json();
      alert(data.message);
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded p-6">
      <h2 className="text-2xl font-bold mb-4">Generate Reports</h2>
      <div className="flex gap-4">
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => generateReport("PDF")}
        >
          Generate PDF
        </button>
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => generateReport("CSV")}
        >
          Generate CSV
        </button>
      </div>
    </div>
  );
}

function Settings() {
  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded p-6">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <p>Update your preferences and app configurations.</p>
    </div>
  );
}

function Backup() {
  const backupData = async () => {
    try {
      const res = await fetch(`${BASE_URL}/backup`);
      const data = await res.json();
      alert("Backup data retrieved. Check console for details.");
      console.log(data.backup);
    } catch (error) {
      console.error("Error fetching backup:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded p-6">
      <h2 className="text-2xl font-bold mb-4">Create Backup</h2>
      <button
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        onClick={backupData}
      >
        Backup Now
      </button>
    </div>
  );
}

export default App;
