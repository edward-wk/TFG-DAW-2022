import {Router} from "express";
import * as authJwt from "../middlewares/authJwt";
import * as agendaCtrl from "../controllers/agenda.controller";

const router = Router();

router.get('/getByPsicologo/:idPsicologo', [authJwt.verifyToken], agendaCtrl.getByPsicologo)
router.put('/', [authJwt.verifyToken], agendaCtrl.addCita)
router.put('/modificarCita', [authJwt.verifyToken], agendaCtrl.modificarCita)
router.delete('/eliminarCita/:id', [authJwt.verifyToken], agendaCtrl.eliminarCita)

export default router;
