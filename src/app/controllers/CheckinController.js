import * as Yup from 'yup';
import { Op } from 'sequelize';
import { startOfDay, endOfDay, addDays } from 'date-fns';
import Checkin from '../models/Checkin';
import Student from '../models/Student';
import Registration from '../models/Registration';

class CheckinController {
   async show(req, res) {
      const { page = 1 } = req.query;

      const checkin = await Checkin.findAll({
         attributes: ['created_at'],
         limit: 20,
         offset: (page - 1) * 20,
         include: [{ model: Student, as: 'student', attributes: ['name'] }],
      });

      if (!checkin) {
         return res.status(400).json({ error: 'No one checkin' });
      }

      return res.json(checkin);
   }

   async store(req, res) {
      const schema = Yup.object().shape({
         id: Yup.number().required(),
      });

      if (!(await schema.isValid(req.params))) {
         return res.status(400).json({ error: 'Validation fails' });
      }

      const { id: student_id } = req.params;

      const registrationExists = await Registration.findOne({
         where: {
            student_id,
            [Op.and]: [
               {
                  start_date: {
                     [Op.gte]: startOfDay(new Date()),
                  },
                  end_date: {
                     [Op.lte]: endOfDay(new Date()),
                  },
               },
            ],
         },
      });

      if (!registrationExists) {
         return res
            .status(400)
            .json({ error: 'Registration not exists in this period' });
      }

      const limitCheckinPerWeek = await Checkin.findAndCountAll({
         where: {
            student_id,
            created_at: {
               [Op.between]: [startOfDay(addDays(new Date(), -7)), new Date()],
            },
         },
         attributes: ['created_at'],
      });

      if (limitCheckinPerWeek.count >= 5) {
         return res
            .status(400)
            .json({ error: `Max number of checkins/week reached: ${5}` });
      }

      const checkin = await Checkin.create({
         student_id,
      });

      // return res.json({ student_id, start_date, plan_id, end_date, price });
      return res.json(checkin);
   }
}

export default new CheckinController();
