import nodemailer from 'nodemailer';

export const mailer = async (receivers, mail) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: `${process.env.TRANSPORTER_MAIL}`,
        pass: `${process.env.TRANSPORTER_PASS}`,
      },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `NAPA GLOBAL <${process.env.TRANSPORTER_MAIL}>`, // sender address
      to: receivers || `vdhlong1202@gmail.com`, // list of receivers
      subject: mail.subject, // Subject line
      html: mail.template, // html body
    });

    console.log('Message sent: ', info.messageId);
  } catch (error) {
    console.error;
  }
};
