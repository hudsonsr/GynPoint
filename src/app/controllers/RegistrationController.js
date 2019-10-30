import * as Yup from 'yup';
import { Op } from 'sequelize';
import { format, parseISO, addMonths } from 'date-fns';
import Registration from '../models/Registration';
import Student from '../models/Student';
import Plan from '../models/Plan';

class RegistrationController {
   async show(req, res) {
      const registration = await Registration.findAll({
         attributes: ['start_date', 'end_date', 'price'],
         include: [
            { model: Student, as: 'student', attributes: ['name'] },
            { model: Plan, as: 'plan', attributes: ['title'] },
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
      const start_date = format(
         parseISO(req.body.start_date),
         "yyyy-MM-dd'T00:00:00-03:00'"
      );

      const plan = await Plan.findByPk(plan_id);

      if (!plan) {
         return res.status(401).json({ error: 'Plan not exists' });
      }

      const price = plan.duration * plan.price;
      const end_date = format(
         addMonths(parseISO(start_date), plan.duration),
         "yyyy-MM-dd'T23:59:59-03:00'"
      );

      const registrationExists = await Registration.findOne({
         where: {
            student_id,
            [Op.and]: [
               {
                  start_date: {
                     [Op.gte]: start_date,
                  },
                  end_date: {
                     [Op.lte]: end_date,
                  },
               },
            ],
         },
      });

      if (registrationExists) {
         return res.status(400).json(registrationExists);
         // .json({ error: 'Registration exists in this period' });
      }

      const registration = await Registration.create({
         student_id,
         start_date,
         plan_id,
         end_date,
         price,
      });

      // return res.json({ student_id, start_date, plan_id, end_date, price });
      return res.json(registration);
   }

   async update(req, res) {
      return res.json({ route: 'update' });
   }

   async delete(req, res) {
      return res.json({ route: 'delete' });
   }
}

export default new RegistrationController();
