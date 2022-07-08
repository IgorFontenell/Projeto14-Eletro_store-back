import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import joi from "joi";
import { MongoClient } from "mongodb";

dotenv.config();

const server = express();
server.use(express.json());
server.use(cors());

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

function mongoConection() {
    mongoClient.connect().then(() => {
        db = mongoClient.db("EletroStoreDB"); 
      });
}
mongoConection();
//Necessário uma verificação se é o usuário mesmo ainda a ser feita!
server.get("/items", async (request, response) => {



    
    const items = await db.collection("items").find().toArray();
    
    response.send(items);
});

server.post("/stock", async (request, response) => {
    const item = request.body;
    const itemSchema = joi.object({
        name: joi.string().required(),
        price: joi.number().required(),
        description: joi.string().required(),
        class: joi.string().required(),
        image: joi.string().uri().required()
    });

    const validation = itemSchema.validate(item);
    if(!validation) {
        response.status(400).send("Item mal cadastrado!");
        return;
    }
    await db.collection("items").insertOne({
        name: item.name,
        price: item.price,
        description: item.description,
        class: item.class,
        image: item.image
    });
    response.status(201).send("Item cadastrado com sucesso!");

});
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log("Servidor rodando..."));