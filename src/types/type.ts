  export interface BotConfig {  
    channelIds: string[],
    telegramChatID: string, 
  }


  export interface Config {
    discordBotToken: string, 
    telegramBotToken: string, 
    botConfig: BotConfig[], 
  }