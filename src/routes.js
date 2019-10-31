import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckinController from './app/controllers/CheckinController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// Rotas sem token
routes.post('/sessions', SessionController.store);

// Rotas com token
routes.use(authMiddleware); // pegatoken de autenticação

routes.post('/users', UserController.store);
routes.put('/users', UserController.update);
routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);

routes.post('/plans', PlanController.store);
routes.put('/plans/:id', PlanController.update);
routes.get('/plans', PlanController.show);
routes.delete('/plans/:id', PlanController.delete);

routes.post('/registrations', RegistrationController.store);
routes.put('/registrations/:id', RegistrationController.update);
routes.get('/registrations', RegistrationController.show);
routes.delete('/registrations/:id', RegistrationController.delete);

routes.get('/students/:id/checkins', CheckinController.update);
routes.post('/students/:id/checkins', CheckinController.store);

export default routes;
