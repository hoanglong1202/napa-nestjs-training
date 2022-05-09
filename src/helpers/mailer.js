const nodemailer = require('nodemailer');

async function mailer(receivers, mail) {
  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: `${process.env.TRANSPORTER_MAIL}`,
        pass: `${process.env.TRANSPORTER_PASS}`,
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: `NAPA GLOBAL <${process.env.TRANSPORTER_MAIL}>`, // sender address
      to: receivers || `vdhlong1202@gmail.com`, // list of receivers
      subject: mail.subject, // Subject line
      html: mail.template, // html body
    });

    console.log('Message sent: ', info.messageId);
  } catch (error) {
    console.error;
  }
}

// mailer().catch(console.error);

module.exports = mailer;
