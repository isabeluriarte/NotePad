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

app.post("/api/notes", (req, res) =>{
   
        let newNote = req.body;

        fs.readFile("./db/db.json", "utf8", function(err, data) {
            if (err) {
                newNote.id = 1;

                fs.writeFile("./db/db.json", JSON.stringify([newNote]), function(err) {
                    if (err) throw err;
                })

            } else {
                
                const noteData = JSON.parse(data);
                let lastID;
                if(noteData.length===0){
                    lastID =0;
                }
                else {
                    
                    lastID = noteData[noteData.length -1].id ;
                }
        
                newNote.id = lastID +1;
                noteData.push(newNote);

                fs.writeFile("./db/db.json", JSON.stringify(noteData), function(err) {
                    if (err) throw err;
                })
            }
    
            res.json(req.body);
        })
});

app.delete("/api/notes/:id", async (req, res) =>{
    try {
        let id = req.params.id;
     
        let data = await readFileAsync("./db/db.json", "utf8");
        data = JSON.parse(data);

        for (let i = 0; i < data.length; i++) {
        
            if (id == data[i].id) {
                data.splice(i, 1)
                console.log(data)
            }
        }

        await writeFileAsync("./db/db.json", JSON.stringify(data));
        res.send('DELETED!!')
    } 
    catch(err) {
        console.log(err);
    }
});

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });