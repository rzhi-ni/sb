// commands/OwOsend.js
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
      return message.reply("⚠️ Không thấy phản hồi từ OwO Bot!");

    const botMessage = response.first();

    // Tìm nút "Confirm"
    const confirmButton = botMessage.components
      ?.flatMap((row) => row.components)
      ?.find((b) =>
        b.label?.toLowerCase().includes("confirm") ||
        b.emoji?.name === "✅"
      );

    if (!confirmButton)
      return message.reply("⚠️ Không tìm thấy nút Confirm!");

    message.reply("⚙️ Phát hiện yêu cầu xác nhận, sẽ tự bấm Confirm sau 3 giây...");

    setTimeout(async () => {
      try {
        // Dùng hàm clickButton của selfbot
        await botMessage.clickButton(confirmButton.customId);
        message.reply("✅ Đã tự động bấm nút Confirm thành công!");
      } catch (err1) {
        console.error("Lỗi lần 1:", err1);
        // Thử lại sau 1.5s nếu lỗi
        setTimeout(async () => {
          try {
            await botMessage.clickButton(confirmButton.customId);
            message.reply("✅ Đã bấm Confirm (lần retry)!");
          } catch (err2) {
            console.error("Lỗi lần 2:", err2);
            message.reply("❌ Không thể bấm nút Confirm sau 2 lần thử!");
          }
        }, 1500);
      }
    }, 3000);
  } catch (err) {
    console.error(err);
    message.reply("❌ Lỗi khi thực hiện lệnh OwOsend!");
  }
}
