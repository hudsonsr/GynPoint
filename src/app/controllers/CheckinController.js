import * as Yup from 'yup';
import { Op } from 'sequelize';
import { format, parseISO, endOfWeek, startOfWeek } from 'date-fns';
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

      const checkinAlreadyExists = await Checkin.findOne({
         where: {
            student_id,
            created_at: {
               [Op.between]: [
                  format(new Date(), "yyyy-MM-dd'T00:00:00-03:00'"),
                  format(new Date(), "yyyy-MM-dd'T23:59:59-03:00'"),
               ],
            },
         },
         attributes: ['created_at'],
         order: ['created_at', 'DESC'],
      });

      if (checkinAlreadyExists) {
         return res.status(400).json({ error: 'Checkin already exists' });
      }

      const dateEndWeek = endOfWeek(new Date());

      const limitCheckinPerWeek = await Checkin.findAndCountAll({
         where: {
            student_id,
            created_at: {
               [Op.between]: [startOfWeek(new Date()), endOfWeek(new Date())],
            },
         },
         attributes: ['created_at'],
      });

      if (limitCheckinPerWeek.count >= 7) {
         return res
            .status(400)
            .json({ error: `Max number of checkins reached: ${7}` });
      }

      const checkin = await Checkin.create({
         student_id,
      });

      // return res.json({ student_id, start_date, plan_id, end_date, price });
      return res.json(checkin);
   }
}

export default new CheckinController();
