import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';

export const register = async (req, res) => {

    const { name, email, password } = req.body;

    if ( !name || !email || !password ){
        return res.json({success: false, message: 'Missing Details'})
    }

    try {
        const existingUser = await userModel.findOne({ email });   //check if user already exists
        if (existingUser) {
            return res.json({success: false, message: 'User already exists'})
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);  //encrypt password using bcrypt

        const user = new userModel({ name, email, password: hashedPassword})  //created new userModel instance
        await user.save();  //save new userModel

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5d' });   

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',   //strict for Local Storage, null for Live Server
            maxAge: 5 * 24 * 60 * 60 * 1000   // 5 days in milliseconds
        });

        //sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Our Service',
            text: `Hello ${name},\n\nThank you for registering with us! We're excited to have you on board.\n\nBest regards,\nService Team`
        }

        await transporter.sendMail(mailOptions);

        return res.json({success: true});  //user successfully registered
    
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}


export const login = async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        return res.json({success: false, message: 'Email and password required'})
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({success: false, message: 'Invalid email'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({success: false, message: 'Invalid password'});
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',   //strict for Local Storage, null for Live Server
            maxAge: 5 * 24 * 60 * 60 * 1000   // 5 days in milliseconds
        });

        return res.json({success: true});  //user successfully logged in

    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}


export const logout = async (req, res) => {

    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',   //strict for Local Storage, null for Live Server
        });

        return res.json({success: true, message: 'Logged out successfully'});

    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

//send verification OTP to user's email
export const sendVerifyOtp = async (req, res) => {
    //const { email } = req.body;

    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);
        if (user.isAccountVerified) {
            return res.json({ success: false, message: 'Account already verified' });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000)); //Generate a 6-digit OTP
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
        await user.save();

        const mailOption = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Verify Your Account',
            text: `Your verification OTP is ${otp}. It is valid for 10 minutes.`
        }
        await transporter.sendMail(mailOption);
        res.json({ success: true, message: 'OTP sent to your email' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;

    if(!userId || !otp) {
        return res.json({ success: false, message: 'User ID and OTP are required' });
    }

    try {
        const user = await userModel.findById(userId);

        if(!user){
            return res.json({success: false, message: 'User not found'});
        }

        if(user.verifyOtp === '' || user.verifyOtp !== otp){
            return res.json({success: false, message: 'Invalid OTP'});
        }

        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({success: false, message: 'OTP Expired'});
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;
        await user.save();
        return res.json({ success: true, message: 'Account verified successfully' });
        
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}


export const isAuthenticated = async (req, res) => {
    try {
        return res.json({success: true});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}


// Send password reset OTP
export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: 'Email is required' });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000)); // Generate a 6-digit OTP
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
        await user.save();

        const mailOption = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset OTP',
            text: `Your password reset OTP is ${otp}. It is valid for 10 minutes.`
        };
        await transporter.sendMail(mailOption);
        res.json({ success: true, message: 'OTP sent to your email' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Reset password using OTP
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: 'Email, OTP and new password are required' });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        if (user.resetOtp === '' || user.resetOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: 'OTP Expired' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;
        await user.save();

        return res.json({ success: true, message: 'Password reset successfully' });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}