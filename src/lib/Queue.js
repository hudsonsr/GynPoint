import BullQueue from 'bull';
import CancellationMail from '../app/jobs/CancellationMail';
import RegistrationMail from '../app/jobs/RegistrationMail';
import HelpOrderMail from '../app/jobs/HelpOrderMail';
import redisConfig from '../config/redis';

const jobs = [CancellationMail, RegistrationMail, HelpOrderMail];

class Queue {
   constructor() {
      this.queues = {};

      this.init();
   }

   init() {
      jobs.forEach(({ key, handle }) => {
         this.queues[key] = {
            bull: new BullQueue(key, {
               redis: redisConfig,
            }),
            name: key,
            handle,
         };
      });
   }

   add(queue, job) {
      return this.queues[queue].bull.add(job);
   }

   processQueue() {
      jobs.forEach(job => {
         const { bull, name, handle } = this.queues[job.key];
         bull.process(handle);
         bull.on('failed', (job, err) => {
            console.log(`Job failed: ${name}, ${JSON.stringify(job.data)}`);
            console.log(err);
         });
      });
   }
}

export default new Queue();
