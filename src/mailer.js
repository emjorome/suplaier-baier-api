var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'contabilly.mailer@gmail.com',
    pass: 'wvkbcbksugixdtgz'
  }
});

function enviarCorreo(para, tema, texto){
    var mail = {
        from: 'contabilly.mailer@gmail.com',
        to: para,
        subject: tema,
        text: texto
      };
      
      transporter.sendMail(mail, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

module.exports = {enviarCorreo};