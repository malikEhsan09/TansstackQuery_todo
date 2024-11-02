import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

const app = express();
const PORT = 8800;

app.use(cors());
app.use(bodyParser.json());

const db = new Array();

app.get("/", (req, res) => {
  res.send("hellow world");
});

app.get("/todo", (req, res) => {
  const items = db;
  return res.json({ status: "success", data: items });
});

app.post('/todo/mark-complete', (req, res) => {
    const { id } = req.body;
    const itemIndex = db.findIndex((e) => e.id === id);

    if (itemIndex === -1) {
        return res.json({ status: "error" });
    }

    db[itemIndex].isCompleted = true;
    return res.json({ status: "success" });
});


app.post("/todo/create", (req, res) => {
    console.log("server creating new todo");
    const { title = "Untitled Todo" } = req.body; 
    const id = uuidv4();
    const item = {
        id,
        title,
        isCompleted: false,
    };
    db.push(item);
    return res.json({ status: "success", data: item });
});



// Listen and start the server
app.listen(PORT, ()=>{
    console.log("Server is listening on port :", PORT)
})