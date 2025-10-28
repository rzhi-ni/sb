// commands/Confirm.js

import { sendLog } from "./log.js"; 

const pendingMap = new Map();

export function addPending(data) {
  const key = `${data.guildId}:${data.channelId}`;
  pendingMap.set(key, data);
}

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {object} acc 
 */
export async function handleConfirm(client, message, acc) {
  try {
    const key = `${message.guild?.id}:${message.channel.id}`;
    const pending = pendingMap.get(key);

    if (!pending) return message.reply("⚠️ Không có yêu cầu xác nhận nào đang chờ!");

    if (pending.authorId !== message.author.id)
      return message.reply("⛔ Chỉ người gửi lệnh ban đầu mới có thể xác nhận!");

  
    await pending.botMessage.clickButton(pending.confirmButton.customId);

    await message.reply(
      `✅  ${pending.type === "owo" ? "OwO" : "Yubabe"} đã được xác nhận!`
    );

  
    if (pending.type === "owo") {

        const targetId = pending.targetId || 'UNKNOWN'; 
        const amount = pending.amount || 'UNKNOWN';  

        const messageUrl = message.url; 
        
     
        const channelName = message.channel.name || 'DM';

   
        await sendLog(
            client, 
            acc, 
            'OUT', 
            amount, 
            targetId, 
            channelName, 
            messageUrl
        ); 
    }

    pendingMap.delete(key);
  } catch (err) {
    console.error("❌ Lỗi khi bấm Confirm:", err);
    message.reply("❌ Không thể bấm nút Confirm! (Có thể nút đã hết hạn hoặc bot đã bị chặn)");
  }
}