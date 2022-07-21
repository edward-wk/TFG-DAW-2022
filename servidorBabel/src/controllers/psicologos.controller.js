import Psicologo from '../models/Psicologo';
import jwt from "jsonwebtoken";
import config from "../config";
import User from "../models/User";

/**
 * Consulta para dar de alta a un psicologo
 * @param {*} req
 * @param {*} res
 */
export const createPsicologo = async (req, res) => {
    try {
        const newPsicologo = new Psicologo(req.body);
        const psicologoSaved = await newPsicologo.save();
        res.status(200).json(psicologoSaved);
    } catch (e) {
        res.status(300).json({message: 'ERROR AL CREAR EL PSICOLOGO'})
    }
}

export const getPsicologo = async (req, res) => {
    try {
        const psicologo = await Psicologo.find();
        res.json(psicologo);
    } catch (e) {
    }
}
/**
 * Recupera un psicologo por token
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const getPsicologoByToken = async (req, res) => { // GET
    try {
        const token = req.headers["authorization"]
        if (!token) return res.status(403).json({message: 'No token'})

        const tokenString = token.split(' ')[1];
        const decoded = jwt.verify(tokenString, config.SECRET, null, null);

        const id = await User.findById(decoded.id)
        const psicologo = await Psicologo.findOne({username: id.username})
        res.status(200).json(psicologo)
    } catch (e) {
    }
}

/**
 * Recupera un psicologo por nombre de usuario
 * @param {*} req
 * @param {*} res
 */
export const getPsicologoByUserName = async (req, res) => { // GET
    try {
        const psicologo = await Psicologo.findOne({username: req.params.username})

        res.status(200).json(psicologo)
    } catch (e) {
    }
}

export const updatePsicologoById = async (req, res) => { // PUT

    try {
        const psicologo = await Psicologo.findOneAndUpdate({_id: req.params.psicologoId}, req.body, {
            new: true
        });
        res.status(200).json(psicologo);
    } catch (e) {
    }
}

export const deletePsicologoById = async (req, res) => { // DELETE
    try {
        await Psicologo.findOneAndDelete({_id: req.params.psicologoId});
        res.status(204).json();
    } catch (e) {
    }
}
