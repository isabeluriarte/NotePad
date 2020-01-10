const express = require("express")
const mySQL = require("mysql")
const path = require("path")

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "notes.html"));
});

// app.post()

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });