// commands/Ygive.js
export async function handleYgive(client, message, args) {
  try {
    const target = args[0];
    const amount = args[1];

    if (!target || !amount)
      return message.reply("❌ Sai cú pháp! Dùng: !ysend @aiđó <số tiền>");

    // Gửi lệnh YuBabe
    await message.channel.send(`ygive ${target} ${amount}`);

    // Chờ phản hồi từ YuBabe Bot
    const filter = (m) => m.author.id === "936872532932440065"; // Yubabe Bot ID
    const response = await message.channel.awaitMessages({
      filter,
      max: 1,
      time: 10000,
    });

    if (!response.size)
      return message.reply("⚠️");

    const botMessage = response.first();

    // Tìm nút "Xác Nhận"
    const confirmButton = botMessage.components
      ?.flatMap((row) => row.components)
      ?.find((b) =>
        b.label?.toLowerCase().includes("xác nhận") ||
        b.label?.toLowerCase().includes("accept") ||
        b.emoji?.name === "✅"
      );

    if (!confirmButton)
      return message.reply("⚠️");

    message.reply("");

    setTimeout(async () => {
      try {
        await botMessage.clickButton(confirmButton.customId);
        message.reply("✅");
      } catch (err1) {
        console.error("Lỗi lần 1:", err1);
        setTimeout(async () => {
          try {
            await botMessage.clickButton(confirmButton.customId);
            message.reply("");
          } catch (err2) {
            console.error("", err2);
            message.reply("");
          }
        }, 1500);
      }
    }, 3000);
  } catch (err) {
    console.error(err);
    message.reply("❌ Lỗi Ygive!");
  }
}
