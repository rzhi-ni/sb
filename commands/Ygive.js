import { addPending } from "./Confirm.js";

export async function handleYsend(client, message, args) {
  try {
    const target = args[0];
    const amount = args[1];
    if (!target || !amount)
      return message.reply("❌ Sai cú pháp! Dùng: !ysend @aiđó <số tiền>");

    // Gửi lệnh Yubabe
    await message.channel.send(`ygive ${target} ${amount}`);

    // Chờ phản hồi từ Yubabe bot
    const filter = (m) => m.author.id === "936872532932440065"; // Yubabe Bot ID
    const response = await message.channel.awaitMessages({
      filter,
      max: 1,
      time: 10000,
    });

    if (!response.size)
      return message.reply("⚠️ Không thấy phản hồi từ Yubabe Bot!");

    const botMessage = response.first();

    // Tìm nút Xác Nhận
    const confirmButton = botMessage.components
      ?.flatMap((r) => r.components)
      ?.find(
        (b) =>
          b.label?.toLowerCase().includes("xác nhận") ||
          b.label?.toLowerCase().includes("confirm") ||
          b.emoji?.name === "✅"
      );

    if (!confirmButton)
      return message.reply("⚠️");

    // Lưu pending để confirm.js xử lý
    addPending({
      type: "yubabe",
      guildId: message.guild?.id,
      channelId: message.channel.id,
      authorId: message.author.id,
      botMessage,
      confirmButton,
    });

    await message.reply("⚙️confirm✅.");
  } catch (err) {
    console.error(err);
    message.reply("❌ Lỗi khi thực hiện lệnh Ysend!");
  }
}
