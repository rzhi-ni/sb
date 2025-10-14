import { addPending } from "./Confirm.js";

export async function handleOwOsend(client, message, args) {
  try {
    const target = args[0];
    const amount = args[1];
    if (!target || !amount)
      return message.reply("❌ Sai cú pháp! Dùng: !osend @aiđó <số tiền>");

    // Gửi lệnh OwO
    await message.channel.send(`owo give ${target} ${amount}`);

    // Chờ phản hồi từ OwO bot
    const filter = (m) => m.author.id === "408785106942164992"; // OwO Bot ID
    const response = await message.channel.awaitMessages({
      filter,
      max: 1,
      time: 10000,
    });

    if (!response.size)
      return message.reply("⚠️");

    const botMessage = response.first();

    // Tìm nút Confirm
    const confirmButton = botMessage.components
      ?.flatMap((r) => r.components)
      ?.find(
        (b) =>
          b.label?.toLowerCase().includes("confirm") ||
          b.emoji?.name === "✅"
      );

    if (!confirmButton)
      return message.reply("⚠️");

    // Lưu pending để confirm.js xử lý
    addPending({
      type: "owo",
      guildId: message.guild?.id,
      channelId: message.channel.id,
      authorId: message.author.id,
      botMessage,
      confirmButton,
    });

    await message.reply("⚙️ confirm✅.");
  } catch (err) {
    console.error(err);
    message.reply("❌ Lỗi khi thực hiện lệnh OwOsend!");
  }
}
