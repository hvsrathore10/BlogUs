import express from 'express';
const router = express.Router();
import { body, validationResult } from 'express-validator'; //validation for username,email & password
import bcrypt from 'bcryptjs'; //package use for hashing of password(for user protection)
import jwt from 'jsonwebtoken'; //json web token(JWT)
import User from '../models/User.js';
import fetchuser from '../middleware/fetchuser.js';


const JWT_SECRET = 'Harsh&VERIFYSIGNATURE';  //specify verification signature


//ROUTE 1: Create a User using: POST "/api/v1/auth/createuser"  -- no login required 
router.post('/createuser' , [
    body('name','Name must have atleast 3character').isLength({min: 3}),
    body('email','Inter valid email').isEmail(),
    body('password','Use Stronge').isLength({min: 5})
] , async (req,res)=>{

    let success = false;

    //If there are errors, return Bed Reqiust and the errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    //try-catch if server not work
    try {
        //check weather the user with this email exit
        let user = await User.findOne({email: req.body.email});
        if(user){
            return res.status(400).json({error: "User already exit!"})
        } 

        //create a new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: safePass
        })
        const data = {
            user: {
                id: user.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success: success,authToken: authToken});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Error occured");
    }
})

//ROUTE 2: Authenticate a User using: POST "/api/v1/auth/login"  -- no login required 
router.post('/login' , [
    body('email','custom msg').isEmail(),
    body('password').exists()
] , async (req,res)=>{

    let success = false;
    
    //If there are errors, return Bed Reqiust and the errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    //try-catch to check weather entered user information are correct such as email and password
    const {email,password} = req.body;
    try {
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error: "Please try to login with correct credentials"});
        }

        let comparePassword = await bcrypt.compare(password,user.password);
        if(!comparePassword){
            return res.status(400).json({error: "Please try to login with correct credentials"});
        }
        //payload -- user information from database
        const data = {
            user: {
                id: user.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success: success,authToken: authToken});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Error occured");
    }
})

// ROUTE 3:Get loggedin user detail Using POST "/api/v1/auth/getuser" ,Login required
router.post('/getuser', fetchuser, async (req,res)=>{
    try {
        const userId = req.user.id
        let user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Error occured");
    }
}) 
export default router