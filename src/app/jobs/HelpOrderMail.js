import { parseISO, format } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import Mail from '../../lib/Mail';

class HelpOrderMail {
   get key() {
      return 'HelpOrderMail';
   }

   async handle({ data }) {
      const { helpOrder } = data;

      const { student, question, answer, answer_at } = helpOrder;

      const formattedDateAnswer = format(
         parseISO(answer_at),
         'dd/MM/yyyy hh:mm',
         {
            locale: pt,
         }
      );

      await Mail.sendMail({
         to: `${student.name} <${student.email}>`,
         subject: 'Pegunta Respondida',
         template: 'helporder',
         context: {
            student: student.name,
            question,
            answer,
            answer_at: formattedDateAnswer,
         },
      });
   }
}

export default new HelpOrderMail();
