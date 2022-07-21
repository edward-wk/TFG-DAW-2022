import User from "../models/User";
import jwt from 'jsonwebtoken'
import config from '../config'
import Role from "../models/Role";

export const signUp = async (req, res) => {
    try {
        const {username, email, password, roles} = req.body;

        const newUser = new User({
            username,
            email,
            password: await User.encryptPassword(password)
        });

        const foundRole = await Role.find({name: {$in: roles}})
        newUser.roles = foundRole.map(role => role._id)


        const savedUser = await newUser.save();
        const token = jwt.sign({id: savedUser._id}, config.SECRET, {expiresIn: 864000}, null);

        res.status(201).json({token: token});
    } catch (e) {
    }
}

export const signIn = async (req, res) => {
    try {
        // .populate('campo relacionado') -> se utiliza para sacar el objeto completo al estar relacionado
        const userFound = await User.findOne({username: req.body.username})//.populate("roles")
        if (!userFound) return res.status(401).json({message: 'Error login'});

        const matchPassword = await User.comparePassword(req.body.password, userFound.password)
        if (!matchPassword) return res.status(401).json({token: null, message: 'Error login'});

        const username = userFound.username

        const token = jwt.sign({id: userFound._id}, config.SECRET, {expiresIn: 10000}, null);
        res.json({token: token, username: username})
    } catch (e) {
    }
}

export const changePassword = async (req, res) => {
    try {
        const token = req.headers["authorization"]
        if (!token) return res.status(403).json({message: 'No token'})

        const tokenString = token.split(' ')[1];
        const decoded = jwt.verify(tokenString, config.SECRET, null, null);
        const userFound = await User.findById(decoded.id)

        if (!await User.comparePassword(req.body.passActual, userFound.password))
            return res.status(300).json({message: 'La contraseña no coincide'})

        const passEncrypt = await User.encryptPassword(req.body.passNew)

        const user = await User.findByIdAndUpdate(decoded.id, {$set: {password: passEncrypt}})
        const newToken = jwt.sign({id: user._id}, config.SECRET, {expiresIn: 30}, null);
        res.json({token: newToken})
    } catch (e) {
    }
}