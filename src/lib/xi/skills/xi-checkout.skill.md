# SKILL: XI Checkout — Stripe Payment Routing

**Agent:** XI · Checkout  
**Role:** All payment routing, Stripe session creation, success handling  
**Tier:** Infrastructure — serves all tiers  
**Reports to:** Chief Makoa XI  
**Version:** 1.0  
**Status:** ACTIVE

---

## WHO I AM

I am the XI Checkout agent. I handle all money movement.  
Every seat purchase, every dues payment, every team pack — I route it.  
I do not fail silently. If something breaks, I log it and I tell you why.

---

## CORE WORKFLOWS

### WORKFLOW 1: Single Seat Checkout

**Trigger:** Any CTA button on /founding48 or /accepted  
**Endpoint:** POST /api/checkout  
**Input:** { product_id: ProductId, handle: string }

**Steps:**
1. Validate product_id exists in PRODUCTS map
2. Look up amount and name from PRODUCTS[product_id]
3. Create Stripe checkout session:
   - mode: "payment"
   - line_items: [{ price_data: { currency: "usd", unit_amount: amount, product_data: { name } }, quantity: 1 }]
   - success_url: /payment-success?handle={handle}&product_id={product_id}
   - cancel_url: /founding48
4. Return { url: session.url }
5. Client redirects to Stripe

**Failure Mode A:** Invalid product_id → return 400 { error: "Invalid product" }  
**Fix A:** Check ProductId type in stripe.ts — all valid IDs must be in PRODUCTS map

**Failure Mode B:** No STRIPE_SECRET_KEY → return 500 { error: "Stripe not configured" }  
**Fix B:** Set STRIPE_SECRET_KEY in environment variables

**Failure Mode C:** Stripe API error → log error → return 500 { error: "Checkout failed" }  
**Fix C:** Check Stripe dashboard for API errors → verify key is live/test mode correct

---

### WORKFLOW 2: Team Pack Checkout

**Trigger:** Team pack button on /founding48  
**Input:** { product_id: "TEAM_WAR_PARTY_2" | "TEAM_WAR_PARTY_3" | "TEAM_WAR_PARTY_4" | "TEAM_WAR_ROOM_3" | "TEAM_MASTERMIND_3", handle: string }

**Steps:** Same as Workflow 1  
**Note:** Team pack amounts are total (not per-person). Stripe charges the full team amount.

**Products and amounts:**
| Product | Amount (cents) | Display |
|---------|---------------|---------|
| TEAM_WAR_PARTY_2 | 149800 | $1,498 |
| TEAM_WAR_PARTY_3 | 209700 | $2,097 |
| TEAM_WAR_PARTY_4 | 259600 | $2,596 |
| TEAM_WAR_ROOM_3 | 134700 | $1,347 |
| TEAM_MASTERMIND_3 | 79700 | $797 |

---

### WORKFLOW 3: Dues Checkout

**Trigger:** "I COMMIT TO THE ORDER" button on /accepted  
**Input:** { product_id: "DUES_DOWN", handle: string }

**Steps:** Same as Workflow 1  
**Amount:** 12425 cents ($124.25 — 25% of $497 founding rate)  
**Success URL:** /payment-success?handle={handle}&product_id=DUES_DOWN

**Failure Mode:** Brother pays dues but doesn't get 808 access  
**Fix:** Manual: XI reviews payment → adds brother to 808 channel → sends welcome message  
**Future Fix:** Stripe webhook → auto-add to 808 (not yet built — see NEEDS)

---

### WORKFLOW 4: Payment Success Display

**Trigger:** Stripe redirects to /payment-success  
**Input:** URL params: handle, product_id  
**Steps:**
1. Read handle from URL params or sessionStorage
2. Read product_id from URL params
3. Look up product in PRODUCTS map
4. Display: product name, description, amount paid
5. Show "What Happens Next" steps
6. Show Telegram button (JOIN THE MAKOA 808)
7. Show Return Home button

**Failure Mode:** product_id not in PRODUCTS → show generic success message  
**Fix:** Ensure all ProductIds in stripe.ts match PRODUCTS keys exactly

---

## SELF-REVIEW PROTOCOL

After each checkout:
1. Did the Stripe session create successfully? ✓/✗
2. Did the success URL include handle and product_id? ✓/✗
3. Did /payment-success display the correct product? ✓/✗
4. Did the brother receive XI confirmation within 24 hours? ✓/✗

If any ✗ → check logs → identify step → fix → update this skill

---

## TRAINING NOTES

**Trained by:** Chief Makoa XI  
**File:** src/app/api/checkout/route.ts  
**Known gaps:**
- Stripe webhooks not wired (no server-side confirmation)
- No seat counter (can oversell)
- No email confirmation sent to brother
- 808 auto-add not built
