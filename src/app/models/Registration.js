import Sequelize, { Model } from 'sequelize';

class Registration extends Model {
   static init(sequelize) {
      super.init(
         {
            start_date: Sequelize.DATE,
            end_date: Sequelize.DATE,
            price: Sequelize.FLOAT,
         },
         {
            sequelize,
         }
      );

      /* this.addHook('beforeSave', async user => {
         if (user.password) {
            user.password_hash = await bcrypt.hash(user.password, 8);
         }
      });
*/
      return this;
   }

   static associate(models) {
      this.belongsTo(models.Student, {
         foreignKey: 'student_id',
         as: 'student',
      });
      this.belongsTo(models.Plan, {
         foreignKey: 'plan_id',
         as: 'plan',
      });
   }
}

export default Registration;
