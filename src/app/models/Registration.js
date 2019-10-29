import Sequelize, { Model } from 'sequelize';
import { format } from 'date-fns';

class Registration extends Model {
   static init(sequelize) {
      super.init(
         {
            title: Sequelize.STRING,
            duration: Sequelize.INTEGER,
            price: Sequelize.FLOAT,
         },
         {
            sequelize,
         }
      );

      return this;
   }

   static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      this.belongsTo(models.User, {
         foreignKey: 'provider_id',
         as: 'provider',
      });
   }
}

export default Registration;
