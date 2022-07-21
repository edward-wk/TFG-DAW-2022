import {Router} from "express";
import * as pacienteCtrl from '../controllers/pacientes.controller';
import * as authJwt from "../middlewares/authJwt";

const router = Router();

router.get('/', pacienteCtrl.getPaciente)
router.get('/:pacienteId', pacienteCtrl.getPacienteById)
router.post('/', pacienteCtrl.createPaciente)
router.put('/actualizarPaciente/:pacienteId', [authJwt.verifyToken], pacienteCtrl.updatePacienteById)
router.delete('/:pacienteId', [authJwt.verifyToken] ,pacienteCtrl.deletePacienteById)
router.get('/nombreNav/:nombre',pacienteCtrl.getPacientesNombre)
router.put('/altaConsulta/:pacienteId', [authJwt.verifyToken], pacienteCtrl.altaConsultaPaciente)
router.put('/modificacionConsulta/:pacienteId/:valoracion', [authJwt.verifyToken], pacienteCtrl.modificacionConsulta)
router.put('/modificarAntecedentes/:pacienteId', [authJwt.verifyToken], pacienteCtrl.modificarAntecedentes)
router.put('/modificarPruebas/:pacienteId/:valoracion', [authJwt.verifyToken], pacienteCtrl.modificarPruebas)
router.put('/modificarSeguimiento/:pacienteId/:valoracion/:seguimiento', [authJwt.verifyToken], pacienteCtrl.modificarSeguimiento)
router.put('/altaSeguimiento/:pacienteId/:valoracion', [authJwt.verifyToken], pacienteCtrl.altaSeguimiento)
router.put('/modificarFechaAlta/:pacienteId/:valoracion',[authJwt.verifyToken],pacienteCtrl.modificarFechaAlta)
export default router;
