import { parseISO, format } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import Mail from '../../lib/Mail';

class RegistrationMail {
   get key() {
      return 'RegistrationMail';
   }

   async handle({ data }) {
      const { student, start_date, end_date } = data;

      const formattedDateStart = format(parseISO(start_date), 'dd/MM/yyyy', {
         locale: pt,
      });

      const formattedDateEnd = format(parseISO(end_date), 'dd/MM/yyyy', {
         locale: pt,
      });

      await Mail.sendMail({
         to: `${student.name} <${student.email}>`,
         subject: 'Matrícula Realizada',
         template: 'registration',
         context: {
            student: student.name,
            start_date: formattedDateStart,
            end_date: formattedDateEnd,
         },
      });
   }
}

export default new RegistrationMail();
