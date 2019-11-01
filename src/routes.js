import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// Rotas sem token
routes.post('/sessions', SessionController.store);
routes.post('/students/:student_id/help-orders', HelpOrderController.store);
routes.get('/students/:student_id/help-orders', HelpOrderController.index);

// Rotas com token
routes.use(authMiddleware); // pegatoken de autenticação

routes.post('/users', UserController.store);
routes.put('/users', UserController.update);
routes.get('/students', StudentController.show);
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

routes.get('/students/:id/checkins', CheckinController.show);
routes.post('/students/:id/checkins', CheckinController.store);

routes.get('/help-orders', HelpOrderController.show);
routes.put('help-orders/:id/answer', HelpOrderController.update);
routes.delete('help-orders/:id', HelpOrderController.update);

export default routes;
