const TeleBot = require('telebot');
//const translate = require('google-translate-api');
const mongoose = require('mongoose');

const User = require('./models/user')
const {
    TELEBOT_TOKEN: TOKEN,
    TELEBOT_URL: URL,
    TELEBOT_HOST: HOST,
    TELEBOT_PORT: PORT,
} = process.env;

const TRANSLATE_TO = 'en';
const TRANSLATE_ICONS = {
    ru: '🇷🇺', lv: '🇱🇻', ua: '🇺🇦', uz: '🇺🇿', fr: '🇫🇷',
    es: '🇪🇸', it: '🇮🇹', nl: '🇳🇱'
};

const bot = new TeleBot({
    token: '535887838:AAGG2r7Ji6l8PuYBxamkDL65EsSgfnUgM10'
  
});
mongoose.connect('mongodb://reet:reet@ds012578.mlab.com:12578/mlabdb' );


bot.on(/^\/(.+)$/, (msg, props) => {
    const text = props.match[1];
let replymessage = 'some error occured';
    User.findOne({ _id : text }).exec().then(doc => {

        if(doc.ethaddress){

            if(doc.points === 0){

                User.update( { _id : text } , { $set : { points : 1 } } ).exec().then( res => { console.log(res);replymessage = `Congratulations you have earned 200`;  }).catch(err => {console.log(err);
                    replymessage = `This code is not valid`;
                });

            }else if(doc.points > 0){
               let invited = doc.points - 1;
                let earned = 200 + 120 * (invited);
replymessage = `User already activtaed . User has  earned  ${earned} SPN`;
            }
        }


    }).catch(err => { console.log(err) ;
  
  });
    
    return  bot.sendMessage(msg.from.id, replymessage, { replyToMessage: msg.message_id });
});

bot.connect();
