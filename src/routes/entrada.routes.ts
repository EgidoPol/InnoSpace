import {Router} from 'express';
import entrada from '../controllers/entrada.controller';

const router = Router();

router.get('/getEntries', entrada.getEntries);
router.get('/getAllEntries', entrada.getAllEntries);
router.post('/createEntry', entrada.createEntry);
router.post('/updateEntry', entrada.updateEntry);


export = router