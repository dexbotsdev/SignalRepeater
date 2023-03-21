import WS from "ws";
import logger from "./Logger"; 
import { BotConfig } from '../types/type';

class DiscordScraper {
  token: any;
  url: string;
  ws: any;
  interval: any;
  ping: number;
  lastheat: number;
  e: any; 
    config: any;


  constructor(eventEmitter: any, config: any) {
    this.token;
    this.url = "wss://gateway-us-east1-b.discord.gg/?encoding=json"
    this.ws;
    this.interval;
    this.ping = 0;
    this.lastheat = 0
    this.e = eventEmitter;
    this.config = config;
  }


  getEmitter = () => {
    return this.e;
  }


  isOmitSignal(content: any) {
  var bluelinemsg = content.indexOf('ENTRY NOW OR AT BLUE LINES')

  return bluelinemsg>0;
}



  replaceDummy(text: string){

    let ret = text.replace('DYOR','');
    ret = ret.replace('#FUTURES','');
    ret = ret.replace('_',' ');
    ret = ret.replace('__',' ');
    ret = ret.replace('®.- FuturesMaxLeverage -','');
      ret= ret.replace('to Join VIP','');
      ret =   ret.replace(/(?:https?|http):\/\/[\n\S]+/g, '');
      ret = ret.replace('This message cannot be forwarded or replicated','');
      ret = ret.replace('- Binance Killers®...','');
      return ret;
  }

  async connect(token: any) {
    this.token = token;

    this.ws = new WS(this.url);

    this.ws.on("open", () => {

      logger.docs('Websocket Connected to Discord ');


      this.ws.send(JSON.stringify(
        {
          "op": 2,
          "d": {
            "token": this.token,
            "capabilities": 4093,
            "properties": {
              "os": "Mac OS X",
              "browser": "Chrome",
              "device": "",
              "system_locale": "en-GB",
              "browser_user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
              "browser_version": "109.0.0.0",
              "os_version": "10.15.7",
              "referrer": "https://accounts.spotify.com/",
              "referring_domain": "accounts.spotify.com",
              "referrer_current": "",
              "referring_domain_current": "",
              "release_channel": "stable",
              "client_build_number": 175117,
              "client_event_source": null,
              "design_id": 0
            },
            "presence": {
              "status": "online",
            },
            "compress": false,
          }
        }))
    })

    this.ws.on("error", (error: string) => {
      logger.error('Websocket Disconnected due to ' + error);

      this.e.emit('Disconnected', 'Error');
    })

    this.ws.on("close", (code: any, message: any) => {
      logger.error('Websocket Disconnected   ');

      this.e.emit('Disconnected', code + message);


    })

    this.ws.on("message", (msg: { toString: () => string; }) => {


      try {
        const payload = JSON.parse(msg.toString())


        const { t: event, s, op, d } = payload

        let heartbeat_interval: number;
        if (d !== null) heartbeat_interval = d.heartbeat_interval
        switch (op) {
          case 10:
            this.interval = this.heartbeat(heartbeat_interval)
            break;
          case 11:
            this.ping = this.lastheat - Date.now()
            break;
        }


        switch (event) {
          case 'MESSAGE_CREATE':
            {

              logger.info('Recd Message from ' + d.author.username);
              logger.error(JSON.stringify(d));
              let discords = this.config.botConfig;

              discords.forEach((element: any) => {
                
                const channels = element.channelIds;
                const telegramChatID = element.telegramChatID;
 
                channels.forEach((channel : string)=>{

                    if(d.channel_id === channel){
                        const mesg = {
                            telegramChatID: telegramChatID,
                            mesg: ''
                        }

                        if(d.embeds.length>0 && !this.isOmitSignal(d.embeds[0].description)){
                            mesg.mesg=d.embeds[0].description
                            var replacehttp =   mesg.mesg.replace(/(?:https?|http):\/\/[\n\S]+/g, '');
                             
                            mesg.mesg=this.replaceDummy(replacehttp)

                        } else if (!this.isOmitSignal(d.content)){
                            mesg.mesg=d.content
                            var replacehttp =   mesg.mesg.replace(/(?:https?|http):\/\/[\n\S]+/g, '');
                             
                            mesg.mesg=this.replaceDummy(replacehttp)
                        }
                        this.e.emit('newSignal',mesg);
                    }

                })


              })
               
            }

        }



      } catch (e) {
        console.log(e)
      }
    })
  }

  heartbeat(ms = 1) {
    return setInterval(() => {
      this.ws.send(JSON.stringify({
        op: 1,
        d: null
      }))
      this.lastheat = Date.now()
    }, ms)
  }

}


export default DiscordScraper;
