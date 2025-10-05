const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  fs.readdir(path.join(__dirname, "files"), (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return res.status(500).send("Server error");
    }
    res.render("index", { files });
  });
});

app.get("/file/:filename", (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, "files", filename);
  fs.readFile(filepath, "utf-8", (err, filedata) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(404).send("File not found");
    }
    res.render("show", { filename, filedata });
  });
});

app.get("/edit/:filename", (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, "files", filename);
  fs.readFile(filepath, "utf-8", (err, filedata) => {
    if (err) {
      console.error("Error reading file for edit:", err);
      return res.status(404).send("File not found");
    }
    res.render("edit", { filename, filedata });
  });
});

app.post("/edit", (req, res) => {
  const prev = req.body.previous;   // e.g. "myfile.txt"
  const newName = req.body.newName; // e.g. "myNewName.txt"
  if (!prev || !newName) {
    return res.status(400).send("Invalid rename request");
  }

  const oldPath = path.join(__dirname, "files", prev);
  const newPath = path.join(__dirname, "files", newName);

  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      console.error("Rename error:", err);
      // you could render an error page or flash a message
      return res.status(500).send("Error renaming file");
    }
    res.redirect("/");
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});
