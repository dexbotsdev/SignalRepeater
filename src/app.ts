import {EventEmitter} from 'emitter' 
import DiscordScraper from "./service/DiscordScraper";
import fs from 'fs'
import logger from './service/Logger';
import TelegramBot from "node-telegram-bot-api";
 
const eventEmitter = new EventEmitter();
eventEmitter.setMaxListeners(1);

let config=null; 
async function start() {
    fs.readFile('./client.config.json', 'utf8',  (error, data) => {
        if(error){
           console.log(error);
           return;
        }
        config= JSON.parse(data); 
        let ds = new DiscordScraper(eventEmitter,config);   

        ds.connect(config.discordToken);
        let bot = new TelegramBot(config.telegramBotToken, {polling: false}); 
 
        eventEmitter.on('newListener', (event: string, listener: any) => {
            logger.info(`Added Signal Repeater Server ${event.toUpperCase()} listener.`);
          });

        eventEmitter.on('newSignal', (tradeSignal: any) => {
            logger.info('Recieved '); 
            bot.sendMessage(tradeSignal.telegramChatID,tradeSignal.mesg)
            .then(function(result: any) {
                console.log(result);
            });
            
        });  


        eventEmitter.on('Disconnected', (message: string) => {
            logger.info('Disconnected -- need to restart '+message.toUpperCase());
            eventEmitter.removeAllListeners();
            
            start();

           });
        
    }) 
 } 

start();

