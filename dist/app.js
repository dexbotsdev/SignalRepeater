"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const emitter_1 = require("emitter");
const DiscordScraper_1 = __importDefault(require("./service/DiscordScraper"));
const fs_1 = __importDefault(require("fs"));
const Logger_1 = __importDefault(require("./service/Logger"));
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const eventEmitter = new emitter_1.EventEmitter();
eventEmitter.setMaxListeners(1);
let config = null;
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        fs_1.default.readFile('./client.config.json', 'utf8', (error, data) => {
            if (error) {
                console.log(error);
                return;
            }
            config = JSON.parse(data);
            let ds = new DiscordScraper_1.default(eventEmitter, config);
            ds.connect(config.discordToken);
            let bot = new node_telegram_bot_api_1.default(config.telegramBotToken, { polling: false });
            eventEmitter.on('newListener', (event, listener) => {
                Logger_1.default.info(`Added Signal Repeater Server ${event.toUpperCase()} listener.`);
            });
            eventEmitter.on('newSignal', (tradeSignal) => {
                Logger_1.default.info('Recieved ');
                bot.sendMessage(tradeSignal.telegramChatID, tradeSignal.mesg)
                    .then(function (result) {
                    console.log(result);
                });
            });
            eventEmitter.on('Disconnected', (message) => {
                Logger_1.default.info('Disconnected -- need to restart ' + message.toUpperCase());
                eventEmitter.removeAllListeners();
                start();
            });
        });
    });
}
start();
