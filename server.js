const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const USER_ROLES_FILE = path.join(__dirname, "public", "user_roles.json");

// Read roles
app.get("/api/roles", async (req, res) => {
  try {
    const data = await fs.readFile(USER_ROLES_FILE, "utf8");
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: "Error reading roles" });
  }
});

// Create role
app.post("/api/roles", async (req, res) => {
  try {
    const data = await fs.readFile(USER_ROLES_FILE, "utf8");
    const roles = JSON.parse(data);
    const newRole = {
      ...req.body,
      id: Math.max(...roles.map((r) => r.id), 0) + 1,
      created_on: new Date().toISOString(),
      modified_on: new Date().toISOString(),
      users: [],
    };
    roles.push(newRole);
    await fs.writeFile(USER_ROLES_FILE, JSON.stringify(roles, null, 2));
    res.status(201).json(newRole);
  } catch (error) {
    res.status(500).json({ error: "Error creating role" });
  }
});

// Update role
app.put("/api/roles/:id", async (req, res) => {
  try {
    const data = await fs.readFile(USER_ROLES_FILE, "utf8");
    let roles = JSON.parse(data);
    const index = roles.findIndex((r) => r.id === parseInt(req.params.id));
    if (index !== -1) {
      roles[index] = {
        ...roles[index],
        ...req.body,
        modified_on: new Date().toISOString(),
      };
      await fs.writeFile(USER_ROLES_FILE, JSON.stringify(roles, null, 2));
      res.json(roles[index]);
    } else {
      res.status(404).json({ error: "Role not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating role" });
  }
});

// Delete role
app.delete("/api/roles/:id", async (req, res) => {
  try {
    const data = await fs.readFile(USER_ROLES_FILE, "utf8");
    let roles = JSON.parse(data);
    roles = roles.filter((r) => r.id !== parseInt(req.params.id));
    await fs.writeFile(USER_ROLES_FILE, JSON.stringify(roles, null, 2));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error deleting role" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
