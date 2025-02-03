import express, {Request, Response} from "express";
import { User } from "./db.js";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";

export const route = express.Router();

// ---- user routes -----

route.post('/auth/signup', async (req : Request, res : Response): Promise<void> => {
    try{
        const {username, password} = req.body
        if (!username || !password) {
            res.status(400).json({ message: "Username and Password are required" });
            return ;
        }
        const alreadyExist = await User.findOne({username})
        if(alreadyExist){
            res.status(401).json({
                message: "User with this name already exist"
            })
            return;
        }
        const hashPass = await bcrypt.hash(password, 10)
        await User.create({
            username,
            password: hashPass
        })
        res.status(200).json({
            success: true,
            message: "Account Created Successfully"
        })
        return

    }catch(err){
        console.log(err)
        res.status(500).json({
            message: "Error while Signing up"
        })
        return;
    }
})

route.post('/auth/login', async (req: Request, res: Response): Promise<void> => {
    try {
        const {username, password} = req.body;
        if(!username || !password){
            res.status(401).json({
                success: false,
                message: "Both field username and password required"
            })
            return ;
        }
        const existOrNot = await User.findOne({username})
        if(!existOrNot){
            res.status(404).json({
                success: false,
                message: "User not found with this username"
            })
            return ;
        }
        if(await bcrypt.compare(password, existOrNot.password)){
            const payload = {
                id: existOrNot._id
            };
            const token = jwt.sign(payload,'JWT_SECRET',{
                expiresIn: '3d',
            })
              res.status(200).json({
                success: true,
                msg: "Log In Successfully",
                token
              });
              return ;
        }else{
            res.status(401).json({
                success: false,
                message: "Wrong Password"
            })
            return;
        }

        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error while logging in"
        })
        return ;
    }
})