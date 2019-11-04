import * as Yup from 'yup';
import { Op } from 'sequelize';
import { parseISO, addMonths, endOfDay, startOfDay } from 'date-fns';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';
import Plan from '../models/Plan';

import HelpOrderMail from '../jobs/HelpOrderMail';
import Queue from '../../lib/Queue';

class HelpOrderController {
   async show(req, res) {
      const helpOrder = await HelpOrder.findAll({
         where: {
            answer_at: null,
         },
         include: [
            {
               model: Student,
               as: 'student',
               attributes: ['id', 'name', 'email'],
            },
         ],
         attributes: ['id', 'question', 'answer'],
      });

      if (!helpOrder) {
         return res
            .status(400)
            .json({ error: 'No one help order without answer' });
      }

      return res.json(helpOrder);
   }

   async index(req, res) {
      const { student_id } = req.params;

      const helpOrder = await HelpOrder.findAll({
         where: {
            student_id,
         },
         include: [
            {
               model: Student,
               as: 'student',
               attributes: ['id', 'name', 'email'],
            },
         ],
         attributes: ['id', 'question', 'answer'],
      });

      if (!helpOrder) {
         return res.status(400).json({ error: 'No one help orders' });
      }

      return res.json(helpOrder);
   }

   async store(req, res) {
      const schema = Yup.object().shape({
         question: Yup.string().required(),
      });

      if (!(await schema.isValid(req.body))) {
         return res.status(400).json({ error: 'Validation fails' });
      }

      const { student_id } = req.params;
      const { question } = req.body;

      const student = await Student.findByPk(student_id);

      if (!student) {
         return res.status(401).json({ error: 'Student not exists' });
      }

      const helpOrder = await HelpOrder.create({
         student_id,
         question,
      });

      if (!HelpOrder) {
         return res.status(400).json({ erro: 'HelpOrder Failed' });
      }

      return res.json(helpOrder);
   }

   async update(req, res) {
      const { id } = req.params;

      const helpOrder = await HelpOrder.findOne(
         {
            where: {
               id,
            },
         },
         {
            include: [
               {
                  model: Student,
                  as: 'student',
                  attributes: ['id', 'name', 'email'],
               },
            ],
         }
      );

      if (!HelpOrder) {
         return res.status(400).json({ error: 'Id does not exists' });
      }

      await helpOrder.update({
         answer: req.body.answer,
         answer_at: new Date(),
      });

      Queue.add(HelpOrderMail.key, {
         helpOrder,
      });

      return res.json(helpOrder);
   }

   async delete(req, res) {
      const { id } = req.params;

      const deletedRows = await HelpOrder.destroy({
         where: { id },
      });

      return res.json({ msg: `${deletedRows} row(s) deleted` });
   }
}

export default new HelpOrderController();
