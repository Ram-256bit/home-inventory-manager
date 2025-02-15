const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Dummy in-memory data stores
let users = [
  {
    id: 1,
    email: "user@example.com",
    password: "password", // In production, NEVER store plain text passwords.
  },
];

let items = [
  {
    id: 1,
    name: "Sofa",
    category: "Furniture",
    description: "Comfortable sofa",
    photo: "https://via.placeholder.com/100",
    house: "House 1",
  },
  {
    id: 2,
    name: "TV",
    category: "Electronics",
    description: "42 inch TV",
    photo: "https://via.placeholder.com/100",
    house: "House 1",
  },
];

// Routes

// Login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    res.json({ success: true, user: { id: user.id, email: user.email } });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// Signup route
app.post("/signup", (req, res) => {
  const { email, password } = req.body;
  if (users.find((u) => u.email === email)) {
    return res
      .status(400)
      .json({ success: false, message: "Email already exists" });
  }
  const newUser = { id: Date.now(), email, password };
  users.push(newUser);
  res.json({ success: true, user: { id: newUser.id, email: newUser.email } });
});

// Get houses route (dummy list)
app.get("/houses", (req, res) => {
  res.json(["House 1", "House 2", "House 3"]);
});

// Get items route
// Optionally filter by house using query param: /items?house=House%201
app.get("/items", (req, res) => {
  const { house } = req.query;
  if (house) {
    res.json(items.filter((item) => item.house === house));
  } else {
    res.json(items);
  }
});

// Add item route
app.post("/items", (req, res) => {
  const { name, category, description, photo, house } = req.body;
  if (!name || !category || !description || !photo || !house) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }
  const newItem = { id: Date.now(), name, category, description, photo, house };
  items.push(newItem);
  res.json({ success: true, item: newItem });
});

// Generate report route (dummy)
app.get("/reports", (req, res) => {
  // In a real-world scenario, you might generate a PDF or CSV.
  res.json({ success: true, message: "Report generated" });
});

// Backup route (returns current items)
app.get("/backup", (req, res) => {
  res.json({ success: true, backup: items });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
