import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

interface AuthRequest extends Request {
    user?: any;
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
    try{
        const token = req.headers.authorization?.split(' ')[1];
        if(!token){
            res.status(404).json({
                success: false,
                message: 'Token not found'
            })
            return ;
        }
        try{
            const decode = jwt.verify(token, "JWT_SECRET")
            req.user = decode
        }catch(e){
            res.status(401).json({
                success: false,
                message: "Token is Invalid"
            })
            return;
        }
        next();
    }catch(err){
        res.status(500).json({
            success: false,
            message: "Error while fetching the token"
        })
    }
}

