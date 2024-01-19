import {Router} from 'express';
import rolController from '../controllers/rol.controller';


const router = Router();

router.get('/getRols', rolController.getRols);
router.post('/createRol', rolController.createRol);
router.post('/updateRol', rolController.updateRol);
router.post('/getEmployees', rolController.getEmployees);

export = router