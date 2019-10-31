import * as Yup from 'yup';
import { Op } from 'sequelize';
import { format, parseISO, addMonths, endOfDay, startOfDay } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Registration from '../models/Registration';
import Student from '../models/Student';
import Plan from '../models/Plan';

import Mail from '../../lib/Mail';

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

      console.log(end_date);

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

      const formattedDateStart = format(start_date, 'dd/MM/yyyy', {
         locale: pt,
      });

      const formattedDateEnd = format(end_date, 'dd/MM/yyyy', {
         locale: pt,
      });

      await Mail.sendMail({
         to: `${student.name} <${student.email}>`,
         subject: 'Matrícula Realizada',
         template: 'cancelation',
         context: {
            student: student.name,
            start_date: formattedDateStart,
            end_date: formattedDateEnd,
         },
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

      const deletedRows = await Registration.destroy(id);

      return res.json({ msg: `${deletedRows} row(s) deleted` });
   }
}

export default new RegistrationController();
