"""
HiddenCheats - Real-Time Discord Status Bot & Dual-Sync Engine
Implements:
1. /status-update slash command for admins
2. Instant HTTP POST sync to website (https://hiddencheats.net/api/status)
3. Color-coded Discord announcement embeds
4. Embedded lightweight aiohttp HTTP server (GET /api/status) for pull fallback
"""

import os
import sys
import logging
from datetime import datetime
import aiohttp
from aiohttp import web
import discord
from discord import app_commands
from discord.ext import commands

# ----------------- CONFIGURATION -----------------
DISCORD_BOT_TOKEN = os.getenv("DISCORD_BOT_TOKEN", "YOUR_BOT_TOKEN_HERE")
WEBSITE_URL = os.getenv("WEBSITE_URL", "https://hiddencheats.net").rstrip("/")
SYNC_SECRET = os.getenv("SYNC_SECRET", "hc_sync_secret_2026")
ANNOUNCEMENT_CHANNEL_ID = int(os.getenv("ANNOUNCEMENT_CHANNEL_ID", "0"))
BOT_HTTP_PORT = int(os.getenv("BOT_HTTP_PORT", "8080"))

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("HC-StatusBot")

# Supported Cheats Registry
CHEATS_REGISTRY = [
    {"id": "arc-raiders", "name": "Arc Raiders", "game": "arc-raiders", "category": "ARC RAIDERS", "image": "boxes/arc.png"},
    {"id": "krush-arc-raiders", "name": "Krush - Arc Raiders", "game": "arc-raiders", "category": "ARC RAIDERS", "image": "boxes/arc.png"},
    {"id": "inferno-r6-full", "name": "Inferno - R6 Full", "game": "siege-x", "category": "SIEGE X", "image": "boxes/r6.png"},
    {"id": "ancient-r6-external", "name": "Ancient - R6 External", "game": "siege-x", "category": "SIEGE X", "image": "boxes/r6.png"},
    {"id": "r6-lite", "name": "R6 Lite", "game": "siege-x", "category": "SIEGE X", "image": "boxes/r6.png"},
    {"id": "sapphire-unlock-all-r6s", "name": "Sapphire Unlock All - R6S", "game": "siege-x", "category": "SIEGE X", "image": "boxes/r6.png"},
    {"id": "ancient-apex-legends", "name": "Ancient - Apex Legends", "game": "apex-legends", "category": "APEX LEGENDS", "image": "boxes/apex.png"},
    {"id": "apex-pro-external", "name": "Apex Pro External", "game": "apex-legends", "category": "APEX LEGENDS", "image": "boxes/apex.png"},
    {"id": "phantom-mw-warzone", "name": "Phantom - Modern Warfare / Warzone", "game": "call-of-duty", "category": "CALL OF DUTY", "image": "boxes/cod.png"},
    {"id": "cod-dma", "name": "Call of Duty DMA Cheat", "game": "call-of-duty", "category": "CALL OF DUTY", "image": "boxes/cod.png"},
    {"id": "bo7-wz-unlock-all", "name": "BO7 / WZ UNLOCK ALL", "game": "call-of-duty", "category": "CALL OF DUTY", "image": "boxes/cod.png"},
    {"id": "prime-cs2-cheat", "name": "Prime - CS2 Cheat", "game": "counter-strike-2", "category": "COUNTER STRIKE 2", "image": "boxes/valorant.png"},
    {"id": "cs2-esp-aimbot-private", "name": "CS2 ESP & Aimbot Private", "game": "counter-strike-2", "category": "COUNTER STRIKE 2", "image": "boxes/valorant.png"},
    {"id": "oxide-rust-cheat", "name": "Oxide - Rust Cheat", "game": "rust", "category": "RUST", "image": "boxes/rust.png"},
    {"id": "rust-external-esp", "name": "Rust External ESP", "game": "rust", "category": "RUST", "image": "boxes/rust.png"},
    {"id": "vanguard-fortnite", "name": "Vanguard - Fortnite Cheat", "game": "fortnite", "category": "FORTNITE", "image": "boxes/fort.png"},
    {"id": "fortnite-softaim-esp", "name": "Fortnite Softaim & ESP", "game": "fortnite", "category": "FORTNITE", "image": "boxes/fort.png"},
    {"id": "nova-marvel-rivals", "name": "Nova - Marvel Rivals", "game": "marvel-rivals", "category": "MARVEL RIVALS", "image": "boxes/apex.png"},
    {"id": "hidden-spoofer-permanent", "name": "Hidden Spoofer Permanent", "game": "hwid-spoofer", "category": "HWID SPOOFER", "image": "favicon.png"},
    {"id": "hidden-spoofer-temp-cleaner", "name": "Hidden Spoofer Temp + Cleaner", "game": "hwid-spoofer", "category": "HWID SPOOFER", "image": "favicon.png"}
]

# In-memory product state
bot_products_state = {}
for p in CHEATS_REGISTRY:
    bot_products_state[p["id"]] = {
        **p,
        "status": "Undetected",
        "previous_status": "Undetected",
        "notes": "Kernel bypass clear. Fully operational.",
        "last_updated": datetime.utcnow().isoformat() + "Z"
    }

STATUS_COLOR_MAP = {
    "Undetected": 0x34D399,       # Emerald Green
    "Updating": 0xF97316,         # Bright Orange
    "Testing": 0x3B82F6,          # Electric Blue
    "Detected": 0xEF4444,         # Crimson Red
    "Maintenance": 0xEAB308,      # Vivid Yellow
    "Offline": 0x94A3B8,          # Slate Gray
    "Use At Own Risk": 0xF43F5E   # Rose Warning
}

# ----------------- DISCORD BOT SETUP -----------------
intents = discord.Intents.default()
bot = commands.Bot(command_prefix="!", intents=intents)

async def dispatch_sync_to_website(product_id: str, new_status: str, notes: str) -> dict:
    """Dispatches authenticated HTTP POST to website /api/status"""
    url = f"{WEBSITE_URL}/api/status"
    headers = {
        "Content-Type": "application/json",
        "x-sync-secret": SYNC_SECRET
    }
    payload = {
        "id": product_id,
        "status": new_status,
        "notes": notes
    }

    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload, headers=headers, timeout=5) as resp:
                status_code = resp.status
                text = await resp.text()
                logger.info(f"Sync dispatch response [{status_code}]: {text}")
                return {"ok": resp.ok, "status": status_code, "body": text}
    except Exception as e:
        logger.error(f"Failed to dispatch sync to {url}: {e}")
        return {"ok": False, "error": str(e)}

@bot.event
async def on_ready():
    logger.info(f"Bot logged in as {bot.user.name} ({bot.user.id})")
    try:
        synced = await bot.tree.sync()
        logger.info(f"Synced {len(synced)} application commands.")
    except Exception as e:
        logger.error(f"Failed to sync slash commands: {e}")

# Autocomplete for cheats
async def cheat_autocomplete(interaction: discord.Interaction, current: str):
    return [
        app_commands.Choice(name=p["name"], value=p["id"])
        for p in CHEATS_REGISTRY
        if current.lower() in p["name"].lower() or current.lower() in p["id"].lower()
    ][:25]

@bot.tree.command(name="status-update", description="Update cheat status and sync to website in real-time")
@app_commands.describe(
    cheat="The cheat/product to update",
    status="Current status of the bypass/cheat",
    notes="Optional changelog or release note"
)
@app_commands.autocomplete(cheat=cheat_autocomplete)
@app_commands.choices(status=[
    app_commands.Choice(name="🟢 Undetected", value="Undetected"),
    app_commands.Choice(name="🟠 Updating", value="Updating"),
    app_commands.Choice(name="🔵 Testing", value="Testing"),
    app_commands.Choice(name="🔴 Detected", value="Detected"),
    app_commands.Choice(name="🟡 Maintenance", value="Maintenance"),
    app_commands.Choice(name="⚪ Offline", value="Offline"),
    app_commands.Choice(name="⚠️ Use At Own Risk", value="Use At Own Risk")
])
async def status_update(
    interaction: discord.Interaction,
    cheat: str,
    status: app_commands.Choice[str],
    notes: str = ""
):
    await interaction.response.defer(ephemeral=False)

    target = bot_products_state.get(cheat)
    if not target:
        await interaction.followup.send(f"❌ Cheat `{cheat}` not found in registry.", ephemeral=True)
        return

    old_status = target["status"]
    new_status = status.value
    clean_notes = notes.strip() or f"Status changed to {new_status}."

    # Update local state
    target["previous_status"] = old_status
    target["status"] = new_status
    target["notes"] = clean_notes
    target["last_updated"] = datetime.utcnow().isoformat() + "Z"

    # Push to website API
    sync_result = await dispatch_sync_to_website(cheat, new_status, clean_notes)

    # Build Announcement Embed
    embed_color = STATUS_COLOR_MAP.get(new_status, 0x9041EA)
    embed = discord.Embed(
        title=f"🚨 Status Update: {target['name']}",
        description=f"Status has been updated to **{new_status}**.",
        color=embed_color,
        timestamp=datetime.utcnow()
    )
    embed.add_field(name="Game", value=target["category"], inline=True)
    embed.add_field(name="Previous Status", value=old_status, inline=True)
    embed.add_field(name="Current Status", value=f"**{new_status}**", inline=True)
    if clean_notes:
        embed.add_field(name="Changelog / Notes", value=clean_notes, inline=False)

    sync_badge = "✅ Synced to Website (Zero-Reload)" if sync_result.get("ok") else "⚠️ Local Updated (Web Sync Pending)"
    embed.set_footer(text=f"HiddenCheats Status Bot • {sync_badge}", icon_url="https://hiddencheats.net/favicon.png")

    # Post to announcement channel if configured
    if ANNOUNCEMENT_CHANNEL_ID:
        ann_channel = bot.get_channel(ANNOUNCEMENT_CHANNEL_ID)
        if ann_channel:
            try:
                await ann_channel.send(embed=embed)
            except Exception as e:
                logger.error(f"Failed to post in announcement channel: {e}")

    await interaction.followup.send(embed=embed)

# ----------------- HTTP SERVER (PULL FALLBACK) -----------------
async def handle_http_status_get(request):
    """Provides GET /api/status so the website can pull if needed"""
    products = list(bot_products_state.values())
    counts = {
        "total": len(products),
        "undetected": sum(1 for p in products if p["status"] == "Undetected"),
        "updating": sum(1 for p in products if p["status"] == "Updating"),
        "testing": sum(1 for p in products if p["status"] == "Testing"),
        "detected": sum(1 for p in products if p["status"] == "Detected"),
        "maintenance": sum(1 for p in products if p["status"] == "Maintenance"),
        "offline": sum(1 for p in products if p["status"] == "Offline"),
        "use_at_own_risk": sum(1 for p in products if p["status"] == "Use At Own Risk")
    }
    return web.json_response(
        {"success": True, "timestamp": datetime.utcnow().isoformat() + "Z", "counts": counts, "products": products},
        headers={"Access-Control-Allow-Origin": "*"}
    )

async def start_http_server():
    app = web.Application()
    app.router.add_get("/api/status", handle_http_status_get)
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, "0.0.0.0", BOT_HTTP_PORT)
    await site.start()
    logger.info(f"Fallback HTTP Status Server running on port {BOT_HTTP_PORT}")

# ----------------- MAIN RUNNER -----------------
async def main():
    if DISCORD_BOT_TOKEN == "YOUR_BOT_TOKEN_HERE":
        logger.warning("DISCORD_BOT_TOKEN not provided. HTTP server will start for testing.")
    await start_http_server()
    if DISCORD_BOT_TOKEN != "YOUR_BOT_TOKEN_HERE":
        await bot.start(DISCORD_BOT_TOKEN)
    else:
        # Keep process alive if token not yet provided
        import asyncio
        while True:
            await asyncio.sleep(3600)

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
