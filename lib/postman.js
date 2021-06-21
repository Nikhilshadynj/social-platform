const fs = require('fs');
const path = require('path');
const Postmark = require('postmark');
const client = new Postmark.ServerClient('pass-postmark-server-client-key'); //https://account.postmarkapp.com/sign_up

const send = mail => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.resolve(__dirname, `../emails/${mail.template}.html`), 'utf8', (err, template) => {
            if (err) {
                reject(err);
            }

            mail.variables.forEach(variable => {
                template = template.replace(new RegExp(`{{${variable.name}}}`, 'g'), variable.value);
            });

            client.sendEmail({
                From: 'er.jitendra.kumar01@gmail.com',
                To: mail.to,
                Subject: mail.subject,
                HtmlBody: template
            }).then(response => {
                resolve(response);
            }).catch(err => {
                reject(err);
            });
        });
    });
}

module.exports = { send };