import * as Yup from 'yup';
import { Op } from 'sequelize';
import Plan from '../models/Plan';

class PlanController {
   async store(req, res) {
      const schema = Yup.object().shape({
         title: Yup.string().required(),
         duration: Yup.number().required(),
         price: Yup.number().required(),
      });

      if (!(await schema.isValid(req.body))) {
         return res.status(400).json({ error: 'Validation fails' });
      }

      const planExists = await Plan.findOne({
         where: { title: req.body.title },
      });
      if (planExists) {
         return res.status(401).json({ error: 'Plan exists' });
      }

      const { title, duration, price } = await Plan.create(req.body);
      return res.json({ title, duration, price });
   }

   async update(req, res) {
      const { id } = req.params;
      if (!id) {
         return res.status(401).json({ error: 'no id params' });
      }
      const plan = await Plan.findByPk(id);

      if (!plan) {
         return res.status(401).json({ error: 'Id does not exists' });
      }

      const schema = Yup.object().shape({
         title: Yup.string(),
         duration: Yup.number(),
         price: Yup.number(),
      });

      if (!schema.isValid(req.body)) {
         return res.status(400).json({ error: 'Validation fails' });
      }
      if (
         req.title &&
         (await Plan.findOne({
            where: {
               title: req.title,
               id: {
                  [Op.ne]: id,
               },
            },
         }))
      ) {
         return res.status(401).json({ error: 'Plan already exists' });
      }

      const { title, duration, price } = await plan.update(req.body);

      return res.json({ title, duration, price });
   }

   async show(req, res) {
      // try {
      const plans = await Plan.findAll({
         attributes: ['id', 'title', 'duration', 'price'],
         order: [['price', 'ASC']],
      });

      return res.json(plans);
      /* } catch (err) {
         return res.status(400).json({ err });
      } */
   }

   async delete(req, res) {
      const { id } = req.params;
      if (!id) {
         return res.status(401).json({ error: 'no id params' });
      }

      const plansDeleted = await Plan.destroy({ where: { id } });

      return res.json({ msg: `${plansDeleted} row(s) deleted` });
   }
}

export default new PlanController();
