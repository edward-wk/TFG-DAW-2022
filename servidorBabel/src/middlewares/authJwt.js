import jwt from "jsonwebtoken";
import config from "../config";
import User from "../models/User";
import Role from "../models/Role";

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers["authorization"]
        const tokenString = token.split(' ')[1];

        let decoded;
        try{
            decoded = jwt.verify(tokenString, config.SECRET, null, null);
        }catch (e) {
            return res.status(200).json([{message: 'No tienes permiso'}])
        }

        req.userId = decoded.id;
        const user = await User.findById(req.userId)

        if (!user) return res.status(200).json({message: 'User not found'})

        next()
    } catch (e) {
        return res.status(200).json({message: 'No token'})
    }
}

export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId)
        const rolesBD = await Role.find({_id: {$in: user.roles}})

        if (rolesBD.findIndex(i => i.name === 'admin') === -1) return res.status(500).json({message: 'No admin'})

        next()
    } catch (e) {
        return res.status(200).json('error');
    }
}

export const getRoles = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        const rolesBD = await Role.find({_id: {$in: user.roles}})

        const roles = [];

        for (let a of rolesBD){
            roles.push(a.name)
        }

        return res.status(200).json(roles);
    } catch (e) {
        return res.status(200).json(e);
    }
}