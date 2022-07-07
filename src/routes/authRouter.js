import { Router } from "express";


const router = Router();

router.post('/login', loginUser);
router.post('/sign-up', creatUser);


export default router;