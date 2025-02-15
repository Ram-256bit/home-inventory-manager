const express = require("express");
const cors = require("cors");
const PDFDocument = require("pdfkit"); 

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let users = [
  {
    id: 1,
    email: "user@example.com",
    password: "password",
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

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    res.json({ success: true, user: { id: user.id, email: user.email } });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

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

app.get("/houses", (req, res) => {
  res.json(["House 1", "House 2", "House 3"]);
});

app.get("/items", (req, res) => {
  const { house } = req.query;
  if (house) {
    res.json(items.filter((item) => item.house === house));
  } else {
    res.json(items);
  }
});

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

app.get("/reports", (req, res) => {
  res.json({ success: true, message: "Report generated" });
});

app.get("/backup", (req, res) => {
  res.json({ success: true, backup: items });
});

app.get("/reports/pdf", (req, res) => {
  const doc = new PDFDocument();
  let filename = "items-report.pdf";

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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
