import * as Yup from 'yup';
import { Op } from 'sequelize';
import Registration from '../models/Registration';
import Student from '../models/Student';
import Plan from '../models/Plan';

class RegistrationController {
   async show(req, res) {
      const registration = await Registration.findAll({
         include: [
            { model: Student, as: 'student', attributes: ['name'] },
            { model: Plan, as: 'plan', attributes: ['title'] },
         ],
      });

      if (!registration) {
         return res.status(400).json({ error: 'no one registration' });
      }

      return res.json(registration);
   }

   async store(req, res) {
      return res.json({ route: 'store' });
   }

   async update(req, res) {
      return res.json({ route: 'update' });
   }

   async delete(req, res) {
      return res.json({ route: 'delete' });
   }
}

export default new RegistrationController();
