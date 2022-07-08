// import bcrypt from 'bcrypt';
// import { v4 as uuid} from 'uuid';
// import { authSignUpSchema, authLoginSchema } from '../schemas/authSchema.js';

// import '../index.js';


// export async function loginUser(request, response){

//     try {
//         const user = request.body;

//         const validate = authLoginSchema.validate(user);

//         if(validate.error){
//             return response.status(422).send('Email e senha obrigatórios');
//         }

//         const checkUser = await db.collection('users').findOne({email: user.email});

//         if(!checkUser){
//             return response.status(422).send('Email já cadastrado');
//         }

//         const decryptedPassword = bcrypt.compareSync(user.password, checkUser.password);

//         if(decryptedPassword){
//             const token = uuid();
//             await db.collection('sessions').insertOne({token, userId: checkUser._id});
//         }
//         return response.status(200).send('usuário logado');

//     } catch (error) {
//         response.status(500).send('Problema ao logar com usuário');
//     }
// }


// export async function signupUser(request, response){
//     try {
//         const newUser = request.body;

//         const validate = authSignUpSchema.validate(newUser);

//         if(validate.error){
//             return response.status(422).send('Todos os dados são obrigatórios');
//         }

//         const encryptedPassword = bcrypt.hashSync(newUser.password, 10);

//         await db.collection('users').insertOne({
//             name: newUser.name,
//             email: newUser.email,
//             password: encryptedPassword
//         });

//         response.status(200).send('Cadastro realizado');

//     } catch (error) {
//         return response.status(500).send('Erro ao cadastrar usuário');
//     }
// }
