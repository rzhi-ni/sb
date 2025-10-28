

import { addPending } from "./Confirm.js";

export async function handleOwOsend(client, message, args, acc) {
  try {
    const target = args[0];
    const amount = args[1];
    
    if (!target || !amount) {
      return message.reply("❌ Sai cú pháp! Dùng: !osend @aiđó <số tiền>");
    }
    

    const targetId = target.replace(/[<@!>]/g, ''); 
    

    

    await message.channel.send(`owo give ${target} ${amount}`);


    const OWO_BOT_ID = "408785106942164992";
    const filter = (m) => m.author.id === OWO_BOT_ID; 
    
    const response = await message.channel.awaitMessages({
      filter,
      max: 1,
      time: 15000, 
    });

    if (!response.size) {
  
      return message.reply("⚠️ Hết thời gian chờ phản hồi từ OwO bot.");
    }

    const botMessage = response.first();

   
    const confirmButton = botMessage.components
      ?.flatMap((r) => r.components)
      ?.find(
        (b) =>
          b.label?.toLowerCase().includes("confirm") ||
          b.emoji?.name === "✅"
      );

    if (!confirmButton) {
     
      return message.reply("⚠️ Không tìm thấy nút Confirm. Có thể do bot OwO bị lỗi hoặc tin nhắn đã bị hủy.");
    }

   
    addPending({
      type: "owo",
      guildId: message.guild?.id,
      channelId: message.channel.id,
      authorId: message.author.id,
      botMessage,
      confirmButton,
  
      targetId: targetId, 
      amount: amount,
    });

  

    await message.reply("⚙️ Confirm✅");
  } catch (err) {
    console.error(err);

    message.reply("❌ Lỗi khi thực hiện lệnh OwOsend!");
  }
}