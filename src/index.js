import express, { request, response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import joi from "joi";
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from 'bcrypt';
import { v4 as uuid} from 'uuid';

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

server.post('/login', async (request, response) => {
    const user = request.body;
    const authLoginSchema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required()
    });
    const validate = authLoginSchema.validate(user);
    if(validate.error){
        return response.status(422).send('Email e senha obrigatórios');
    }
    const checkUser = await db.collection('users').findOne({email: user.email});
    if(!checkUser){
        return response.status(422).send('Email já cadastrado');
    }
    try {
        const decryptedPassword = bcrypt.compareSync(user.password, checkUser.password);
        if(decryptedPassword){
            const token = uuid();
            await db.collection('sessions').insertOne({token, userId: checkUser._id});
        }
        return response.status(200).send('usuário logado');
    } catch (error) {
        console.error('Houve um problema ao logar o usuário');
        response.status(500).send('Problema ao logar com usuário');
    }
});

server.post('/sign-up', async (request, response) => {
    const newUser = request.body;

    const authSignUpSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
        confirmPassword: joi.ref('password')
    });

    const validate = authSignUpSchema.validate(newUser);

    if(validate.error){
        return response.status(422).send('Todos os dados são obrigatórios');
    }

    try {
        const encryptedPassword = bcrypt.hashSync(newUser.password, 10);
        await db.collection('users').insertOne({
            name: newUser.name,
            email: newUser.email,
            password: encryptedPassword
        });

        response.status(200).send('Cadastro realizado');

    } catch (error) {
        return response.status(500).send('Erro ao cadastrar usuário');
    }
});

server.post('/categories-products', async (request, response) => {
    const product = request.body;

    const authLoginSchema = joi.object({
        name: joi.string().required(),
        category: joi.string().required(),
        image: joi.string().required(),
        price: joi.number().required(),
        brand: joi.string().required(),
    });
    const validate = authLoginSchema.validate(product);

    if(validate.error){
        return response.status(422).send('Dados dos produtos obrigatórios');
    }
    try {
        await db.collection('products').insertOne({
            name: product.name,
            category: product.category,
            image: product.image,
            price: product.price,
            brand: product.brand,
        }).toArray();
        response.status(200).send('produtos inseridos');
    } catch (error) {
        return response.status(500).send('Erro ao inserir produtos');
    }
});


server.get('/categories-products-Celulares', async (request, response) => {

    try {
        const products = await db.collection('products').find({
            category: "Celulares",
        }).toArray();
        response.send(products);
      } catch (error) {
        console.error({ error });
        response.status(500).send('Não foi possível pegar os produtos');
      }
});

server.get('/categories-products-Laptops', async (request, response) => {
    
    try {
        const products = await db.collection('products').find({
            category: "Laptops",
        }).toArray();
        response.send(products);
      } catch (error) {
        console.error({ error });
        response.status(500).send('Não foi possível pegar os produtos');
      }
});

server.get('/categories-products-Fones', async (request, response) => {
    
    try {
        const products = await db.collection('products').find({
            category: "Fones"
        }).toArray();
        response.send(products);
      } catch (error) {
        console.error({ error });
        response.status(500).send('Não foi possível pegar os produtos');
      }
});

server.get('/categories-products-Impressoras', async (request, response) => {
    
    try {
        const products = await db.collection('products').find({
            category: "Impressoras"
        }).toArray();
        response.send(products);
      } catch (error) {
        console.error({ error });
        response.status(500).send('Não foi possível pegar os produtos');
      }
});
server.get('/categories-products-Telescopio', async (request, response) => {
    
    try {
        const products = await db.collection('products').find({
            category: "Telescopio"
        }).toArray();
        response.send(products);
      } catch (error) {
        console.error({ error });
        response.status(500).send('Não foi possível pegar os produtos');
      }
});
server.get('/categories-products-Jogos', async (request, response) => {
    
    try {
        const products = await db.collection('products').find({
            category: "Jogos"
        }).toArray();
        response.send(products);
      } catch (error) {
        console.error({ error });
        response.status(500).send('Não foi possível pegar os produtos');
      }
});
server.get('/categories-products-SmartWatch', async (request, response) => {
    
    try {
        const products = await db.collection('products').find({
            category: "SmartWatch"
        }).toArray();
        response.send(products);
      } catch (error) {
        console.error({ error });
        response.status(500).send('Não foi possível pegar os produtos');
      }
});

server.post('/choosenProduct', async (request, response) => {
    const {productId} = request.body;
    try {
        const product = await db.collection('products').findOne({ _id: ObjectId(productId) });
        response.status(200).send({product});
        
    } catch (error) {
        return response.status(500).send('Erro ao pegar produtos');
    }
});


server.post("/buy", async (request, response) => {
    let item = request.body;
    const buySchema = joi.object({
        name: joi.string().required(),
        image: joi.string().uri().required(),
        price: joi.string().required(),
        quantity: joi.string().required(),
    });
    let validation = buySchema.validate(item);

    if (!validation) {
        response.send(400);
        return;
    };
    try {
        await db.collection("buying").insertOne({
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity
        });
        response.status(201).send("Item colocado no carrinho com sucesso");
    } catch {
        response.status(400).send("Algo deu errado na hora de colocar no carrinho");
    } 
});

server.get("/buy", async (request, response) => {
    let items = await db.collection("buying").find({}).toArray();
    response.send(items);
});

server.get("/buyingvalue", async(request, response) => {
    let price = 0;
    let items = await db.collection("buying").find({}).toArray();
    items.map(object => {
        let newPrice = object.price.replace(".", "");
        newPrice = newPrice.replace(",", ".");
        price = price + object.quantity*(Number(newPrice));
    });
    response.json({price});
});

server.put("/update", async (request, response) => {
    let item = request.body;
    console.log(item);
    try {
		
		const itemDB = await db.collection("buying").findOne({
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity
        });
		if(!itemDB) {
            response.sendStatus(404);
            return;
        }
        await db.collection("buying").updateOne({ _id: itemDB._id}, { $set: { quantity: item.newQuantity }});
        
		response.sendStatus(200);
		
	 } catch (error) {
	  res.status(500).send(error)
		
	 }
    
});

server.delete("/buy", async (request, response) => {
    try {
        const itemDB = await db.collection("buying").deleteMany({});
        response.status(202).send("Itens deletados com sucesso!");
    } catch {
        response.status(405).send("Itens deletados com sucesso!");
    }
    
})


const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log("Servidor rodando..."));