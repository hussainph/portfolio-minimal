import { notFound } from "next/navigation";
import { BlogPostCard } from "@/components/ui/BlogPostCard";
import { BentoShowcase } from "@/components/ui/BentoShowcase";
import { BottomToolbar } from "@/components/ui/BottomToolbar";
import { FilterChipRow } from "@/components/ui/FilterChipRow";
import { Label } from "@/components/ui/Label";
import { Meta } from "@/components/ui/Meta";
import { NoteCard } from "@/components/ui/NoteCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ProjectHero } from "@/components/ui/ProjectHero";
import { Separator } from "@/components/ui/Separator";
import { ShowcaseCard } from "@/components/ui/ShowcaseCard";
import { Tag } from "@/components/ui/Tag";
import { TextLink } from "@/components/ui/TextLink";
import { tagColor } from "@/lib/tagColor";

const FILTER_TAG_POOL = [
  "building",
  "ai",
  "code",
  "design",
  "thinking",
  "notes",
  "craft",
  "research",
];

export default function UITestPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="min-h-screen bg-background text-text">
      <div className="mx-auto flex max-w-[960px] flex-col gap-16 px-12 pt-16 pb-48">
        <Header />

        <FilterChipRow tags={FILTER_TAG_POOL} />

        <Section number="00" title="Colors" subtitle="ground · tags · accent">
          <ColorsSection />
        </Section>

        <Section number="01" title="Typography" subtitle="serif for every display & heading level · italic for quotes only">
          <TypographySection />
        </Section>

        <Section
          number="02"
          title="Text link"
          subtitle="hover and click the link below — real browser states"
        >
          <TextLinkSection />
        </Section>

        <Section
          number="03"
          title="Primitives"
          subtitle="hover the cards to see the live transition"
        >
          <PrimitivesSection />
        </Section>

        <Section
          number="04"
          title="Primary button"
          subtitle="flat at rest · shader ring wakes on hover · disabled is honest"
        >
          <PrimaryButtonSection />
        </Section>

        <Section
          number="05"
          title="Project hero"
          subtitle="headliner — two-pane, serif display, drifting shader visual"
        >
          <ProjectHeroSection />
        </Section>

        <Section
          number="06"
          title="Bottom toolbar"
          subtitle="live at the bottom of this page — scroll to test auto-hide"
        >
          <ToolbarSection />
        </Section>

        <Section
          number="08"
          title="Tag filter bar"
          subtitle="sticks above the feed · URL-driven · click the active chip to clear"
        >
          <FilterChipRowSection />
        </Section>
      </div>

      {/* The toolbar lives here — fixed, visibility hook driven. */}
      <BottomToolbar activeTab="stream" />
    </main>
  );
}

function Header() {
  return (
    <header className="flex flex-col gap-3 pb-3">
      <Label tone="faint">UI Test · Component Library v4</Label>
      <h1 className="font-serif text-[48px] leading-[52px] tracking-[-0.02em] text-text">
        Hussain Phalasiya
      </h1>
      <p className="font-sans text-[15px] leading-[22px] tracking-[-0.03em] text-muted">
        Dark Warmth palette · Deeper Dark ground · DM Sans + Instrument Serif +
        JetBrains Mono. Every component on this page is a real, interactive
        instance — not a frozen specimen.
      </p>
    </header>
  );
}

function Section({
  number,
  title,
  subtitle,
  children,
}: {
  number: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-baseline gap-4">
        <Label tone="faint">§ {number}</Label>
        <h2 className="font-serif text-[24px] leading-[32px] tracking-[-0.01em] text-text">
          {title}
        </h2>
        {subtitle ? (
          <span className="font-mono text-[11px] leading-[14px] text-faint">
            {subtitle}
          </span>
        ) : null}
      </div>
      <Separator />
      <div className="pt-2">{children}</div>
    </section>
  );
}

function ColorsSection() {
  const ground: { name: string; hex: string; role: string }[] = [
    { name: "background", hex: "#0a0a0b", role: "page floor" },
    { name: "sunken", hex: "#0c0c0e", role: "callout panels" },
    { name: "sunken-hover", hex: "#0f0f11", role: "Bento card hover" },
    { name: "surface", hex: "#141416", role: "card at rest" },
    { name: "surface-hover", hex: "#17171a", role: "surface card hover" },
    { name: "elevated", hex: "#1a1a1d", role: "subtle dividers" },
    { name: "border", hex: "#252528", role: "default edge" },
    { name: "border-hover", hex: "#2a2a2d", role: "hover edge" },
    { name: "text", hex: "#f0ebe3", role: "hero · note body" },
    { name: "body", hex: "#bfb8ae", role: "longform body" },
    { name: "quote", hex: "#bfb4a8", role: "pull quote" },
    { name: "muted", hex: "#908a84", role: "secondary" },
    { name: "faint", hex: "#555250", role: "captions" },
  ];

  // Each tag name is hashed to a deterministic OKLCH hue.
  const tagNames = [
    "building",
    "ai",
    "code",
    "design",
    "thinking",
    "notes",
    "craft",
    "research",
  ];

  return (
    <div className="flex flex-col gap-10">
      <div>
        <Label tone="faint" size="xs" className="mb-3 block">
          Ground · Dark Warmth v4
        </Label>
        <div className="flex flex-wrap gap-4">
          {ground.map((c) => (
            <div key={c.name} className="flex w-[120px] flex-col gap-1.5">
              <div
                className="h-16 w-full rounded-[3px] border border-border"
                style={{ backgroundColor: c.hex }}
              />
              <div className="font-sans text-[13px] tracking-[-0.03em] text-text">
                {c.name}
              </div>
              <div className="font-mono text-[10px] leading-3 tracking-[0.05em] text-faint">
                {c.hex}
              </div>
              <div className="font-sans text-[11px] leading-[14px] tracking-[-0.03em] text-muted">
                {c.role}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3 flex flex-wrap items-baseline gap-3">
          <Label tone="faint" size="xs">
            Tags · tagColor(name) = oklch(74% 0.14 hash(name) mod 360)
          </Label>
          <span className="font-mono text-[10px] leading-3 tracking-[0.04em] text-faint">
            hue derived from name · chroma/lightness locked · stable across renders
          </span>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-baseline gap-5">
            <span className="w-20 shrink-0 font-mono text-[11px] leading-[14px] tracking-[0.04em] text-faint">
              Default
            </span>
            <div className="flex flex-wrap gap-2">
              {tagNames.map((n) => (
                <Tag key={n} name={n}>
                  #{n}
                </Tag>
              ))}
            </div>
          </div>
          <div className="flex items-baseline gap-5">
            <span className="w-20 shrink-0 font-mono text-[11px] leading-[14px] tracking-[0.04em] text-accent-orange">
              Hover
            </span>
            <div className="flex flex-wrap gap-2">
              {tagNames.slice(0, 4).map((n) => (
                <Tag key={n} name={n} state="hover">
                  #{n}
                </Tag>
              ))}
            </div>
          </div>
          <div className="flex items-baseline gap-5">
            <span className="w-20 shrink-0 font-mono text-[11px] leading-[14px] tracking-[0.04em] text-faint">
              Active
            </span>
            <div className="flex flex-wrap gap-2">
              {tagNames.slice(0, 4).map((n) => (
                <Tag key={n} name={n} state="active">
                  #{n}
                </Tag>
              ))}
            </div>
          </div>
          <div className="mt-2 flex gap-6 rounded-card border border-border bg-sunken py-4 px-5">
            <span className="w-20 shrink-0 font-mono text-[11px] leading-[14px] tracking-[0.04em] uppercase text-accent-orange">
              How
            </span>
            <span className="font-mono text-[13px] leading-[22px] tracking-[-0.03em] text-body">
              Pure, deterministic hash on the tag name → OKLCH hue. Same input
              always yields the same color; no manual mapping to maintain as
              the tag set grows.
            </span>
          </div>
        </div>
      </div>

      <div>
        <Label tone="faint" size="xs" className="mb-3 block">
          Accent · Text link + Hover emphasis
        </Label>
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-16 rounded-[3px] border border-border"
              style={{ backgroundColor: "#70CFD4" }}
            />
            <span className="font-mono text-[11px] text-faint">
              #70CFD4 · accent-teal
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-16 rounded-[3px] border border-border"
              style={{ backgroundColor: "#E89878" }}
            />
            <span className="font-mono text-[11px] text-faint">
              #E89878 · accent-orange
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-16 rounded-[3px] border border-border"
              style={{ backgroundColor: tagColor("building") }}
            />
            <span className="font-mono text-[11px] text-faint">
              oklch(74% 0.14 · #building hue)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TypographySection() {
  return (
    <div className="flex flex-col gap-7">
      <Specimen label="Display · Instrument Serif · 48 / 52 · -2%">
        <div className="font-serif text-[48px] leading-[52px] tracking-[-0.02em] text-text">
          The things I&apos;m building, breaking, and thinking about.
        </div>
      </Specimen>
      <Specimen label="H1 · Instrument Serif · 32 / 38 · -1.5%">
        <div className="font-serif text-[32px] leading-[38px] tracking-[-0.015em] text-text">
          Why I think trust is the real bottleneck in AI
        </div>
      </Specimen>
      <Specimen label="H2 · Instrument Serif · 24 / 32 · -1%">
        <div className="font-serif text-[24px] leading-[32px] tracking-[-0.01em] text-text">
          The Memory-Trust Paradox
        </div>
      </Specimen>
      <Specimen label="H3 · Instrument Serif · 19 / 26 · -1%">
        <div className="font-serif text-[19px] leading-[26px] tracking-[-0.01em] text-text">
          Progressive delegation as a design pattern
        </div>
      </Specimen>
      <Specimen label="Pull Quote · Instrument Serif Italic · 24 / 34 · color #BFB4A8">
        <div
          className="max-w-[640px] border-l-2 pl-5"
          style={{ borderColor: tagColor("building") }}
        >
          <div className="font-serif italic text-[24px] leading-[34px] tracking-[-0.01em] text-quote">
            Trust is the bottleneck, not capability. The best AI products build
            trust ramps, not capability mountains.
          </div>
        </div>
      </Specimen>
      <Specimen label="Body · DM Sans 400 · 16 / 24 · -3% · color #BFB8AE">
        <p className="max-w-[640px] font-sans text-[16px] leading-[24px] tracking-[-0.03em] text-body">
          I&apos;ve been thinking about this a lot lately — the way we build AI
          products assumes people will just hand over context. But that&apos;s
          not how trust works. You earn it incrementally, through small moments
          of competence.
        </p>
      </Specimen>
      <Specimen label="Small · DM Sans · 13 / 20 · color #908A84">
        <div className="font-sans text-[13px] leading-[20px] tracking-[-0.03em] text-muted">
          8 min read · 2.4k words · last updated apr 2026
        </div>
      </Specimen>
      <Specimen label="System · JetBrains Mono · 11 / 16 · tags · timestamps · code">
        <div className="flex flex-wrap items-center gap-3">
          <Meta>Apr 13, 2026</Meta>
          <Meta>·</Meta>
          <Meta>4 min</Meta>
          <Tag name="building">#building</Tag>
          <span className="font-mono text-[15px] leading-6 text-text">
            const trust = f(transparency)
          </span>
        </div>
      </Specimen>
    </div>
  );
}

function TextLinkSection() {
  return (
    <p className="max-w-[600px] font-sans text-[17px] leading-[28px] tracking-[-0.03em] text-text-link">
      Most of what I&apos;m thinking about right now is in{" "}
      <TextLink href="#memory-trust">The Memory-Trust Paradox</TextLink>, with a
      sidebar piece on{" "}
      <TextLink href="https://example.com" external>
        progressive delegation
      </TextLink>
      . The dashed underline is the resting state; hover for solid teal, click
      to see the visited color persist on reload.
    </p>
  );
}

function Specimen({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col gap-2">
      <Label tone="faint" size="xs">
        {label}
      </Label>
      {children}
    </div>
  );
}

function PrimitivesSection() {
  return (
    <div className="flex flex-col gap-10">
      <CardLane label="Note card — short-form, hover for stripe + elevated bg">
        <NoteCard
          tags={["building"]}
          timestamp="apr 12 · 9:42pm"
          body={`Been messing around with structured outputs from Claude and I think the trick isn't constraining the model harder — it's giving it better examples of what "good" looks like. Schemas are necessary but not sufficient.`}
          engagement={{ replies: 3, likes: 12 }}
        />
      </CardLane>

      <CardLane label="Note card · thinking — dashed outline + chip for work in progress">
        <NoteCard
          tags={["ai"]}
          timestamp="apr 11 · 2:15am"
          body={`Half-formed thought: maybe the reason agent loops feel fragile isn't the model, it's that we give the agent a goal before it has enough context to know what "done" looks like. Still turning this over.`}
          engagement={{ replies: 1, likes: 4 }}
          status="thinking"
        />
      </CardLane>

      <CardLane label="Note card · parked — dimmed content + chip for shelved / failures">
        <NoteCard
          tags={["code"]}
          timestamp="mar 29 · archived"
          body={`Tried building a shared-context layer between two agents using a vector store. Shipped, ran the evals, then realized the cross-agent latency made the whole thing slower than just restating context. Parking this until the latency numbers move.`}
          engagement={{ replies: 0, likes: 2 }}
          status="parked"
        />
      </CardLane>

      <CardLane label="Blog post card — flat heading, hover to see Read → nudge + color shift">
        <BlogPostCard
          tags={["design", "thinking"]}
          timestamp="apr 8"
          readTime="8 min"
          title="The Memory-Trust Paradox: why your AI product can't remember and users won't let it"
          excerpt="I keep coming back to this idea that the fundamental tension in AI products isn't about capability at all. It's about this weird loop where the model needs context to be useful, but users don't trust it enough…"
          engagement={{ replies: 24, likes: 87 }}
        />
      </CardLane>

      <CardLane label="Blog post card · thinking — status travels across card types">
        <BlogPostCard
          tags={["research"]}
          timestamp="apr 2"
          readTime="draft · 3 min so far"
          title="On why most AI agent benchmarks measure the wrong thing"
          excerpt="Working on this one. Current draft argues the field has optimized for single-turn success rates when the interesting failure modes are all multi-turn. Need more examples before I ship it."
          engagement={{ replies: 6, likes: 11 }}
          status="thinking"
        />
      </CardLane>

      <CardLane label="Showcase — single idea, one ambient image">
        <ShowcaseCard
          tags={["design"]}
          timestamp="apr 10 · small idea"
          body="Tried a different approach to the onboarding tooltip — ambient instead of intrusive. Small texture fragment shows up and fades. Feels way less like being yelled at."
          images={[{ caption: "ONBOARDING · V3" }]}
          engagement={{ replies: 5, likes: 34 }}
        />
      </CardLane>

      <CardLane label="Bento — v4 asymmetric layout, one featured tile + two stacked alternates">
        <BentoShowcase
          tags={["code", "building"]}
          timestamp="apr 11 · iterations"
          body="Three takes on the tool-use UI for Volli. Ended up liking v2 most — the side-rail keeps the context without hijacking the read."
          images={[
            { caption: "V1" },
            { caption: "V2 ← picked", picked: true },
            { caption: "V3" },
          ]}
          engagement={{ replies: 8, likes: 21 }}
        />
      </CardLane>
    </div>
  );
}

function CardLane({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <Label tone="faint">{label}</Label>
      {children}
    </div>
  );
}

function PrimaryButtonSection() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start gap-8">
        <Label tone="faint" size="xs" className="w-20 shrink-0 pt-3">
          Rest
        </Label>
        <div className="flex items-center gap-10">
          <PrimaryButton>Read the thinking</PrimaryButton>
          <span className="max-w-[280px] font-mono text-[10px] leading-4 tracking-[0.02em] text-faint">
            near-black fill · 1.5px neutral ring · no color. lets the word do
            the work.
          </span>
        </div>
      </div>

      <div className="flex items-start gap-8">
        <span className="w-20 shrink-0 pt-3 font-mono text-[11px] leading-[14px] tracking-[0.04em] text-accent-orange">
          Hover
        </span>
        <div className="flex items-center gap-10">
          <PrimaryButton>Read the thinking</PrimaryButton>
          <span className="max-w-[280px] font-mono text-[10px] leading-4 tracking-[0.02em] text-faint">
            conic gradient on the ring, rotates continuously while hovered.
            glow bloom outside.
          </span>
        </div>
      </div>

      <div className="flex items-start gap-8">
        <Label tone="faint" size="xs" className="w-20 shrink-0 pt-3">
          Disabled
        </Label>
        <div className="flex items-center gap-10">
          <PrimaryButton disabled>Read the thinking</PrimaryButton>
          <span className="max-w-[280px] font-mono text-[10px] leading-4 tracking-[0.02em] text-faint">
            ring drops to flat neutral, fill desaturates, cursor not-allowed.
          </span>
        </div>
      </div>

      <div className="mt-2 flex gap-8 rounded-card border border-border bg-sunken py-4 px-5">
        <span className="w-20 shrink-0 font-mono text-[11px] leading-[14px] tracking-[0.04em] uppercase text-accent-orange">
          Motion
        </span>
        <div className="flex grow flex-col gap-2">
          <p className="font-sans text-[14px] leading-[22px] tracking-[-0.03em] text-body">
            On hover the ring animates: conic gradient rotates ~6s linear
            infinite via a CSS <code className="font-mono text-[13px] text-text">@property</code>.
            Fades in over 300ms so the color doesn&apos;t pop. Only the hovered
            button animates — no global scheduler needed.
          </p>
          <p className="font-mono text-[10px] leading-3 tracking-[0.02em] text-faint">
            prefers-reduced-motion · ring stays static, color still fades in on
            hover so the affordance is legible
          </p>
        </div>
      </div>
    </div>
  );
}

function ProjectHeroSection() {
  return (
    <div className="flex flex-col gap-4">
      <ProjectHero
        badge="Now · headliner"
        tags={["building", "ai", "design"]}
        title="Clawbox"
        subtitle="An arcade you can program. Physics, prizes, and a hand that learns to want things."
        meta={[
          { label: "status", value: "v0.4 · launching may" },
          { label: "posts", value: "28 — notes, designs, builds" },
          { label: "latest", value: "shader physics · apr 13" },
        ]}
        primaryCta={{ label: "Open project", href: "#clawbox" }}
        secondaryCta={{ label: "See the stream", href: "#stream" }}
        visualBadge="live shader · hover to interact"
      />
      <p className="max-w-[600px] font-mono text-[10px] leading-4 tracking-[0.04em] text-faint">
        data-driven: pass tags, title, subtitle, meta rows, and CTAs — the
        visual + badges are props-only, no Clawbox-specific copy is hardcoded.
      </p>
    </div>
  );
}

function ToolbarSection() {
  return (
    <div className="flex flex-col gap-4">
      <p className="max-w-[600px] font-sans text-[15px] leading-[25px] tracking-[-0.03em] text-muted">
        The toolbar at the bottom of this page is the real component. It uses{" "}
        <code className="font-mono text-[13px] text-text">
          useToolbarVisibility
        </code>{" "}
        to slide out after 3 seconds of cursor inactivity (once you&apos;ve
        scrolled past 200px), and slides back in on cursor movement, scroll, or
        keypress. Try it — scroll, then sit still.
      </p>
      <ul className="flex max-w-[600px] flex-col gap-1.5 font-mono text-[11px] leading-[18px] tracking-[0.04em] text-faint">
        <li>spring · stiffness 260 · damping 22 · mass 1</li>
        <li>backdrop-filter · blur 24px · bg #14141699</li>
        <li>auto-hide · 3000ms idle · scroll &gt; 200px</li>
        <li>prefers-reduced-motion · simple fade, no spring</li>
      </ul>
    </div>
  );
}

function FilterChipRowSection() {
  return (
    <div className="flex flex-col gap-4">
      {/*
        The page-level FilterChipRow at the top is a real instance with the
        full sticky behavior. This specimen is a contained copy — overflow on
        the wrapper makes it the scroll/sticky context, so the chip row pins
        to the section, not the viewport, while you read.
      */}
      <div className="relative max-h-[160px] overflow-y-auto rounded-card border border-border bg-sunken px-12 py-4">
        <FilterChipRow tags={FILTER_TAG_POOL} />
        <p className="mt-4 max-w-[520px] font-sans text-[14px] leading-[22px] tracking-[-0.03em] text-body">
          Scroll inside this frame to see the chip row stay pinned to the top
          while the prose underneath moves. On the real home page the row
          uses the page itself as the scroll context and a backdrop blur
          softens whatever passes underneath.
        </p>
        <p className="mt-3 max-w-[520px] font-sans text-[14px] leading-[22px] tracking-[-0.03em] text-body">
          Each chip is a real <code className="font-mono text-[13px] text-text">{`<Link>`}</code> to{" "}
          <code className="font-mono text-[13px] text-text">{`?tag={name}`}</code> — clicking
          updates the URL and the server re-renders the filtered feed. Click
          the active chip to drop the filter.
        </p>
      </div>
      <ul className="flex max-w-[600px] flex-col gap-1.5 font-mono text-[11px] leading-[18px] tracking-[0.04em] text-faint">
        <li>position · sticky top-0 z-20 · negative gutter to bleed full-width</li>
        <li>state · useSearchParams (Suspense-wrapped) reads ?tag</li>
        <li>active chip · href falls back to pathname so the click clears the filter</li>
      </ul>
    </div>
  );
}
