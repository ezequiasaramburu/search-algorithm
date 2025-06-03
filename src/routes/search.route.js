import { Router } from 'express';
import { search } from '../controllers/search.controller.js';

const searchRouter  = Router();

searchRouter.get('/', search);

export default searchRouter;
