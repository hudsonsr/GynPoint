import * as Yup from 'yup';

import Student from '../models/Student';

class StudentController {
   async store(req, res) {
      const schema = Yup.object().shape({
         name: Yup.string().required(),
         email: Yup.string()
            .email()
            .required(),
         age: Yup.number()
            .required()
            .min(2),
      });

      if (!(await schema.isValid(req.body))) {
         return res.status(400).json({ error: 'Validation fails' });
      }

      const studentExists = await Student.findOne({
         where: { email: req.body.email },
      });
      if (studentExists) {
         return res.status(401).json({ error: 'Student exists' });
      }
      const student = await Student.create(req.body);

      return res.json(student);
   }

   async update(req, res) {
      const schema = Yup.object().shape({
         name: Yup.string(),
         email: Yup.string()
            .required()
            .email(),
         age: Yup.number().min(2),
      });

      if (!(await schema.isValid(req.body))) {
         return res.status(400).json({ error: 'Validation fails' });
      }
      const { id: studentId } = req.params;

      const { email } = req.body;

      const student = await Student.findByPk(studentId);

      if (email !== student.email) {
         const studentExists = await Student.findOne({ where: { email } });

         if (studentExists) {
            return res.status(401).json({ error: 'Student exists' });
         }
      }

      const { id, name, age, height, weight } = await student.update(req.body);

      return res.json({ id, name, age, height, weight });
   }
}

export default new StudentController();
