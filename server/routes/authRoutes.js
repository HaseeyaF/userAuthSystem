import express from 'express';
import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail } from '../controllers/authControllers.js';
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();   //create a new router instance

authRouter.post('/register', register);  //http://localhost:3000/api/auth/register
authRouter.post('/login', login);  //http://localhost:3000/api/auth/login
authRouter.post('/logout', logout);  //http://localhost:3000/api/auth/logout
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);  //http://localhost:3000/api/auth/send-verify-otp
authRouter.post('/verify-account', userAuth, verifyEmail); 
authRouter.post('/is-auth', userAuth, isAuthenticated);  
authRouter.post('/send-reset-otp', sendResetOtp);  //http://localhost:3000/api/auth/send-reset-otp
authRouter.post('/reset-password', resetPassword);  //http://localhost:3000/api/auth/reset-password

export default authRouter;  