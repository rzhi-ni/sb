// index.js — Multi-account Selfbot Manager (ESM version)
import fs from "fs-extra";
import path from "path";
import inquirer from "inquirer";
import dotenv from "dotenv";
dotenv.config();

import pkg from "discord.js-selfbot-v13";
const { Client } = pkg;

import { handleOwOsend } from "./commands/OwOsend.js";
import { handleYgive } from "./commands/Ygive.js";

const CONFIG_PATH = path.join(process.cwd(), "config.json");

// === Load & lưu config ===
async function loadConfig() {
  if (!(await fs.pathExists(CONFIG_PATH))) {
    await fs.writeJSON(CONFIG_PATH, { accounts: [] }, { spaces: 2 });
  }
  return fs.readJSON(CONFIG_PATH);
}

async function saveConfig(cfg) {
  await fs.writeJSON(CONFIG_PATH, cfg, { spaces: 2 });
}

// === Tạo client mới ===
function makeClient() {
  return new Client({
    checkUpdate: false,
    ws: { properties: { browser: "Discord iOS" } }, // Giúp tránh bị khóa token
  });
}

// === Menu chính ===
async function promptMainMenu(cfg) {
  const choices = cfg.accounts.map((a, i) => ({
    name: `${a.name} (prefix: ${a.prefix})`,
    value: i,
  }));
  choices.push({ name: "➕ Thêm account mới", value: "add" });
  choices.push({ name: "✏️ Chỉnh sửa / Xóa account", value: "edit" });
  choices.push({ name: "❌ Thoát", value: "exit" });

  const { sel } = await inquirer.prompt([
    { type: "list", name: "sel", message: "Chọn account hoặc hành động:", choices },
  ]);
  return sel;
}

// === Thêm account ===
async function promptAddAccount(cfg) {
  const answers = await inquirer.prompt([
    { name: "name", message: "Tên account:", validate: v => v ? true : "Cần tên" },
    { name: "token", message: "Token người dùng:", type: "password", mask: "*", validate: v => v ? true : "Cần token" },
    { name: "prefix", message: "Prefix lệnh (ví dụ: !):", default: "!" },
    { name: "controllers", message: "Danh sách ID controller (phân cách bởi dấu phẩy):", default: "" },
  ]);

  const controllers = answers.controllers.split(",").map(s => s.trim()).filter(Boolean);
  cfg.accounts.push({
    name: answers.name,
    token: answers.token,
    prefix: answers.prefix,
    controllers,
  });

  await saveConfig(cfg);
  console.log("✅ Đã lưu account mới.");
}

// === Chỉnh sửa account ===
async function promptEditAccounts(cfg) {
  if (cfg.accounts.length === 0) {
    console.log("⚠️ Chưa có account để chỉnh sửa.");
    return;
  }

  const choices = cfg.accounts.map((a, i) => ({ name: `${a.name}`, value: i }));
  choices.push({ name: "⬅️ Quay lại", value: "back" });

  const { sel } = await inquirer.prompt([
    { type: "list", name: "sel", message: "Chọn account để chỉnh sửa:", choices },
  ]);
  if (sel === "back") return;

  const acc = cfg.accounts[sel];
  const editChoices = [
    { name: "✏️ Đổi tên", value: "rename" },
    { name: "🔤 Đổi prefix", value: "prefix" },
    { name: "➕ Thêm controller", value: "addc" },
    { name: "➖ Xóa controller", value: "delc" },
    { name: "🗑️ Xóa account", value: "del" },
    { name: "⬅️ Quay lại", value: "back" },
  ];

  const { act } = await inquirer.prompt([
    { type: "list", name: "act", message: `Chỉnh sửa [${acc.name}]`, choices: editChoices },
  ]);

  if (act === "rename") {
    const { name } = await inquirer.prompt([{ name: "name", message: "Tên mới:", default: acc.name }]);
    acc.name = name;
    console.log("✅ Đã đổi tên.");
  } else if (act === "prefix") {
    const { prefix } = await inquirer.prompt([{ name: "prefix", message: "Prefix mới:", default: acc.prefix }]);
    acc.prefix = prefix;
    console.log("✅ Đã cập nhật prefix.");
  } else if (act === "addc") {
    const { ids } = await inquirer.prompt([{ name: "ids", message: "Nhập ID (phân cách bởi dấu phẩy):" }]);
    const news = ids.split(",").map(s => s.trim()).filter(Boolean);
    acc.controllers = [...new Set([...(acc.controllers || []), ...news])];
    console.log("✅ Đã thêm controller.");
  } else if (act === "delc") {
    if (!acc.controllers || acc.controllers.length === 0) {
      console.log("⚠️ Không có controller để xóa.");
    } else {
      const { which } = await inquirer.prompt([
        { type: "checkbox", name: "which", message: "Chọn ID để xóa:", choices: acc.controllers },
      ]);
      acc.controllers = acc.controllers.filter(id => !which.includes(id));
      console.log("✅ Đã xóa controller.");
    }
  } else if (act === "del") {
    const { ok } = await inquirer.prompt([{ type: "confirm", name: "ok", message: `Bạn có chắc muốn xóa account ${acc.name}?` }]);
    if (ok) {
      cfg.accounts.splice(sel, 1);
      console.log("🗑️ Đã xóa account.");
    }
  }

  await saveConfig(cfg);
}

// === Hàm chạy account ===
async function runBotWithAccount(acc) {
  console.log(`🚀 Đang khởi chạy account: ${acc.name} (prefix: ${acc.prefix})`);
  const client = makeClient();

  client.once("ready", () => {
    console.log(`✅ Đăng nhập thành công: ${client.user.tag} (${client.user.id})`);
  });

  client.on("messageCreate", async (message) => {
    if (!message.content || message.author?.bot) return;
    if (!message.content.startsWith(acc.prefix)) return;

    const authorId = message.author.id;
    if (!acc.controllers.includes(authorId)) return; // Chỉ cho controller dùng lệnh

    const args = message.content.slice(acc.prefix.length).trim().split(/\s+/);
    const cmd = args.shift().toLowerCase();

    try {
      if (cmd === "osend") await handleOwOsend(client, message, args);
      else if (cmd === "ysend") await handleYgive(client, message, args);
    } catch (err) {
      console.error("❌ Lỗi khi xử lý lệnh:", err);
    }
  });

  // Auto reconnect khi disconnect
  client.on("disconnected", () => {
    console.warn(`⚠️ Mất kết nối: ${acc.name}, đang thử đăng nhập lại sau 10s...`);
    setTimeout(() => client.login(acc.token).catch(() => {}), 10000);
  });

  // Auto restart nếu lỗi
  client.on("error", (err) => {
    console.error(`❌ Lỗi mạng cho ${acc.name}:`, err.message);
  });

  try {
    await client.login(acc.token);
  } catch (err) {
    console.error(`❌ Token lỗi hoặc bị ban cho ${acc.name}: ${err.message}`);
  }
}

// === Menu chính ===
(async () => {
  const cfg = await loadConfig();

  while (true) {
    const sel = await promptMainMenu(cfg);

    if (sel === "exit") {
      console.log("👋 Tạm biệt!");
      process.exit(0);
    } else if (sel === "add") {
      await promptAddAccount(cfg);
    } else if (sel === "edit") {
      await promptEditAccounts(cfg);
    } else if (typeof sel === "number") {
      const acc = cfg.accounts[sel];
      if (!acc) {
        console.log("⚠️ Account không tồn tại.");
        continue;
      }
      await runBotWithAccount(acc);
      break;
    }
  }
})();

