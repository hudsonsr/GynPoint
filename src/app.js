import 'dotenv/config';
import express from 'express';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import 'express-async-errors';
import BullBoard from 'bull-board';
import routes from './routes';
import sentryConfig from './config/sentry';
import Queue from './lib/Queue';

import './database';

class App {
   constructor() {
      this.server = express();

      Sentry.init(sentryConfig);

      BullBoard.setQueues(
         Object.keys(Queue.queues).map(item => Queue.queues[item].bull)
      );

      this.middlewares();
      this.routes();
      this.exceptionHandler();
   }

   middlewares() {
      this.server.use(Sentry.Handlers.requestHandler());
      this.server.use('/admin/queues', BullBoard.UI);
      this.server.use(express.json());
   }

   routes() {
      this.server.use(routes);
      this.server.use(Sentry.Handlers.errorHandler());
   }

   exceptionHandler() {
      this.server.use(async (err, req, res, next) => {
         if (process.env.NODE_ENV === 'development') {
            const erros = await new Youch(err, req).toJSON();

            return res.status(500).json(erros);
         }

         return res.status(500).json({ error: 'internal server error' });
      });
   }
}

export default new App().server;
