const nodemailer = require('nodemailer')

const sendEmail = async options => {
//1) create transporter
// //using gmail as mail service
// const transporter = nodemailer.createTransport({
// 	service: 'Gmail',
// 	auth: {
// 		username:process.env.EAMIL_PASWORD
// 		password:process.env.PASSWORD
// 	}
// 	// activate the less secure app option
// })

const transporter = nodemailer.createTransport({
	host : process.env.EMAIL_HOST,
	port: process.env.EMAIL_PORT,
	auth: {
		user:process.env.EMAIL_USERNAME,
		pass:process.env.EMAIL_PASSWORD
	}
})


//2) define email options
const mailOptions = {
	from: 'makaveli d don <hello2@yahoo.com>',
	to: options.email,
	subject: options.subject,
	text: options.message,
	

} 

//3) semd the actual mail through node mailer
await transporter.sendMail(mailOptions)
}

module.exports = sendEmail