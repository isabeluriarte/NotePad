const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

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

app.get("/api/notes", (req, res) =>{
    fs.readFile("./db/db.json", "utf8", function(err, data){
        if (err) {
            res.send(err)
        }
        res.json(JSON.parse(data))
    })
});

app.post("/api/notes", async (req, res) =>{
    try {
        let newNote = req.body;

        let data = await readFileAsync("./db/db.json", "utf8");
        if (data){
            data = JSON.parse(data);

            const lastID = data[data.length -1].id;
    
            newNote.id = lastID +1;
        } else {
            newNote.id = 1;
        };


        console.log(newNote)

        data.push(newNote);
        await writeFileAsync("./db/db.json", JSON.stringify(data));
        res.json(req.body);
    } 
    catch(err) {
        console.log(err);
    }
});

app.delete("/api/notes/:id", async (req, res) =>{
    try {
        let id = req.params.id;
        console.log("id: ", id)
        let data = await readFileAsync("./db/db.json", "utf8");
        data = JSON.parse(data);
        data.push(req.body);
        await writeFileAsync("./db/db.json", JSON.stringify(data));
        res.json(req.body);
    } 
    catch(err) {
        console.log(err);
    }
});

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });