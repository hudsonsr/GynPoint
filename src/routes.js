import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// Rotas sem token
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// Rotas com token
routes.use(authMiddleware); // pegatoken de autenticação

routes.put('/users', UserController.update);

export default routes;
