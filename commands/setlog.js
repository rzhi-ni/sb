// commands/setlog.js

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {string[]} args 
 * @param {object} acc 
 * @param {number} accIndex 
 * @param {object} cfg 
 * @param {function} saveConfigFunc 
 */
export async function handleSetLog(client, message, args, acc, accIndex, cfg, saveConfigFunc) {
    const channelId = args[0] ? args[0].replace(/[<#>]/g, '') : null;
    
    
    if (message.deletable) {
        await message.delete().catch(() => {});
    }

 
    if (!channelId || channelId.toLowerCase() === 'off' || channelId.toLowerCase() === 'tắt') {
        if (cfg.accounts[accIndex].logChannelId) {
            cfg.accounts[accIndex].logChannelId = "";
            await saveConfigFunc(cfg);
            return message.channel.send(`✅ Đã **tắt** Log Channel cho **${acc.name}**.`);
        } else {
            return message.channel.send(`⚠️ Log Channel đã tắt sẵn rồi.`);
        }
    }

  
    if (!/^\d{17,19}$/.test(channelId)) {
        return message.channel.send("❌ ID kênh không hợp lệ. Vui lòng cung cấp ID kênh hoặc mention kênh.");
    }
    
  
    cfg.accounts[accIndex].logChannelId = channelId;
    await saveConfigFunc(cfg);

  
    return message.channel.send(`✅ Đã thiết lập Log Channel cho **${acc.name}** thành <#${channelId}>.`);
}