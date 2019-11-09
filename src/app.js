import express from 'express';
import BullBoard from 'bull-board';
import routes from './routes';
import Queue from './lib/Queue';

import './database';

class App {
   constructor() {
      this.server = express();

      BullBoard.setQueues(
         Object.keys(Queue.queues).map(item => Queue.queues[item].bull)
      );

      this.server.use('/admin/queues', BullBoard.UI);

      this.middlewares();
      this.routes();
   }

   middlewares() {
      this.server.use(express.json());
   }

   routes() {
      this.server.use(routes);
   }
}

export default new App().server;
