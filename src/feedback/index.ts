import express from 'express';
import {get, post} from './feedback';
import validation from './validation';

const router = express.Router();

router.get('/', get);
router.post('/', validation, post);

export = router;