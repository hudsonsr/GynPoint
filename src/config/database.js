// eslint-disable-next-line no-unused-expressions
require('dotenv').config;

module.exports = {
   dialect: 'postgres',
   host: 'localhost',
   username: 'postgres',
   password: 'gostack',
   database: 'gympoint',
   define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true,
   },
};
