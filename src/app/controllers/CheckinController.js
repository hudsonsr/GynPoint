import * as Yup from 'yup';
import { Op } from 'sequelize';
import { format, parseISO } from 'date-fns';
import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
   async show(req, res) {
      const checkin = await Checkin.findAll({
         attributes: ['created_at'],
         include: [{ model: Student, as: 'student', attributes: ['name'] }],
      });

      if (!checkin) {
         return res.status(400).json({ error: 'No one checkin' });
      }

      return res.json(checkin);
   }

   async store(req, res) {
      const schema = Yup.object().shape({
         student_id: Yup.number().required(),
      });

      if (!(await schema.isValid(req.body))) {
         return res.status(400).json({ error: 'Validation fails' });
      }

      const { student_id } = req.body;

      const checkin = await Checkin.create({
         student_id,
      });

      // return res.json({ student_id, start_date, plan_id, end_date, price });
      return res.json(checkin);
   }
}

export default new CheckinController();
