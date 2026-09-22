# HiddenCheats Discord Status Bot (Dual-Sync)

Real-time Discord bot powering the HiddenCheats status page with zero-reload synchronization.

## Features
- **Slash Command:** `/status-update` with autocomplete for all 19 cheats and 7 status states.
- **Bot Push:** Automatically sends authenticated HTTP `POST` to `https://hiddencheats.net/api/status` with `x-sync-secret`.
- **Embed Announcements:** Posts stylized embeds matching the status color in your designated `#cheat-status` channel.
- **Server Pull Fallback:** Includes a built-in aiohttp server (`GET /api/status`) so your website can pull from the bot if webhooks fail.

## Quickstart

### 1. Install Dependencies
```bash
pip install discord.py aiohttp
```

### 2. Configure Environment Variables
Create a `.env` file or export in your environment:
```env
DISCORD_BOT_TOKEN="your_bot_token_from_discord_developer_portal"
WEBSITE_URL="https://hiddencheats.net"
SYNC_SECRET="hc_sync_secret_2026"
ANNOUNCEMENT_CHANNEL_ID="123456789012345678"  # Optional: channel ID for live updates
BOT_HTTP_PORT=8080                            # Port for the pull fallback server
```

### 3. Run the Bot
```bash
python bot/discord_status_bot.py
```
Or using PM2 for 24/7 uptime:
```bash
pm2 start bot/discord_status_bot.py --name "hc-status-bot" --interpreter python3
```
