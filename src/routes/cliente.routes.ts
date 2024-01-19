import {Router} from 'express';
import clientController from '../controllers/client.controller';
import entrada from '../controllers/entrada.controller';




const router = Router();

router.get('/getCliente', clientController.getClient);
router.get('/getClientes', clientController.getClients);
router.post('/createCliente', clientController.createClient);
router.post('/updateCliente', clientController.updateClient);

router.post('/createEntry', entrada.createEntry);
export = router