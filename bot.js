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


let caftoken = '535887838:AAGG2r7Ji6l8PuYBxamkDL65EsSgfnUgM10';

if(process.env.CAFB)
    caftoken = process.env.CAFB;


const bot = new TeleBot({
    token: caftoken
  
});
mongoose.connect('mongodb://reet:reet@ds012578.mlab.com:12578/mlabdb' );


bot.on(/^\/(.+)$/, async function (msg, props){
    const text = props.match[1];
let replymessage = 'This code is not valid';
if(!mongoose.Types.ObjectId.isValid(text)){

    return  bot.sendMessage('@sapienglobal', "code not valid find code at https://sapiennetwork.herokuapp.com", { replyToMessage: msg.message_id });

}

    User.findOne({ _id : text }).exec().then(doc => {

        if(doc.ethaddress){

            if(doc.points == 0){

                User.update( { _id : text } , { $set : { points : 1 } } ).exec().then( res => { console.log(res);
                    
                    
                    replymessage = `your code: ${text} is activated successfully, send shared link to your friend right away to get your bonus. Make sure you have subscribed the channel (@officialsapien) and sponsor channel @ultrapumpsignal to receive your tokens.

                你的验证码：${text}，已激活成功！立刻发送分享链接给朋友获得空投奖励！请确保已经关注频道（@officialsapien）以正常获得空投奖励。
                
                Your share link （你的分享链接）：https://sapiennetwork.herokuapp.com/?r=${text}`; 


                return  bot.sendMessage('@sapienglobal', replymessage, { replyToMessage: msg.message_id });
            
            
            }).catch(err => {//console.log(err);
                   // replymessage = `This code is not valid`;

                     // bot.sendMessage(msg.from.id, replymessage, { replyToMessage: msg.message_id });

                      throw new Error('Higher-level error. ' + err.message);
                });

            }else if(+doc.points > 0){
               let invited = doc.points - 1;
                let earned = 200 + 120 * (invited);
replymessage = `User already activtaed . User has  earned  ${earned} SPN`;


return  bot.sendMessage('@sapienglobal', replymessage, { replyToMessage: msg.message_id });
            }
        }


    }).catch(err => {   console.log(err) ;   bot.sendMessage(msg.from.id, 'user doesnt exists', { replyToMessage: msg.message_id });  
  
  });
    
   
});

bot.connect();
