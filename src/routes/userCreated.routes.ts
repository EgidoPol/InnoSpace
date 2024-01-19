import {Router} from 'express';
import user_dataController from '../controllers/user_created2.controller';

const router = Router();

router.get('/getUserCreated/:id', user_dataController.getUserCreated);
router.get('/getUnidades', user_dataController.getUnidades);
router.post('/newUserCreated', user_dataController.newUserCreated);
router.post('/registerUser', user_dataController.registerUser);
router.post('/upgradeRol', user_dataController.upgradeRol);

export = router
