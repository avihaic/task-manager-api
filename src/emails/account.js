const sgMail = require('@sendgrid/mail')
const { model } = require('mongoose')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const sendwelcomemail = (email,name) => {
    console.log(email,name)
        sgMail.send({
            to: email,
            from:  'cavihai@gmail.com',
            subject: 'welcome to my app',
            text: `welcome to my app, ${name}.`
        })
}

const senddeletemail = (email,name) => {
    console.log(email,name)
        sgMail.send({
            to: email,
            from:  'cavihai@gmail.com',
            subject: 'delete account',
            text: `delete account, ${name}.`
        })
}


module.exports = {
         sendwelcomemail,
         senddeletemail
}




