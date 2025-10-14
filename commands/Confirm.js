// commands/Confirm.js
const pendingMap = new Map(); // key: guildId:channelId → pending info

export function addPending(data) {
  const key = `${data.guildId}:${data.channelId}`;
  pendingMap.set(key, data);
}

export async function handleConfirm(client, message) {
  try {
    const key = `${message.guild?.id}:${message.channel.id}`;
    const pending = pendingMap.get(key);

    if (!pending) return message.reply("⚠️ Không có yêu cầu xác nhận nào đang chờ!");

    if (pending.authorId !== message.author.id)
      return message.reply("⛔ Chỉ người gửi lệnh mới có thể xác nhận!");

    await pending.botMessage.clickButton(pending.confirmButton.customId);

    await message.reply(
      `✅  ${pending.type === "owo" ? "OwO" : "Yubabe"}!`
    );

    pendingMap.delete(key);
  } catch (err) {
    console.error("❌ Lỗi khi bấm Confirm:", err);
    message.reply("❌ Không thể bấm nút Confirm!");
  }
}
