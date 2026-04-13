import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BOT_TOKEN = "8579323983:AAHHba3AN9pzJKfbKcVBG8B0bs9N1okvrys";
const CHAT_ID = "-1003779092888";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      console.log("[telegram-send] Missing or empty text field");
      return new Response(
        JSON.stringify({ ok: false, error: "Missing text field" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("[telegram-send] Sending message to channel", { chatId: CHAT_ID, preview: text.slice(0, 60) });

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: text.trim(),
          parse_mode: "HTML",
        }),
      }
    );

    const telegramData = await telegramRes.json();

    if (!telegramData.ok) {
      console.error("[telegram-send] Telegram API error", telegramData);
      return new Response(
        JSON.stringify({ ok: false, error: telegramData.description }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("[telegram-send] Message sent successfully", { messageId: telegramData.result?.message_id });

    return new Response(
      JSON.stringify({ ok: true, message_id: telegramData.result?.message_id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[telegram-send] Unexpected error", { error: String(err) });
    return new Response(
      JSON.stringify({ ok: false, error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
