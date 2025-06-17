import express from 'express'
import userAuth from '../middleware/userAuth.js';
import { getUserData } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);  //http://localhost:3000/api/user/data

export default userRouter;