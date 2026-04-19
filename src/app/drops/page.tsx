"use client";
import { useState, useCallback } from "react";

const GOLD = "#b08e50";
const GOLD_DIM = "rgba(176,142,80,0.55)";
const GOLD_20 = "rgba(176,142,80,0.2)";
const GOLD_10 = "rgba(176,142,80,0.1)";
const GREEN = "#3fb950";
const BLUE = "#58a6ff";
const RED = "#e05c5c";
const AMBER = "#f0883e";
const BG = "#04060a";

// ─── 100 Message Drops ───────────────────────────────────────────────────────
// Organized by angle. All ready to post. All in the Mākoa voice.

type Drop = {
  id: number;
  text: string;
  tag: string;
  color: string;
  platform: string;
};

const ALL_DROPS: Drop[] = [
  // ── ISOLATION / LONELINESS ──────────────────────────────────────────────
  { id: 1, tag: "TRUTH", color: RED, platform: "FB · IG · X", text: "Most men have no one to call at 2am.\n\nNot because they're unlikeable.\n\nBecause they never built the kind of friendship that survives 2am.\n\nMākoa exists to fix that.\n\nmakoa.live/gate" },
  { id: 2, tag: "TRUTH", color: RED, platform: "FB · IG", text: "I had 400 Facebook friends and no one to call when my world fell apart.\n\nThat's not a social media problem.\n\nThat's a brotherhood problem.\n\nmakoa.live/gate" },
  { id: 3, tag: "TRUTH", color: RED, platform: "FB · IG · X", text: "1 in 10 men has zero close friends.\n\nNot few.\n\nZero.\n\nThis is the real epidemic.\n\nmakoa.live" },
  { id: 4, tag: "TRUTH", color: RED, platform: "FB", text: "Men are dying from loneliness.\n\nNot dramatically. Slowly.\n\nThrough silence. Through performance. Through carrying weight no one sees.\n\nThe order exists because this is unacceptable.\n\nmakoa.live/gate" },
  { id: 5, tag: "TRUTH", color: RED, platform: "IG · X", text: "You can be surrounded by people and still be completely alone.\n\nMost men know exactly what that feels like.\n\nmakoa.live/gate" },
  { id: 6, tag: "TRUTH", color: RED, platform: "FB · IG", text: "The average man hasn't made a new real friend in 5 years.\n\nFive years.\n\nWe built Mākoa because that number is a crisis.\n\nmakoa.live" },
  { id: 7, tag: "TRUTH", color: RED, platform: "FB", text: "Nobody talks about how lonely it is to be a man who has everything on paper.\n\nGood job. Good family. Good life.\n\nAnd still — no one who actually knows you.\n\nmakoa.live/gate" },
  { id: 8, tag: "TRUTH", color: RED, platform: "IG · X", text: "Performing strength is exhausting.\n\nActually building it — with brothers who hold you accountable — that's different.\n\nThat's Mākoa.\n\nmakoa.live" },

  // ── BROTHERHOOD / WHAT IT IS ────────────────────────────────────────────
  { id: 9, tag: "WHAT", color: GOLD, platform: "FB · IG", text: "Brotherhood isn't a feeling.\n\nIt's a man who shows up at 4am.\nA man who tells you the truth when you don't want to hear it.\nA man who carries your weight when you can't.\n\nThat's what we're building.\n\nmakoa.live" },
  { id: 10, tag: "WHAT", color: GOLD, platform: "IG · X", text: "Mākoa is not a club.\nNot a gym.\nNot a retreat.\n\nIt's a brotherhood of men who actually show up.\n\nmakoa.live/gate" },
  { id: 11, tag: "WHAT", color: GOLD, platform: "FB", text: "We meet the first weekend of every month.\nWe train at 4am.\nWe hold each other accountable.\nWe don't perform strength — we build it.\n\nWest Oahu. Real men. Real work.\n\nmakoa.live/gate" },
  { id: 12, tag: "WHAT", color: GOLD, platform: "IG · X", text: "The 808 is our signal.\n\nEvery brother in the order has it.\n\nWhen you need someone — the signal goes out.\nBrothers respond.\n\nNo dead ends.\n\nmakoa.live" },
  { id: 13, tag: "WHAT", color: GOLD, platform: "FB · IG", text: "Three classes. One order.\n\nAliʻi — the leaders.\nMana — the builders.\nNā Koa — the warriors.\n\nXI places you where you belong.\n\nmakoa.live/gate" },
  { id: 14, tag: "WHAT", color: GOLD, platform: "FB", text: "We swear brothers in under the full moon.\n\nNot because it's dramatic.\n\nBecause a man needs a moment he can point to and say: that's when I chose differently.\n\nmakoa.live/gate" },
  { id: 15, tag: "WHAT", color: GOLD, platform: "IG · X", text: "The ice bath is free.\nThe training is free.\nThe brotherhood is free.\n\nThe only cost is showing up.\n\nmakoa.live/gate" },
  { id: 16, tag: "WHAT", color: GOLD, platform: "FB · IG", text: "We don't talk about our feelings.\n\nWe train. We work. We build.\n\nAnd somewhere in that — the real conversations happen.\n\nmakoa.live" },

  // ── WEST OAHU / LOCAL ───────────────────────────────────────────────────
  { id: 17, tag: "LOCAL", color: BLUE, platform: "FB · IG", text: "West Oahu has always had the hardest working men on the island.\n\nThey just never had a brotherhood to match.\n\nUntil now.\n\nmakoa.live/gate" },
  { id: 18, tag: "LOCAL", color: BLUE, platform: "FB", text: "Waianae. Kapolei. Ewa. Makaha. Nanakuli.\n\nThis is where the order was born.\n\nThis is where it stays.\n\nmakoa.live" },
  { id: 19, tag: "LOCAL", color: BLUE, platform: "IG · X", text: "The men of West Oahu don't need a retreat.\n\nThey need a brotherhood that meets them where they are.\n\n4am. Local. Real.\n\nmakoa.live/gate" },
  { id: 20, tag: "LOCAL", color: BLUE, platform: "FB · IG", text: "If you're from the west side — you already know what this is.\n\nYou've been waiting for it.\n\nmakoa.live/gate" },
  { id: 21, tag: "LOCAL", color: BLUE, platform: "FB", text: "We train at Ko Olina. We gather at Makaha. We build in Kapolei.\n\nThis is a West Oahu brotherhood.\n\nNot a brand. Not a business.\n\nA brotherhood.\n\nmakoa.live" },
  { id: 22, tag: "LOCAL", color: BLUE, platform: "IG · X", text: "The Waianae range at 4am.\n\nThat's where we train.\n\nIf you know — you know.\n\nmakoa.live/gate" },

  // ── MAYDAY / EVENT ──────────────────────────────────────────────────────
  { id: 23, tag: "EVENT", color: AMBER, platform: "FB · IG", text: "May 1st. West Oahu. The founding fire.\n\n8 seats remain.\n\nThis is the only time founding membership will ever be offered.\n\nmakoa.live/gate" },
  { id: 24, tag: "EVENT", color: AMBER, platform: "IG · X", text: "MAYDAY 2026.\n\nNot a conference.\nNot a seminar.\n\nA founding fire.\n\nmakoa.live/gate" },
  { id: 25, tag: "EVENT", color: AMBER, platform: "FB", text: "48 hours.\n\nIce bath at dawn.\nWar room at noon.\nFounding oath at midnight.\n\nMay 1–3. West Oahu.\n\nmakoa.live/gate" },
  { id: 26, tag: "EVENT", color: AMBER, platform: "IG · X", text: "The gate closes April 25.\n\nAfter that — the founding brothers have been chosen.\n\nThe door stays open. But founding status is gone.\n\nmakoa.live/gate" },
  { id: 27, tag: "EVENT", color: AMBER, platform: "FB · IG", text: "Day Pass. Mastermind. War Room.\n\nThree ways in. One founding fire.\n\nMay 1–3. West Oahu.\n\nmakoa.live/gate" },
  { id: 28, tag: "EVENT", color: AMBER, platform: "FB", text: "The men who are at MAYDAY will be the founding council of the Mākoa Order.\n\nThat's not marketing.\n\nThat's the actual structure.\n\nmakoa.live/gate" },

  // ── MYSTERY / INTRIGUE ──────────────────────────────────────────────────
  { id: 29, tag: "MYSTERY", color: GOLD_DIM, platform: "IG · X · FB", text: "👁\n\nmakoa.live" },
  { id: 30, tag: "MYSTERY", color: GOLD_DIM, platform: "IG · X", text: "The gate is open.\n\nNot for everyone.\n\nmakoa.live" },
  { id: 31, tag: "MYSTERY", color: GOLD_DIM, platform: "FB · IG", text: "Someone asked me what Mākoa is.\n\nI told them: you'll know when you're ready.\n\nIf you're asking — you're ready.\n\nmakoa.live/gate" },
  { id: 32, tag: "MYSTERY", color: GOLD_DIM, platform: "IG · X", text: "Not everyone gets in.\n\nNot because we're exclusive.\n\nBecause brotherhood requires something from you.\n\nmakoa.live/gate" },
  { id: 33, tag: "MYSTERY", color: GOLD_DIM, platform: "FB", text: "The conversation we had in the brotherhood channel last night is why I built this.\n\nI can't post what was said here.\n\nIt's too real.\n\nmakoa.live/gate" },
  { id: 34, tag: "MYSTERY", color: GOLD_DIM, platform: "IG · X", text: "Some things aren't for everyone.\n\nThis is one of them.\n\nmakoa.live" },
  { id: 35, tag: "MYSTERY", color: GOLD_DIM, platform: "FB · IG", text: "XI reads every application.\n\nNot a bot. Not a form.\n\nThe intelligence of the order.\n\nmakoa.live/gate" },

  // ── ACCOUNTABILITY / GROWTH ─────────────────────────────────────────────
  { id: 36, tag: "GROWTH", color: GREEN, platform: "FB · IG", text: "The man you want to be is on the other side of accountability.\n\nNot motivation.\n\nAccountability.\n\nBrothers who call you out. Brothers who show up. Brothers who don't let you quit.\n\nmakoa.live/gate" },
  { id: 37, tag: "GROWTH", color: GREEN, platform: "IG · X", text: "You don't need another podcast.\n\nYou need a brother who'll call you at 6am and ask why you didn't show up.\n\nmakoa.live/gate" },
  { id: 38, tag: "GROWTH", color: GREEN, platform: "FB", text: "The 4am training isn't about fitness.\n\nIt's about proving to yourself — before the world wakes up — that you're the man you say you are.\n\nmakoa.live/gate" },
  { id: 39, tag: "GROWTH", color: GREEN, platform: "IG · X", text: "Iron sharpens iron.\n\nBut only if you're in the room.\n\nmakoa.live/gate" },
  { id: 40, tag: "GROWTH", color: GREEN, platform: "FB · IG", text: "The version of you that your family needs — that man is built in the dark.\n\nAt 4am.\nIn the cold.\nWith brothers who hold the standard.\n\nmakoa.live" },
  { id: 41, tag: "GROWTH", color: GREEN, platform: "FB", text: "Motivation fades.\n\nAccountability doesn't.\n\nThat's why we built a brotherhood instead of a program.\n\nmakoa.live/gate" },
  { id: 42, tag: "GROWTH", color: GREEN, platform: "IG · X", text: "You can't hold yourself accountable.\n\nYou need someone who loves you enough to tell you the truth.\n\nThat's a brother.\n\nmakoa.live" },

  // ── FAMILY / FATHERS ────────────────────────────────────────────────────
  { id: 43, tag: "FAMILY", color: BLUE, platform: "FB · IG", text: "The best thing you can do for your kids is become the man they need you to be.\n\nNot the man you perform.\n\nThe man you actually are.\n\nmakoa.live/gate" },
  { id: 44, tag: "FAMILY", color: BLUE, platform: "FB", text: "My kids don't need a perfect father.\n\nThey need a father who keeps showing up.\n\nWho keeps doing the work.\n\nWho doesn't quit when it gets hard.\n\nMākoa is where I do that work.\n\nmakoa.live" },
  { id: 45, tag: "FAMILY", color: BLUE, platform: "IG · X", text: "A man who has brothers is a better husband.\n\nA better father.\n\nA better man.\n\nThis is not an opinion. It's documented.\n\nmakoa.live/gate" },
  { id: 46, tag: "FAMILY", color: BLUE, platform: "FB · IG", text: "Your wife doesn't need you to be perfect.\n\nShe needs you to be present.\n\nAnd you can't be present when you're carrying everything alone.\n\nmakoa.live/gate" },
  { id: 47, tag: "FAMILY", color: BLUE, platform: "FB", text: "I used to come home empty.\n\nNothing left to give.\n\nBecause I had no one to fill me back up.\n\nBrotherhood fixed that.\n\nmakoa.live" },

  // ── WORK / TRADE / INCOME ───────────────────────────────────────────────
  { id: 48, tag: "TRADE", color: AMBER, platform: "FB · IG", text: "You keep 80% of what you earn.\n\nThe house keeps 10%.\n\nThe order keeps 10%.\n\nThat's the cooperative model.\n\nThat's Mākoa Trade Co.\n\nmakoa.live" },
  { id: 49, tag: "TRADE", color: AMBER, platform: "FB", text: "Your trade is worth more inside the order than outside it.\n\nBecause inside the order — brothers refer brothers.\n\nNo middleman. No commission. Brotherhood rate.\n\nmakoa.live/gate" },
  { id: 50, tag: "TRADE", color: AMBER, platform: "IG · X", text: "A route of 20 stops.\n\n$3,750–$6,225 a month.\n\nYou keep 80%.\n\nThat's the Mana path.\n\nmakoa.live/gate" },
  { id: 51, tag: "TRADE", color: AMBER, platform: "FB · IG", text: "The order doesn't just build men.\n\nIt builds income.\n\nService routes. Trade skills. B2B referrals.\n\nBrotherhood that pays.\n\nmakoa.live" },
  { id: 52, tag: "TRADE", color: AMBER, platform: "FB", text: "If you have a trade — the order needs you.\n\nElectrician. Plumber. Landscaper. Contractor. Driver.\n\nYour skill becomes the backbone of what we build.\n\nmakoa.live/gate" },

  // ── SHORT PUNCHES (IG/X/TikTok captions) ───────────────────────────────
  { id: 53, tag: "PUNCH", color: RED, platform: "IG · X · TikTok", text: "Show up at 4am.\n\nEverything else is negotiable.\n\nmakoa.live" },
  { id: 54, tag: "PUNCH", color: RED, platform: "IG · X", text: "The oath is simple.\n\nShow up.\nTell the truth.\nCarry your brother.\n\nmakoa.live" },
  { id: 55, tag: "PUNCH", color: RED, platform: "IG · X · TikTok", text: "Brotherhood is not a feeling.\n\nIt's a decision you make every Wednesday at 4am.\n\nmakoa.live" },
  { id: 56, tag: "PUNCH", color: RED, platform: "IG · X", text: "The gate is free.\n\nThe brotherhood is earned.\n\nmakoa.live/gate" },
  { id: 57, tag: "PUNCH", color: RED, platform: "IG · X · TikTok", text: "You don't find brotherhood.\n\nYou build it.\n\nmakoa.live" },
  { id: 58, tag: "PUNCH", color: RED, platform: "IG · X", text: "The man who shows up at 4am when no one is watching —\n\nthat's the man his family needs.\n\nmakoa.live" },
  { id: 59, tag: "PUNCH", color: RED, platform: "IG · X · TikTok", text: "Isolation is the enemy.\n\nBrotherhood is the medicine.\n\nmakoa.live" },
  { id: 60, tag: "PUNCH", color: RED, platform: "IG · X", text: "Under the Malu — I am Mākoa.\n\nmakoa.live/gate" },
  { id: 61, tag: "PUNCH", color: RED, platform: "IG · X · TikTok", text: "The order doesn't need perfect men.\n\nIt needs honest ones.\n\nmakoa.live/gate" },
  { id: 62, tag: "PUNCH", color: RED, platform: "IG · X", text: "You've been carrying it alone long enough.\n\nmakoa.live/gate" },

  // ── QUESTIONS (engagement bait) ─────────────────────────────────────────
  { id: 63, tag: "ENGAGE", color: BLUE, platform: "FB · IG", text: "When's the last time a man told you the truth about yourself?\n\nNot to hurt you.\n\nBecause he cared enough.\n\nThat's what brothers do.\n\nmakoa.live" },
  { id: 64, tag: "ENGAGE", color: BLUE, platform: "FB", text: "If your world fell apart tonight — who would you call?\n\nIf you hesitated on that answer — this is for you.\n\nmakoa.live/gate" },
  { id: 65, tag: "ENGAGE", color: BLUE, platform: "IG · X", text: "What would change in your life if you had 5 real brothers?\n\nNot followers. Not coworkers.\n\nBrothers.\n\nmakoa.live" },
  { id: 66, tag: "ENGAGE", color: BLUE, platform: "FB · IG", text: "What's the hardest thing you've built?\n\nThat's the first question XI asks at the gate.\n\nmakoa.live/gate" },
  { id: 67, tag: "ENGAGE", color: BLUE, platform: "FB", text: "How many men can you call at 2am?\n\nBe honest.\n\nIf the answer is zero — the gate is open.\n\nmakoa.live/gate" },
  { id: 68, tag: "ENGAGE", color: BLUE, platform: "IG · X", text: "What word describes why you're here?\n\nOne word.\n\nThat's the last question at the gate.\n\nmakoa.live/gate" },

  // ── STORY / NARRATIVE ───────────────────────────────────────────────────
  { id: 69, tag: "STORY", color: GOLD, platform: "FB · IG", text: "I sat in my truck for 20 minutes before going inside.\n\nEvery night.\n\nNot because of traffic.\n\nBecause I had nothing left to give.\n\nI built Mākoa because I was that man.\n\nmakoa.live/gate" },
  { id: 70, tag: "STORY", color: GOLD, platform: "FB", text: "I looked for what I needed.\n\nI found retreats that cost $10,000.\nI found therapy groups that made me feel broken.\nI found men who talked about their feelings but never held each other accountable.\n\nSo I built what I needed.\n\nmakoa.live" },
  { id: 71, tag: "STORY", color: GOLD, platform: "FB · IG", text: "The first time I trained at 4am with brothers — I cried on the drive home.\n\nNot because it was hard.\n\nBecause I realized I'd been carrying it alone for years.\n\nmakoa.live/gate" },
  { id: 72, tag: "STORY", color: GOLD, platform: "FB", text: "A brother called me at 2am last month.\n\nHe didn't say much.\n\nI just stayed on the line.\n\nThat's the whole thing. That's Mākoa.\n\nmakoa.live" },
  { id: 73, tag: "STORY", color: GOLD, platform: "FB · IG", text: "The night we swore in the first brothers under the full moon —\n\nI knew this was real.\n\nNot a program. Not a brand.\n\nA brotherhood.\n\nmakoa.live/gate" },

  // ── COUNTER-CULTURE ─────────────────────────────────────────────────────
  { id: 74, tag: "COUNTER", color: AMBER, platform: "FB · IG · X", text: "Men don't need to be fixed.\n\nThey need to be challenged.\n\nThere's a difference.\n\nmakoa.live" },
  { id: 75, tag: "COUNTER", color: AMBER, platform: "FB · IG", text: "We don't do vulnerability circles.\n\nWe do ice baths.\n\nThe vulnerability happens after.\n\nmakoa.live/gate" },
  { id: 76, tag: "COUNTER", color: AMBER, platform: "IG · X", text: "This isn't a men's wellness retreat.\n\nIt's a brotherhood.\n\nThere's a difference.\n\nmakoa.live" },
  { id: 77, tag: "COUNTER", color: AMBER, platform: "FB · IG", text: "We don't talk about masculinity.\n\nWe practice it.\n\nEvery Wednesday. 4am.\n\nmakoa.live/gate" },
  { id: 78, tag: "COUNTER", color: AMBER, platform: "IG · X", text: "The world has enough men's groups that meet once and never follow up.\n\nMākoa is different.\n\nWe show up every week.\n\nmakoa.live" },
  { id: 79, tag: "COUNTER", color: AMBER, platform: "FB", text: "You don't need a $10,000 retreat.\n\nYou need a brother who lives 10 minutes away and will show up at 4am.\n\nThat's what we built.\n\nmakoa.live/gate" },

  // ── INVITATION / DIRECT ─────────────────────────────────────────────────
  { id: 80, tag: "INVITE", color: GREEN, platform: "FB · IG", text: "If you're a man on Oahu who's been waiting for something real —\n\nthe gate is open.\n\nmakoa.live/gate" },
  { id: 81, tag: "INVITE", color: GREEN, platform: "IG · X", text: "12 questions.\n3 minutes.\nOne path in.\n\nmakoa.live/gate" },
  { id: 82, tag: "INVITE", color: GREEN, platform: "FB · IG", text: "The application is free.\n\nXI reads every answer.\n\nIf you're the man we're looking for — you'll know.\n\nmakoa.live/gate" },
  { id: 83, tag: "INVITE", color: GREEN, platform: "FB", text: "Tag a man who needs this.\n\nNot because he's broken.\n\nBecause he's ready.\n\nmakoa.live/gate" },
  { id: 84, tag: "INVITE", color: GREEN, platform: "IG · X", text: "The founding brothers are being chosen now.\n\nThis is the only time this will ever happen.\n\nmakoa.live/gate" },
  { id: 85, tag: "INVITE", color: GREEN, platform: "FB · IG", text: "You've been watching from the outside long enough.\n\nThe gate is open.\n\nmakoa.live/gate" },

  // ── WAHINE / WOMEN ──────────────────────────────────────────────────────
  { id: 86, tag: "WAHINE", color: GOLD_DIM, platform: "FB · IG", text: "To the women who watch their men carry it alone —\n\nMākoa is what you've been hoping someone would build.\n\nmakoa.live/wahine" },
  { id: 87, tag: "WAHINE", color: GOLD_DIM, platform: "FB", text: "The Wahine Circle is for the women who stand with the brotherhood.\n\nNot to fix their men.\n\nTo understand what transformation actually looks like.\n\nmakoa.live/wahine" },
  { id: 88, tag: "WAHINE", color: GOLD_DIM, platform: "FB · IG", text: "If your man has been different lately —\n\nmore present, more grounded, more himself —\n\nask him about Mākoa.\n\nmakoa.live" },

  // ── CRISIS / MENTAL HEALTH ──────────────────────────────────────────────
  { id: 89, tag: "CRISIS", color: RED, platform: "FB · IG", text: "Men are 4x more likely to die by suicide than women.\n\nThe number one reason isn't depression.\n\nIt's isolation.\n\nBrotherhood is not a luxury. It is medicine.\n\nmakoa.live" },
  { id: 90, tag: "CRISIS", color: RED, platform: "FB", text: "If you're in crisis right now —\n\nCall or text 988.\n\nAnd when you're ready — the gate is open.\n\nmakoa.live/gate" },
  { id: 91, tag: "CRISIS", color: RED, platform: "FB · IG", text: "The 808 is always open.\n\nNo man in this order carries alone.\n\nmakoa.live" },

  // ── COUNTDOWN / URGENCY ─────────────────────────────────────────────────
  { id: 92, tag: "URGENT", color: RED, platform: "IG · FB · X", text: "Gate closes April 25.\n\n8 seats.\n\nmakoa.live/gate" },
  { id: 93, tag: "URGENT", color: RED, platform: "IG · X", text: "The founding fire is May 1.\n\nThe gate closes April 25.\n\nThis is the last call.\n\nmakoa.live/gate" },
  { id: 94, tag: "URGENT", color: RED, platform: "FB · IG", text: "Someone claimed a seat this morning.\n\n7 remain.\n\nmakoa.live/gate" },
  { id: 95, tag: "URGENT", color: RED, platform: "IG · X", text: "After April 25 — the founding brothers have been chosen.\n\nThe door stays open.\n\nBut founding status is gone forever.\n\nmakoa.live/gate" },

  // ── PHILOSOPHY / DEPTH ──────────────────────────────────────────────────
  { id: 96, tag: "DEEP", color: GOLD, platform: "FB · IG", text: "A man without brothers is a man without a mirror.\n\nHe can't see his blind spots.\nHe can't hear his own lies.\nHe can't grow past what he already knows.\n\nBrotherhood is the mirror.\n\nmakoa.live" },
  { id: 97, tag: "DEEP", color: GOLD, platform: "FB", text: "The oath is not a promise to be perfect.\n\nIt's a promise to keep showing up.\n\nEven when you don't want to.\nEven when you're broken.\nEven when you have nothing left.\n\nEspecially then.\n\nmakoa.live" },
  { id: 98, tag: "DEEP", color: GOLD, platform: "FB · IG", text: "We don't build men.\n\nWe build the conditions where men build themselves.\n\nBrotherhood. Accountability. Presence.\n\nmakoa.live" },
  { id: 99, tag: "DEEP", color: GOLD, platform: "FB · IG", text: "The Malu is the shade of the breadfruit tree.\n\nUnder it — every man is protected.\nUnder it — no man carries alone.\n\nUnder the Malu — I am Mākoa.\n\nmakoa.live" },
  { id: 100, tag: "DEEP", color: GOLD, platform: "FB · IG", text: "Makoa exists because men are dying in silence.\n\nNot from bullets.\n\nFrom isolation.\nFrom carrying weight no one sees.\nFrom performing strength while breaking inside.\n\nThis order was built so no man carries alone.\n\nmakoa.live/gate" },
];

const TAGS = ["ALL", "TRUTH", "WHAT", "LOCAL", "EVENT", "MYSTERY", "GROWTH", "FAMILY", "TRADE", "PUNCH", "ENGAGE", "STORY", "COUNTER", "INVITE", "WAHINE", "CRISIS", "URGENT", "DEEP"];

const TAG_COLORS: Record<string, string> = {
  TRUTH: RED, WHAT: GOLD, LOCAL: BLUE, EVENT: AMBER, MYSTERY: GOLD_DIM,
  GROWTH: GREEN, FAMILY: BLUE, TRADE: AMBER, PUNCH: RED, ENGAGE: BLUE,
  STORY: GOLD, COUNTER: AMBER, INVITE: GREEN, WAHINE: GOLD_DIM, CRISIS: RED,
  URGENT: RED, DEEP: GOLD,
};

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={e => {
        e.stopPropagation();
        navigator.clipboard?.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        });
      }}
      style={{
        background: copied ? "rgba(63,185,80,0.15)" : "rgba(176,142,80,0.08)",
        border: `1px solid ${copied ? "rgba(63,185,80,0.5)" : "rgba(176,142,80,0.2)"}`,
        color: copied ? GREEN : GOLD,
        fontSize: "0.34rem", letterSpacing: "0.1em",
        padding: "5px 10px", borderRadius: 4, cursor: "pointer",
        fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
        transition: "all 0.15s", flexShrink: 0,
        whiteSpace: "nowrap",
      }}
    >
      {copied ? "✓" : "COPY"}
    </button>
  );
}

function CopyAllBtn({ drops }: { drops: Drop[] }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        const all = drops.map(d => d.text).join("\n\n---\n\n");
        navigator.clipboard?.writeText(all).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }}
      style={{
        background: copied ? "rgba(63,185,80,0.15)" : GOLD,
        border: `1px solid ${copied ? "rgba(63,185,80,0.5)" : GOLD}`,
        color: copied ? GREEN : "#000",
        fontSize: "0.4rem", letterSpacing: "0.12em",
        padding: "10px 18px", borderRadius: 6, cursor: "pointer",
        fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
        transition: "all 0.15s",
      }}
    >
      {copied ? `✓ ${drops.length} COPIED` : `COPY ALL ${drops.length}`}
    </button>
  );
}

export default function DropsPage() {
  const [activeTag, setActiveTag] = useState("ALL");
  const [search, setSearch] = useState("");
  const [shuffled, setShuffled] = useState(false);
  const [displayDrops, setDisplayDrops] = useState(ALL_DROPS);

  const filtered = displayDrops.filter(d => {
    const tagMatch = activeTag === "ALL" || d.tag === activeTag;
    const searchMatch = !search || d.text.toLowerCase().includes(search.toLowerCase()) || d.tag.toLowerCase().includes(search.toLowerCase());
    return tagMatch && searchMatch;
  });

  const shuffle = useCallback(() => {
    setDisplayDrops(prev => [...prev].sort(() => Math.random() - 0.5));
    setShuffled(true);
    setTimeout(() => setShuffled(false), 600);
  }, []);

  return (
    <div style={{
      minHeight: "100vh", background: BG,
      fontFamily: "'JetBrains Mono', monospace", color: "#e8e0d0",
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes flash { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
        .drop-card:hover { border-color: rgba(176,142,80,0.3) !important; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(176,142,80,0.2); border-radius: 2px; }
      `}</style>

      {/* ── STICKY HEADER ─────────────────────────────────────────────────── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 20,
        background: "rgba(4,6,10,0.97)", backdropFilter: "blur(8px)",
        borderBottom: `1px solid ${GOLD_20}`,
        padding: "14px 16px 0",
      }}>
        {/* Title row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
              color: GOLD, fontSize: "1.3rem", margin: 0, lineHeight: 1,
            }}>
              Message Drops
            </p>
            <p style={{ color: GOLD_DIM, fontSize: "0.34rem", letterSpacing: "0.22em", marginTop: 3 }}>
              {ALL_DROPS.length} POSTS · COPY · POST · REPEAT
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={shuffle}
              style={{
                background: "rgba(88,166,255,0.08)", border: "1px solid rgba(88,166,255,0.25)",
                color: BLUE, fontSize: "0.36rem", letterSpacing: "0.1em",
                padding: "7px 12px", borderRadius: 5, cursor: "pointer",
                fontFamily: "'JetBrains Mono', monospace",
                animation: shuffled ? "flash 0.6s ease" : "none",
              }}
            >
              ⟳ SHUFFLE
            </button>
            <CopyAllBtn drops={filtered} />
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search drops..."
          style={{
            width: "100%", padding: "8px 12px", marginBottom: 10,
            background: "rgba(0,0,0,0.4)", border: "1px solid rgba(176,142,80,0.15)",
            borderRadius: 6, color: "#e8e0d0", fontSize: "0.44rem",
            fontFamily: "'JetBrains Mono', monospace", outline: "none",
            boxSizing: "border-box",
          }}
        />

        {/* Tag filter — scrollable */}
        <div style={{
          display: "flex", gap: 5, overflowX: "auto", paddingBottom: 10,
          scrollbarWidth: "none",
        }}>
          {TAGS.map(tag => {
            const isActive = activeTag === tag;
            const color = tag === "ALL" ? GOLD : (TAG_COLORS[tag] || GOLD);
            const count = tag === "ALL" ? ALL_DROPS.length : ALL_DROPS.filter(d => d.tag === tag).length;
            return (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                style={{
                  background: isActive ? color : "transparent",
                  border: `1px solid ${isActive ? color : "rgba(176,142,80,0.15)"}`,
                  color: isActive ? "#000" : "rgba(232,224,208,0.45)",
                  fontSize: "0.32rem", letterSpacing: "0.1em",
                  padding: "4px 9px", borderRadius: 4, cursor: "pointer",
                  fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                  whiteSpace: "nowrap", flexShrink: 0,
                  transition: "all 0.15s",
                }}
              >
                {tag} {count > 0 && !isActive ? <span style={{ opacity: 0.5 }}>({count})</span> : ""}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── GARY VEE BANNER ───────────────────────────────────────────────── */}
      <div style={{ padding: "16px 16px 0", maxWidth: 680, margin: "0 auto" }}>
        <div style={{
          background: "rgba(176,142,80,0.04)", border: `1px solid ${GOLD_20}`,
          borderRadius: 10, padding: "14px 16px", marginBottom: 16,
          display: "flex", gap: 12, alignItems: "flex-start",
        }}>
          <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>⚡</span>
          <div>
            <p style={{ color: GOLD, fontSize: "0.42rem", letterSpacing: "0.12em", marginBottom: 6 }}>
              THE GARY VEE MODEL — ADAPTED FOR MĀKOA
            </p>
            <p style={{ color: "rgba(232,224,208,0.55)", fontSize: "0.44rem", lineHeight: 1.7, margin: 0 }}>
              Gary posts 100+ pieces of content a day. All text. All different angles. Same core message. You don't need a camera. You don't need a face. You need to post the truth — every day — in every format — until the right man sees it. <span style={{ color: GOLD }}>Pick 5 drops. Post them today. Pick 5 more tomorrow.</span>
            </p>
          </div>
        </div>

        {/* Count + result */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 12,
        }}>
          <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.38rem" }}>
            Showing <span style={{ color: GOLD }}>{filtered.length}</span> drops
            {activeTag !== "ALL" && <span style={{ color: GOLD_DIM }}> · {activeTag}</span>}
          </p>
          {filtered.length > 0 && <CopyAllBtn drops={filtered} />}
        </div>

        {/* ── DROP GRID ─────────────────────────────────────────────────── */}
        <div style={{ display: "grid", gap: 8, paddingBottom: 60 }}>
          {filtered.map((drop, i) => (
            <div
              key={drop.id}
              className="drop-card"
              style={{
                background: "rgba(0,0,0,0.35)",
                border: "1px solid rgba(176,142,80,0.1)",
                borderRadius: 8, padding: "14px 14px",
                animation: `fadeUp ${0.05 + (i % 20) * 0.02}s ease both`,
                transition: "border-color 0.15s",
              }}
            >
              {/* Top row */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{
                  background: `${TAG_COLORS[drop.tag] || GOLD}18`,
                  border: `1px solid ${TAG_COLORS[drop.tag] || GOLD}35`,
                  color: TAG_COLORS[drop.tag] || GOLD,
                  fontSize: "0.3rem", letterSpacing: "0.12em", fontWeight: 700,
                  padding: "2px 7px", borderRadius: 3, flexShrink: 0,
                }}>
                  {drop.tag}
                </span>
                <span style={{ color: "rgba(232,224,208,0.2)", fontSize: "0.34rem", flex: 1 }}>
                  {drop.platform}
                </span>
                <span style={{ color: "rgba(176,142,80,0.2)", fontSize: "0.3rem" }}>#{drop.id}</span>
                <CopyBtn text={drop.text} />
              </div>

              {/* The message */}
              <p style={{
                color: "rgba(232,224,208,0.82)", fontSize: "0.48rem",
                lineHeight: 1.85, whiteSpace: "pre-line", margin: 0,
                fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
              }}>
                {drop.text}
              </p>
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <p style={{ color: "rgba(232,224,208,0.3)", fontSize: "0.5rem" }}>No drops match that filter.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── BOTTOM NAV ────────────────────────────────────────────────────── */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "rgba(4,6,10,0.97)", backdropFilter: "blur(8px)",
        borderTop: `1px solid ${GOLD_20}`,
        padding: "10px 16px",
        display: "flex", justifyContent: "center", gap: 20,
      }}>
        {[
          { href: "/gate", label: "GATE" },
          { href: "/faceless", label: "FACELESS" },
          { href: "/links", label: "LINKS" },
          { href: "/steward", label: "STEWARD" },
        ].map(l => (
          <a key={l.href} href={l.href} style={{
            color: GOLD_DIM, fontSize: "0.36rem", letterSpacing: "0.14em",
            textDecoration: "none",
          }}>
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}
