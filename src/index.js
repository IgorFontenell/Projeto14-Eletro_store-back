import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const server = express();
server.use([express.json(), cors()]);

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

function mongoConection() {
    mongoClient.connect().then(() => {
        db = mongoClient.db("EletroStoreDB"); // Conectamos à coleção "meu_lindo_banco".
      });
}
mongoConection();

server.get("/main", async (request, response) => {
    const items = await db.collection("items").find().toArray();
    


    response.send(items);
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log("Servidor rodando..."));