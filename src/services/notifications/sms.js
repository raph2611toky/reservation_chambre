require('dotenv').config()

async function sendSms(phone_number,message){
    const accountSid = process.env.ACCOUNT_SID_TWILIO;
    const authToken = process.env.AUTHTOKEN_TWILIO;
    const sender_number_twilio = process.env.NUMBER_TWILIO_SENDER;
    const client = require('twilio')(accountSid, authToken);
    client.messages
        .create({
                    from: sender_number_twilio,
            to: phone_number
        })
        .then(message => console.log(message.sid));
}