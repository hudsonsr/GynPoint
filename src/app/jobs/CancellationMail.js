import { parseISO, format } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import Mail from '../../lib/Mail';

class CancellationMail {
   get key() {
      return 'CancellationMail';
   }

   async handle({ data }) {
      const { registrationDatas } = data;

      const { student, start_date, end_date, price, plan } = registrationDatas;

      const formattedDateStart = format(parseISO(start_date), 'dd/MM/yyyy', {
         locale: pt,
      });

      const formattedDateEnd = format(parseISO(end_date), 'dd/MM/yyyy', {
         locale: pt,
      });

      await Mail.sendMail({
         to: `${student.name} <${student.email}>`,
         subject: 'Matrícula Cancelada',
         template: 'cancellation',
         context: {
            student: student.name,
            start_date: formattedDateStart,
            end_date: formattedDateEnd,
            price,
            plan: plan.title,
         },
      });
   }
}

export default new CancellationMail();
