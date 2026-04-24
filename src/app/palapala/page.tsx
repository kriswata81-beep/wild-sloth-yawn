import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Palapala · Mākoa Manifest",
  description:
    "The founding document of the Mākoa Brotherhood. Under the Malu Trust. Read before you walk through the Gate.",
  openGraph: {
    title: "The Palapala · Mākoa Manifest",
    description:
      "The founding document of the Mākoa Brotherhood. Under the Malu Trust.",
    images: ["/makoa_eclipse_crest.png"],
    url: "https://makoa.live/palapala",
    type: "article",
  },
};

export default function PalapalaPage() {
  return (
    <main
      style={{
        background: "#1a1a1a",
        minHeight: "100vh",
        color: "#f5ecd9",
        fontFamily: "Georgia, serif",
        paddingBottom: 120,
      }}
    >
      {/* Top trust banner */}
      <div
        style={{
          background: "#0a0606",
          borderBottom: "1px solid rgba(212,175,55,0.2)",
          padding: "12px",
          textAlign: "center",
        }}
      >
        <span
          style={{
            color: "#d4af37",
            fontSize: "13px",
            letterSpacing: "0.35em",
            fontVariant: "small-caps",
          }}
        >
          UNDER THE MALU TRUST
        </span>
      </div>

      {/* Hero */}
      <div
        style={{
          textAlign: "center",
          padding: "64px 24px 40px",
          borderBottom: "1px solid rgba(212,175,55,0.15)",
        }}
      >
        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
            color: "#f5ecd9",
            letterSpacing: "0.15em",
            margin: "0 0 12px",
            fontWeight: 400,
          }}
        >
          THE PALAPALA
        </h1>
        <p
          style={{
            fontStyle: "italic",
            color: "#d4af37",
            fontSize: "1.2rem",
            margin: "0 0 24px",
          }}
        >
          the Mākoa Manifest
        </p>
        <p
          style={{
            color: "rgba(245,236,217,0.5)",
            fontSize: "14px",
            letterSpacing: "0.2em",
          }}
        >
          Dropped April 21, 2026 · West Oʻahu
        </p>
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(to right, transparent, #d4af37, transparent)",
            maxWidth: 400,
            margin: "32px auto 0",
          }}
        />
      </div>

      {/* Intro quote */}
      <div style={{ textAlign: "center", padding: "40px 24px 0" }}>
        <p
          style={{
            fontStyle: "italic",
            color: "rgba(212,175,55,0.7)",
            fontSize: "1.1rem",
          }}
        >
          &quot;Read it twice. Then read it to a brother.&quot;
        </p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px" }}>

        {/* INTRO SECTION */}
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.9,
            marginBottom: 48,
            color: "rgba(245,236,217,0.85)",
          }}
        >
          This document is not a sales page. It is a founding document. The
          Mākoa Brotherhood publishes it today, in full, before a single
          application is accepted. We publish it because we are not in the
          business of selling seats. We are in the business of founding an order
          that will outlive us by 100 years. If you belong here, the words will
          land. If you don&apos;t, the words will not land, and you will be free
          to carry on with your life undisturbed. Either outcome is good. Read
          before you apply. The Gate opens Friday, May 1, 2026, at 9:00 AM HST
          — on the Full Moon.
        </p>

        {/* SECTION I */}
        <div
          style={{
            color: "#d4af37",
            fontSize: "14px",
            letterSpacing: "0.4em",
            fontVariant: "small-caps",
            marginBottom: 8,
          }}
        >
          I
        </div>
        <h2
          style={{
            color: "#ff4e1f",
            fontSize: "1.3rem",
            letterSpacing: "0.08em",
            marginBottom: 20,
            fontWeight: 500,
          }}
        >
          THE 100-YEAR MISSION
        </h2>
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.9,
            marginBottom: 48,
            color: "rgba(245,236,217,0.85)",
          }}
        >
          The Mākoa Brotherhood exists to rebuild Hawaiian sovereignty through
          brotherhood, trade, and sovereign technology — compounded over seven
          generations. Not a retreat. Not a podcast. Not a gym. Not a men&apos;s
          group that talks about doing things. A structured order — with ranks,
          territory, a trade network, and a 100-year horizon. The year is 2026.
          Our first founding is this May. Our last founding, if we do this
          right, will not occur in our lifetimes. The men who read this document
          in 2126 will read it as a historical artifact and decide whether we
          kept our word. Our word is that we will.
        </p>

        {/* SECTION II */}
        <div
          style={{
            color: "#d4af37",
            fontSize: "14px",
            letterSpacing: "0.4em",
            fontVariant: "small-caps",
            marginBottom: 8,
          }}
        >
          II
        </div>
        <h2
          style={{
            color: "#ff4e1f",
            fontSize: "1.3rem",
            letterSpacing: "0.08em",
            marginBottom: 20,
            fontWeight: 500,
          }}
        >
          THE NAMED ENEMIES
        </h2>
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.9,
            marginBottom: 24,
            color: "rgba(245,236,217,0.85)",
          }}
        >
          We are not a neutral organization. We fight specific things. We name
          them out loud so our enemies are clear:
        </p>
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.9,
            marginBottom: 24,
            color: "rgba(245,236,217,0.85)",
          }}
        >
          <strong style={{ color: "#f5ecd9" }}>The Jones Act.</strong> Ninety
          percent of everything consumed in Hawaiʻi arrives by ship, and the
          Jones Act requires those ships to be US-flagged, US-built, and
          US-crewed. This triples the cost of goods for eighty-six percent of
          Hawaiian businesses. We are taxed for the privilege of living on our
          own islands. This will not continue forever.
        </p>
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.9,
            marginBottom: 24,
            color: "rgba(245,236,217,0.85)",
          }}
        >
          <strong style={{ color: "#f5ecd9" }}>The attention economy.</strong>{" "}
          The internet was built to capture your eyes, your minutes, your
          children&apos;s minds, and the collective focus of the Hawaiian people.
          It is hostile by design. Every minute spent on an algorithm that does
          not serve the 100-year mission is a minute stolen from your
          grandchildren. We are building a sovereign-tech layer that treats the
          attention economy as an adversary.
        </p>
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.9,
            marginBottom: 24,
            color: "rgba(245,236,217,0.85)",
          }}
        >
          <strong style={{ color: "#f5ecd9" }}>Extraction.</strong> Hawaiian
          wealth flows outward. Every dollar that could have stayed in Kapolei,
          Waiʻanae, Nānākuli, Makaha, Hilo, Kahului, Waimea — instead goes to a
          mainland corporation, a hedge fund, a tech oligarch. Trade Co. is our
          answer.
        </p>
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.9,
            marginBottom: 24,
            color: "rgba(245,236,217,0.85)",
          }}
        >
          <strong style={{ color: "#f5ecd9" }}>Cultural erasure.</strong>{" "}
          Language, land, and lineage are disappearing because nobody is paid to
          keep them. Mākoa pays — in rank, in brotherhood, in Hale Stones, in
          territorial charters — for the work of keeping Hawaiian alive as a
          living practice, not a museum piece.
        </p>
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.9,
            marginBottom: 48,
            color: "rgba(245,236,217,0.85)",
          }}
        >
          These are our enemies. We are honest about them because a brotherhood
          without enemies is a social club.
        </p>

        {/* CALLOUT — Routes move people, not products */}
        <div
          style={{
            background: "#7a0000",
            margin: "32px -24px",
            padding: "48px 32px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "#ff4e1f",
              fontSize: "clamp(1.4rem, 4vw, 2rem)",
              fontStyle: "italic",
              margin: 0,
              letterSpacing: "0.05em",
            }}
          >
            &quot;Routes move people, not products.&quot;
          </p>
        </div>

        {/* SECTION III */}
        <div
          style={{
            color: "#d4af37",
            fontSize: "14px",
            letterSpacing: "0.4em",
            fontVariant: "small-caps",
            marginBottom: 8,
            marginTop: 48,
          }}
        >
          III
        </div>
        <h2
          style={{
            color: "#ff4e1f",
            fontSize: "1.3rem",
            letterSpacing: "0.08em",
            marginBottom: 20,
            fontWeight: 500,
          }}
        >
          THE LINEAGE
        </h2>
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.9,
            marginBottom: 24,
            color: "rgba(245,236,217,0.85)",
          }}
        >
          Two hundred years ago, under Kamehameha I, there lived a kūkini named
          Makoa — a sworn runner who carried messages, trade, and authority
          across the chiefdoms of Hawaiʻi. The kūkini moved between territories
          at superhuman speed. They moved not products but people. When a chief
          needed a decision carried from Hilo to Waiʻanae in hours, a kūkini
          ran. Mākoa the man ran for the king. Mākoa the Brotherhood runs for
          the Hawaiian people.
        </p>
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.9,
            marginBottom: 24,
            color: "rgba(245,236,217,0.85)",
          }}
        >
          We are not invoking his name as decoration. We are restarting his work
          — with the stack available to us in 2026. Our Trade Co. doctrine reads
          word-for-word as the old kūkini principle: &quot;Routes move people,
          not products.&quot; This is not a metaphor. In 2026 this means: we
          will build a mesh network (7G Net) where credentialed brothers move
          between territories carrying authority, trade, and knowledge. In 2046,
          it may mean something different. In 2126, we cannot predict — but the
          principle holds.
        </p>
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.9,
            marginBottom: 48,
            color: "rgba(245,236,217,0.85)",
          }}
        >
          We are 200 years late. We are starting anyway.
        </p>

        {/* SECTION IV */}
        <div
          style={{
            color: "#d4af37",
            fontSize: "14px",
            letterSpacing: "0.4em",
            fontVariant: "small-caps",
            marginBottom: 8,
          }}
        >
          IV
        </div>
        <h2
          style={{
            color: "#ff4e1f",
            fontSize: "1.3rem",
            letterSpacing: "0.08em",
            marginBottom: 20,
            fontWeight: 500,
          }}
        >
          THE ORDER
        </h2>
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.9,
            marginBottom: 24,
            color: "rgba(245,236,217,0.85)",
          }}
        >
          The Mākoa Brotherhood is held under the Malu Trust — a sovereign
          umbrella entity founded in West Oʻahu in 2026. &quot;Malu&quot; means
          shelter, shade, sanctuary. The Trust is the cover under which the
          Brotherhood grows.
        </p>
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.9,
            marginBottom: 24,
            color: "rgba(245,236,217,0.85)",
          }}
        >
          Under the Trust, two operating arms:
        </p>
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.9,
            marginBottom: 24,
            color: "rgba(245,236,217,0.85)",
          }}
        >
          <strong style={{ color: "#f5ecd9" }}>
            Ohana Makoa Trade Co.
          </strong>{" "}
          — the B2B network. Labor, knowledge, territory. Brothers serving
          brothers across chartered territories. Routes move people, not
          products.
        </p>
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.9,
            marginBottom: 24,
            color: "rgba(245,236,217,0.85)",
          }}
        >
          <strong style={{ color: "#f5ecd9" }}>Makoa Order</strong> — the B2C
          public layer. The app every registered brother runs. Commerce, news,
          daily updates, event coordination. Built on the 7G Net.
        </p>
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.9,
            marginBottom: 24,
            color: "rgba(245,236,217,0.85)",
          }}
        >
          Both arms report to the Aliʻi Council, which holds fiduciary authority
          under the Trust.
        </p>

        {/* TRADE CO. REVENUE DOCTRINE */}
        <div
          style={{
            background: "rgba(212,175,55,0.06)",
            border: "1px solid rgba(212,175,55,0.2)",
            borderRadius: 8,
            padding: "28px 24px",
            marginBottom: 24,
          }}
        >
          <p
            style={{
              color: "#d4af37",
              fontSize: "13px",
              letterSpacing: "0.3em",
              marginBottom: 16,
              fontVariant: "small-caps",
            }}
          >
            TRADE CO. REVENUE DOCTRINE — 80 / 10 / 10
          </p>
          <p
            style={{
              fontSize: "1.1rem",
              lineHeight: 1.9,
              marginBottom: 16,
              color: "rgba(245,236,217,0.85)",
            }}
          >
            Every dollar of trade, labor, or knowledge moved through a Mākoa chapter splits three ways:
          </p>
          <p
            style={{
              fontSize: "1.1rem",
              lineHeight: 1.9,
              marginBottom: 8,
              color: "rgba(245,236,217,0.85)",
            }}
          >
            <strong style={{ color: "#f5ecd9" }}>80%</strong> stays in the territory — the chapter&apos;s treasury, local ops, brothers doing the work
          </p>
          <p
            style={{
              fontSize: "1.1rem",
              lineHeight: 1.9,
              marginBottom: 8,
              color: "rgba(245,236,217,0.85)",
            }}
          >
            <strong style={{ color: "#f5ecd9" }}>10%</strong> to the Order — Mākoa Trade Co. general fund · infrastructure · 7G Net · legal · territory expansion
          </p>
          <p
            style={{
              fontSize: "1.1rem",
              lineHeight: 1.9,
              marginBottom: 20,
              color: "rgba(245,236,217,0.85)",
            }}
          >
            <strong style={{ color: "#f5ecd9" }}>10%</strong> to the Mayday 48 Aliʻi pool — split across the 20 founding Aliʻi · perpetual · inheritable (0.5% of global revenue per founder, forever)
          </p>
          <p
            style={{
              fontSize: "1rem",
              lineHeight: 1.9,
              color: "rgba(212,175,55,0.7)",
              fontStyle: "italic",
            }}
          >
            This split is the economic constitution. It aligns every chapter toward local sovereignty while funding the 100-year mission.
          </p>
        </div>
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.9,
            marginBottom: 24,
            color: "rgba(245,236,217,0.85)",
          }}
        >
          The ranks of the Brotherhood, earned not bought:
        </p>
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.9,
            marginBottom: 8,
            color: "rgba(245,236,217,0.85)",
          }}
        >
          <strong style={{ color: "#d4af37" }}>Nā Koa</strong> — The warriors.
          Entry tier. Civilian who has walked the Gate. Lifetime standing.
        </p>
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.9,
            marginBottom: 8,
            color: "rgba(245,236,217,0.85)",
          }}
        >
          <strong style={{ color: "#d4af37" }}>Mana</strong> — The empowered.
          Mastermind-level brothers. Voice in one Brotherhood circle.
        </p>
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.9,
            marginBottom: 8,
            color: "rgba(245,236,217,0.85)",
          }}
        >
          <strong style={{ color: "#d4af37" }}>War Room</strong> — Pre-Aliʻi
          track. Elite Reset Training completed.
        </p>
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.9,
            marginBottom: 24,
            color: "rgba(245,236,217,0.85)",
          }}
        >
          <strong style={{ color: "#d4af37" }}>Aliʻi</strong> — The chiefs.
          Co-founders. One percent equity in the Brotherhood. Hale Stone path to
          physical ownership of Mākoa Houses. Territorial charter eligibility.
          Seat on the Council for life.
        </p>
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.9,
            marginBottom: 48,
            color: "rgba(245,236,217,0.85)",
          }}
        >
          The Mākoa Oath is taken at every rank. Revocable only by the Council.
        </p>

        {/* SECTION V */}
        <div
          style={{
            color: "#d4af37",
            fontSize: "14px",
            letterSpacing: "0.4em",
            fontVariant: "small-caps",
            marginBottom: 8,
          }}
        >
          V
        </div>
        <h2
          style={{
            color: "#ff4e1f",
            fontSize: "1.3rem",
            letterSpacing: "0.08em",
            marginBottom: 20,
            fontWeight: 500,
          }}
        >
          THE FOUNDING OF THE 48
        </h2>
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.9,
            marginBottom: 24,
            color: "rgba(245,236,217,0.85)",
          }}
        >
          The Mayday Summit 2026 is the founding event. Four weekends. May 1
          through May 31. Oʻahu, West side. The full moon opens the month (May
          1). The blue moon (May 31, 11:11 PM HST) seals it.
        </p>
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.9,
            marginBottom: 24,
            color: "rgba(245,236,217,0.85)",
          }}
        >
          The Founding 48 is 48 oath signatures on the Palapala — 20 Aliʻi team leaders and the 28 brothers they bring. Once sealed at the May 31 Blue Moon, the Founding 48 closes permanently. There will be cohorts after. There will be no second Founding
          48.
        </p>
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.9,
            marginBottom: 24,
            color: "rgba(245,236,217,0.85)",
          }}
        >
          Each weekend is structured for war and for rest. Ice at four in the
          morning. War Room from nine to two. Territory drives, fire circles,
          open mats, brotherhood dinners. A Founder Private Luau at the Mākoa
          House under the Sunday sun.
        </p>
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.9,
            marginBottom: 24,
            color: "rgba(245,236,217,0.85)",
          }}
        >
          Aliʻi stay five days, Tuesday to Sunday. Lodging at Embassy Suites
          Kapolei is included. Every meal on the table. The ring, the patch, the
          coin, the manual — handed to you by name, in front of the cohort.
        </p>
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.9,
            marginBottom: 48,
            color: "rgba(245,236,217,0.85)",
          }}
        >
          Mana and War Room tier brothers come for their chosen weekend, their
          chosen hours. Nā Koa come for a day. Overseas brothers fly themselves
          in. War parties of three to five men, landing together at HNL, arriving
          together at the Mākoa House, returning home together with a weekend
          that will outlast them.
        </p>

        {/* SECTION VI */}
        <div
          style={{
            color: "#d4af37",
            fontSize: "14px",
            letterSpacing: "0.4em",
            fontVariant: "small-caps",
            marginBottom: 8,
          }}
        >
          VI
        </div>
        <h2
          style={{
            color: "#ff4e1f",
            fontSize: "1.3rem",
            letterSpacing: "0.08em",
            marginBottom: 20,
            fontWeight: 500,
          }}
        >
          SHIPS ARE BURNT
        </h2>
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.9,
            marginBottom: 24,
            color: "rgba(245,236,217,0.85)",
          }}
        >
          There is an old military custom: when a commander commits a force to a
          campaign from which retreat is unacceptable, he orders the ships that
          brought them burned on the beach. There is nowhere to go back to. The
          only direction is forward.
        </p>
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.9,
            marginBottom: 24,
            color: "rgba(245,236,217,0.85)",
          }}
        >
          The Mākoa founding is run on this principle. The Aliʻi who take the
          oath do not hedge. The Founding 48 is not a test drive. Brothers who
          are circling, measuring, considering — belong in the Sponsorship path,
          the waitlist, the next cohort (Ka Lani 48, June 2026 open). Brothers
          who walk through this Gate walk without retreat.
        </p>
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.9,
            marginBottom: 24,
            color: "rgba(245,236,217,0.85)",
          }}
        >
          Ranks can be revoked by the Council, but the oath is taken forever.
          The 1% equity in the Trust passes to your family, your territory, your
          successor — under conditions set by the Council, never transferable to
          outside market.
        </p>
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.9,
            marginBottom: 48,
            color: "rgba(245,236,217,0.85)",
          }}
        >
          This is not theatrics. This is a design decision. Brotherhoods without
          irrevocable commitment become social clubs in one generation. Ours is a
          100-year order. We will not become a social club.
        </p>

        {/* SECTION VII */}
        <div
          style={{
            color: "#d4af37",
            fontSize: "14px",
            letterSpacing: "0.4em",
            fontVariant: "small-caps",
            marginBottom: 8,
          }}
        >
          VII
        </div>
        <h2
          style={{
            color: "#ff4e1f",
            fontSize: "1.3rem",
            letterSpacing: "0.08em",
            marginBottom: 20,
            fontWeight: 500,
          }}
        >
          THE INVITATION
        </h2>
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.9,
            marginBottom: 24,
            color: "rgba(245,236,217,0.85)",
          }}
        >
          If you have read this far, there are three paths.
        </p>
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.9,
            marginBottom: 24,
            color: "rgba(245,236,217,0.85)",
          }}
        >
          <strong style={{ color: "#f5ecd9" }}>THE GATE</strong> — for you.
          Applications open Friday, May 1, 2026 at 9:00 AM HST — on the Full
          Moon — at makoa.live/48. Pick your weekend. Pick your rank. Name your
          war party if you bring one. Kris (Makoa Steward 0001) calls every
          applicant within 48 hours. Brother-to-brother. No pitch. We confirm
          seats — we do not sell them. Between now (April 21, Palapala drop) and
          May 1 (Gate opens): 10 days of reading, circling, war-party forming.
          You have time to bring your brothers to this decision with you.
        </p>
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.9,
            marginBottom: 24,
            color: "rgba(245,236,217,0.85)",
          }}
        >
          <strong style={{ color: "#f5ecd9" }}>SPONSORSHIP</strong> — for a
          brother you know. Someone in your life belongs here and will not ask.
          makoa.live/sponsor — pay his seat, anonymously. He receives one
          message: &quot;Someone believes in you.&quot;
        </p>
        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.9,
            marginBottom: 64,
            color: "rgba(245,236,217,0.85)",
          }}
        >
          <strong style={{ color: "#f5ecd9" }}>THE WAITLIST</strong> — for the
          next cohort. Founding 48 fills by the Blue Moon (May 31). After that,
          the Founding is closed. The next cohort — Ka Lani 48 — opens June 1,
          2026. Add your name at makoa.live/waitlist to receive first notice.
        </p>

        {/* Signing block */}
        <div
          style={{
            borderTop: "1px solid rgba(212,175,55,0.2)",
            paddingTop: 48,
            marginTop: 64,
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "#d4af37",
              fontSize: "13px",
              letterSpacing: "0.4em",
              marginBottom: 20,
            }}
          >
            THE PALAPALA WAS SIGNED
          </p>
          <p
            style={{
              color: "rgba(245,236,217,0.6)",
              fontSize: "16px",
              lineHeight: 2,
            }}
          >
            Published April 21, 2026
            <br />
            Held under the Malu Trust · West Oʻahu · 2026
            <br />
            Signed by:{" "}
            <strong style={{ color: "#f5ecd9" }}>
              Makoa Steward 0001
            </strong>{" "}
            — Founder Trustee
            <br />
            <em style={{ opacity: 0.5 }}>
              [Aliʻi Council signatories to be added post-Founding 48]
            </em>
          </p>
        </div>

        {/* ROOT line */}
        <p
          style={{
            textAlign: "center",
            color: "#ff4e1f",
            fontWeight: 700,
            letterSpacing: "0.3em",
            fontSize: "14px",
            marginTop: 40,
          }}
        >
          ROOT · SNAP · PEG · DNA · ECHO
        </p>
      </div>

      {/* Sticky footer */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "rgba(26,26,26,0.96)",
          backdropFilter: "blur(8px)",
          borderTop: "1px solid rgba(212,175,55,0.15)",
          padding: "12px 20px",
          display: "flex",
          gap: 12,
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <a
          href="/gate"
          style={{
            background: "#ff4e1f",
            color: "#1a1a1a",
            padding: "12px 24px",
            borderRadius: 6,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "13px",
            letterSpacing: "0.2em",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          WALK THROUGH THE GATE
        </a>
        <a
          href="/sponsor"
          style={{
            border: "1px solid #d4af37",
            color: "#d4af37",
            padding: "12px 20px",
            borderRadius: 6,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "13px",
            letterSpacing: "0.2em",
            textDecoration: "none",
            background: "transparent",
          }}
        >
          SPONSOR A BROTHER
        </a>
        <a
          href="/founding48"
          style={{
            color: "rgba(245,236,217,0.5)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "13px",
            letterSpacing: "0.15em",
            textDecoration: "none",
          }}
        >
          Join the Waitlist →
        </a>
      </div>
    </main>
  );
}
