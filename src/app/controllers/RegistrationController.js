import * as Yup from 'yup';
import { Op } from 'sequelize';
import { parseISO, addMonths, endOfDay, startOfDay } from 'date-fns';
import Registration from '../models/Registration';
import Student from '../models/Student';
import Plan from '../models/Plan';

import CancellationMail from '../jobs/CancellationMail';
import RegistrationMail from '../jobs/RegistrationMail';
import Queue from '../../lib/Queue';

class RegistrationController {
   async show(req, res) {
      const registration = await Registration.findAll({
         attributes: ['id', 'start_date', 'end_date', 'price'],
         include: [
            { model: Student, as: 'student', attributes: ['id', 'name'] },
            { model: Plan, as: 'plan', attributes: ['id', 'title'] },
         ],
      });

      if (!registration) {
         return res.status(400).json({ error: 'No one registration' });
      }

      return res.json(registration);
   }

   async store(req, res) {
      const schema = Yup.object().shape({
         student_id: Yup.number().required(),
         start_date: Yup.date().required(),
         plan_id: Yup.number().required(),
      });

      if (!(await schema.isValid(req.body))) {
         return res.status(400).json({ error: 'Validation fails' });
      }

      const { student_id, plan_id } = req.body;

      const start_date = startOfDay(parseISO(req.body.start_date));

      const student = await Student.findByPk(student_id);

      if (!student) {
         return res.status(401).json({ error: 'Student not exists' });
      }

      const plan = await Plan.findByPk(plan_id);

      if (!plan) {
         return res.status(401).json({ error: 'Plan not exists' });
      }

      const price = plan.duration * plan.price;
      const end_date = endOfDay(addMonths(start_date, plan.duration));

      const registrationExists = await Registration.findOne({
         where: {
            student_id,
            [Op.and]: [
               {
                  start_date: {
                     [Op.lte]: start_date,
                  },
                  end_date: {
                     [Op.gte]: end_date,
                  },
               },
            ],
         },
      });

      if (registrationExists) {
         return res
            .status(400)
            .json({ error: 'Registration exists in this period' });
      }

      const registration = await Registration.create({
         student_id,
         start_date,
         plan_id,
         end_date,
         price,
      });

      if (!registration) {
         return res.status(400).json({ erro: 'Registration Failed' });
      }

      Queue.add(RegistrationMail.key, {
         student,
         start_date,
         end_date,
      });
      // return res.json({ student_id, start_date, plan_id, end_date, price });
      return res.json(registration);
   }

   async update(req, res) {
      const { id } = req.params;

      const registration = await Registration.findByPk(id);

      if (!registration) {
         return res.status(400).json({ error: 'Id does not exists' });
      }

      await registration.update(req.body);

      return res.json(registration);
   }

   async delete(req, res) {
      const { id } = req.params;

      const registrationDatas = await Registration.findOne({
         where: {
            id,
         },
         include: [
            {
               model: Student,
               as: 'student',
               attributes: ['id', 'name', 'email'],
            },
            {
               model: Plan,
               as: 'plan',
               attributes: ['id', 'title'],
            },
         ],
         attributes: ['start_date', 'end_date', 'price'],
      });

      const deletedRows = await Registration.destroy({
         where: { id },
      });

      if (deletedRows > 0) {
         Queue.add(CancellationMail.key, {
            registrationDatas,
         });
      }

      return res.json({ msg: `${deletedRows} row(s) deleted` });
   }
}

export default new RegistrationController();
