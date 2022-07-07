import bcrypt from 'bcrypt';
import { v4 as uuid} from 'uuid';
import { authSignUpSchema, authLoginSchema } from '../schemas/authSchema';

import '../index';


export async function loginUser(req, res){

    try {
        const user = req.body;

        const validate = authLoginSchema.validate(user);

        if(validate.error){
            return res.status(422).send('Email e senha obrigatórios');
        }

        const checkUser = await db.collection('users').findone({email: user.email});

        if(!checkUser){
            return res.status(422).send('Email já cadastrado');
        }

        const decryptedPassword = bcrypt.compareSync(user.password, checkUser.password);

        if(decryptedPassword){
            const token = uuid();
            await db.collection('sessions').insertOne({token, userId: checkUser._id});
        }
        return res.status(200).send('usuário logado');

    } catch (error) {
        res.status(500).send('Problema ao logar com usuário');
    }
}


export async function signupUser(req, res){
    try {
        const newUser = req.body;

        const validate = authSignUpSchema.validate(newUser);

        if(validate.error){
            return res.status(422).send('Todos os dados são obrigatórios');
        }

        const encryptedPassword = bcrypt.hashSync(newUser.password, 10);

        await db.collection('users').insertOne({
            name: newUser.name,
            email: newUser.email,
            password: encryptedPassword
        });

        res.status(200).send('Cadastro realizado');

    } catch (error) {
        return res.status(500).send('Erro ao cadastrar usuário');
    }
}
