const express = require("express");
const cors = require("cors");
const multer = require("multer");
const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Setup Multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "./uploads";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

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

// Get items route (optionally filtered by house)
app.get("/items", (req, res) => {
  const { house } = req.query;
  if (house) {
    res.json(items.filter((item) => item.house === house));
  } else {
    res.json(items);
  }
});

// Add item route with file upload support
app.post("/items", upload.single("photo"), (req, res) => {
  const { name, category, description, house } = req.body;
  if (!name || !category || !description || !house) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  // If a photo is uploaded, construct its URL; otherwise, use a placeholder.
  let photoUrl = "https://via.placeholder.com/100";
  if (req.file) {
    photoUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  }

  const newItem = {
    id: Date.now(),
    name,
    category,
    description,
    photo: photoUrl,
    house,
  };
  items.push(newItem);
  res.json({ success: true, item: newItem });
});

// PDF Report Endpoint: Generates a PDF containing all items details
app.get("/reports/pdf", (req, res) => {
  const doc = new PDFDocument();
  const filename = "items-report.pdf";

  res.setHeader(
    "Content-disposition",
    'attachment; filename="' + filename + '"',
  );
  res.setHeader("Content-type", "application/pdf");

  doc.pipe(res);
  doc.fontSize(20).text("Items Report", { align: "center" });
  doc.moveDown();

  items.forEach((item) => {
    doc.fontSize(12).text(`Name: ${item.name}`);
    doc.fontSize(12).text(`Category: ${item.category}`);
    doc.fontSize(12).text(`Description: ${item.description}`);
    doc.fontSize(12).text(`Photo URL: ${item.photo}`);
    doc.moveDown();
  });

  doc.end();
});

// Backup route (returns current items)
app.get("/backup", (req, res) => {
  res.json({ success: true, backup: items });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
