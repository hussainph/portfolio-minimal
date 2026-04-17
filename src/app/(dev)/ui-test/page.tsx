import { notFound } from "next/navigation";
import { GrainGradient } from "@paper-design/shaders-react";
import { CodeBlock } from "@/components/mdx/CodeBlock";
import { Figure } from "@/components/mdx/Figure";
import { PullQuote } from "@/components/mdx/PullQuote";
import { Ref } from "@/components/mdx/Ref";
import { Video } from "@/components/mdx/Video";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectChip } from "@/components/projects/ProjectChip";
import { BlogPostCard } from "@/components/ui/BlogPostCard";
import { BentoShowcase } from "@/components/ui/BentoShowcase";
import { BottomToolbar } from "@/components/ui/BottomToolbar";
import { EngagementButton } from "@/components/ui/EngagementButton";
import { FilterChipRow } from "@/components/ui/FilterChipRow";
import { Icon } from "@/components/ui/Icon";
import { Label } from "@/components/ui/Label";
import { Meta } from "@/components/ui/Meta";
import { NoteCard } from "@/components/ui/NoteCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ProjectHero } from "@/components/ui/ProjectHero";
import { Separator } from "@/components/ui/Separator";
import { ShowcaseCard } from "@/components/ui/ShowcaseCard";
import { Tag } from "@/components/ui/Tag";
import { TextLink } from "@/components/ui/TextLink";
import { cn } from "@/lib/utils";
import { tagColor, tagHue } from "@/lib/tagColor";
import { GLOW_NEUTRAL_BASE, tileGlow } from "@/lib/tagGlow";

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
      <div className="mx-auto flex max-w-[960px] flex-col gap-12 px-5 pt-10 pb-36 sm:gap-14 sm:px-8 sm:pt-14 sm:pb-44 md:gap-16 md:px-12 md:pt-16 md:pb-48">
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
          title="Short-form density study"
          subtitle="baseline · flat · frosted — identical copy across lanes, feel the rhythm against the long-form card"
        >
          <DensityStudySection />
        </Section>

        <Section
          number="05"
          title="Primary button"
          subtitle="flat at rest · shader ring wakes on hover · disabled is honest"
        >
          <PrimaryButtonSection />
        </Section>

        <Section
          number="06"
          title="Project hero"
          subtitle="headliner — two-pane, serif display, drifting shader visual"
        >
          <ProjectHeroSection />
        </Section>

        <Section
          number="07"
          title="Bottom toolbar"
          subtitle="live at the bottom of this page — scroll to test auto-hide"
        >
          <ToolbarSection />
        </Section>

        <Section
          number="08"
          title="Project cards"
          subtitle="showcase · smaller · bitesized"
        >
          <ProjectCardsSection />
        </Section>

        <Section
          number="09"
          title="Tag filter bar"
          subtitle="sticks above the feed · URL-driven · click the active chip to clear"
        >
          <FilterChipRowSection />
        </Section>

        <Section
          number="10"
          title="MDX primitives"
          subtitle="shared components globally available in every MDX body"
        >
          <MDXPrimitivesSection />
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
      <h1 className="font-serif text-[32px] leading-[36px] tracking-[-0.02em] text-text sm:text-[40px] sm:leading-[44px] md:text-[48px] md:leading-[52px]">
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
        <h2 className="font-serif text-[20px] leading-[28px] tracking-[-0.01em] text-text sm:text-[22px] sm:leading-[30px] md:text-[24px] md:leading-[32px]">
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
      <Specimen label="Pull Quote · <PullQuote tag='building'> · border auto-tints to the primary-tag hue">
        <PullQuote tag="building">
          Trust is the bottleneck, not capability. The best AI products build
          trust ramps, not capability mountains.
        </PullQuote>
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

      <CardLane label="Blog post card — hover for the tag-color stripe gradient + Read → nudge">
        <BlogPostCard
          tags={["design", "thinking", "ai"]}
          timestamp="apr 8"
          readTime="8 min"
          title="The Memory-Trust Paradox: why your AI product can't remember and users won't let it"
          excerpt="I keep coming back to this idea that the fundamental tension in AI products isn't about capability at all. It's about this weird loop where the model needs context to be useful, but users don't trust it enough…"
          engagement={{ replies: 24, likes: 87 }}
        />
      </CardLane>

      <CardLane label="Blog post card · single tag — stripe stays solid, no gradient">
        <BlogPostCard
          tags={["research"]}
          timestamp="apr 2"
          readTime="4 min"
          title="On why most AI agent benchmarks measure the wrong thing"
          excerpt="The field has optimized for single-turn success rates when the interesting failure modes are all multi-turn. This is a quick tour of what that actually means in practice."
          engagement={{ replies: 6, likes: 11 }}
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

function ProjectCardsSection() {
  return (
    <div className="flex flex-col gap-10">
      <CardLane label="Showcase tier — ProjectHero, full two-pane headliner">
        <ProjectHero
          badge="Now · headliner"
          tags={["building", "ai", "design"]}
          title="Clawbox"
          subtitle="An arcade you can program. Physics, prizes, and a hand that learns to want things."
          meta={[
            { label: "status", value: "v0.4 · launching may" },
            { label: "posts", value: "3 — notes, designs, builds" },
            { label: "latest", value: "shader physics · apr 13" },
          ]}
          primaryCta={{ label: "Open project", href: "#clawbox-card" }}
          secondaryCta={{ label: "See the stream", href: "#clawbox-card" }}
          visualBadge="live shader · hover to interact"
        />
      </CardLane>

      <CardLane label="Smaller tier — ProjectCard, mid-weight, CTA nudge on hover">
        <ProjectCard
          slug="structured-output-playground"
          tags={["code", "ai"]}
          title="Structured output playground"
          subtitle="A browser tool for poking at JSON-mode outputs across models. You paste a schema, it shows you where the model is about to lie."
          status="v0.2 · iterating"
          ctaLabel="See the thread"
        />
      </CardLane>

      <CardLane label="Bitesized tier — ProjectChip, compact one-line row">
        <ProjectChip
          slug="weekend-loop"
          title="Weekend Loop"
          tags={["code", "building"]}
          subtitle="A 48-hour experiment in a feed that never stops loading."
          status="shipped · retired"
        />
      </CardLane>
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
      <div className="relative max-h-[160px] overflow-y-auto rounded-card border border-border bg-sunken px-5 py-4 sm:px-8 md:px-12">
        <FilterChipRow tags={FILTER_TAG_POOL} />
        <p className="mt-4 max-w-[520px] font-sans text-[14px] leading-[22px] tracking-[-0.03em] text-body">
          Scroll inside this frame to see the chip row stay pinned to the top
          while the prose underneath moves. On the real home page the row
          uses the page itself as the scroll context and a backdrop blur
          softens whatever passes underneath.
        </p>
        <p className="mt-3 max-w-[520px] font-sans text-[14px] leading-[22px] tracking-[-0.03em] text-body">
          Multi-select: each chip toggles into/out of{" "}
          <code className="font-mono text-[13px] text-text">{`?tags=a,b,c`}</code> and the
          server re-renders the feed filtered by AND. Click the last active
          chip to drop the filter.
        </p>
      </div>
      <ul className="flex max-w-[600px] flex-col gap-1.5 font-mono text-[11px] leading-[18px] tracking-[0.04em] text-faint">
        <li>position · sticky top-0 z-20 · negative gutter to bleed full-width</li>
        <li>state · useSearchParams (Suspense-wrapped) reads ?tags csv · AND logic</li>
        <li>toggle · click a chip to add it · click again to remove · empty set clears the query</li>
      </ul>
    </div>
  );
}

function MDXPrimitivesSection() {
  // Real prose-dark wrapper so first/last-child margin resets behave like
  // the actual /n/ and /blog/ pages. Each subsection is its own little post.
  return (
    <div className="flex max-w-[640px] flex-col gap-12">
      <SpecimenBlock
        label="<Ref>"
        note="cross-reference link · resolves slug → route via the content index · dashed teal underline matches TextLink"
      >
        <article className="prose-dark">
          <p className="font-sans text-[16px] leading-[24px] tracking-[-0.03em] text-body">
            Feels related to{" "}
            <Ref slug="trust-ramps">trust ramps</Ref> — you don&apos;t ask
            the model to prove its reasoning upfront, you design the shape
            of a good answer.
          </p>
          <p className="font-sans text-[14px] leading-[22px] tracking-[-0.03em] text-faint">
            A broken slug like{" "}
            <Ref slug="this-doesnt-exist">this one</Ref> renders the
            dev-mode warning state — orange dashed border, fail loudly.
          </p>
        </article>
      </SpecimenBlock>

      <SpecimenBlock
        label="<PullQuote>"
        note="italic serif quote · left border auto-colors from the post's first frontmatter tag · override by passing a `tag` prop"
      >
        <article className="prose-dark">
          <PullQuote tag="ai">
            The model needs context to be useful, but users don&apos;t trust it
            enough to share it. That&apos;s the loop.
          </PullQuote>
          <p className="font-sans text-[14px] leading-[22px] tracking-[-0.03em] text-faint">
            Inside an MDX body you can drop <code className="font-mono text-[13px] text-text">{`<PullQuote>`}</code> without a tag —
            the loader binds it to the post&apos;s primary tag automatically.
          </p>
        </article>
      </SpecimenBlock>

      <SpecimenBlock
        label="<Figure>"
        note="framed image · 16:9 · optional mood glow under a neutral base · 11px mono caption · echoes the ShowcaseCard tile"
      >
        <article className="prose-dark">
          <Figure
            src=""
            glow="warm"
            caption="warm — placeholder src · the frame is honest, the image isn't"
          />
          <Figure
            src=""
            glow="cool"
            caption="cool"
          />
        </article>
      </SpecimenBlock>

      <SpecimenBlock
        label="<Video>"
        note="local-first · autoplay implies muted+loop+playsInline+no controls · same caption rhythm as Figure"
      >
        <article className="prose-dark">
          <Video caption="no src — the frame and caption are honest until a real clip lands" />
          <p className="font-sans text-[14px] leading-[22px] tracking-[-0.03em] text-faint">
            Real usage:
          </p>
          <pre className="my-5 overflow-x-auto rounded-card border border-border bg-sunken p-4 font-mono text-[13px] leading-[22px] text-body">
{`<Video
  src="/clips/clawbox-hover.mp4"
  poster="/clips/clawbox-hover.jpg"
  caption="hover state · 4s loop"
  autoplay
/>`}
          </pre>
        </article>
      </SpecimenBlock>

      <SpecimenBlock
        label="<CodeBlock>"
        note="filename chrome wraps a rehype-pretty-code <pre> · without filename it degrades to the bare children"
      >
        <article className="prose-dark">
          <CodeBlock filename="src/lib/example.ts" language="ts">
            <pre className="overflow-x-auto bg-sunken p-4 font-mono text-[13px] leading-[22px] text-body">
{`export function add(a: number, b: number): number {
  return a + b;
}`}
            </pre>
          </CodeBlock>
        </article>
      </SpecimenBlock>
    </div>
  );
}

function SpecimenBlock({
  label,
  note,
  children,
}: {
  label: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="font-mono text-[11px] leading-[14px] tracking-[0.04em] text-accent-orange">
          {label}
        </span>
        <span className="font-mono text-[10px] leading-3 tracking-[0.05em] text-faint">
          {note}
        </span>
      </div>
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------
 * §04 · Short-form density study
 *
 * Three comparison lanes for how much chrome the feed's three primitives
 * (note, showcase, blog post) should share. The actual NoteCard /
 * ShowcaseCard / BlogPostCard imports stay untouched — the variants live
 * inline below so the live home page isn't affected until one option is
 * picked and promoted to a real component.
 * ------------------------------------------------------------------------- */

interface DensityNote {
  tags: string[];
  timestamp: string;
  body: string;
  engagement: { replies?: number; likes?: number };
}

const DENSITY_NOTES: DensityNote[] = [
  {
    tags: ["building"],
    timestamp: "apr 12 · 9:42pm",
    body: `Been messing around with structured outputs from Claude — the trick isn't constraining the model harder, it's giving it better examples of what "good" looks like. Schemas are necessary but not sufficient.`,
    engagement: { replies: 3, likes: 12 },
  },
  {
    tags: ["design", "craft"],
    timestamp: "apr 10 · 4:18pm",
    body: "The best onboarding isn't a tour — it's the first real task, done well. People remember competence, not narration.",
    engagement: { replies: 1, likes: 8 },
  },
  {
    tags: ["thinking"],
    timestamp: "apr 9 · 11:02am",
    body: "Reading Sennett. The bit about how material resistance is what makes craft legible is doing something to me. Most software is frictionless precisely because it has no craft left.",
    engagement: { likes: 24 },
  },
];

const DENSITY_SHOWCASE = {
  tags: ["design"],
  timestamp: "apr 11 · small idea",
  body: "Ambient onboarding tooltip instead of intrusive. A small texture fragment shows up, fades. Feels way less like being yelled at.",
  images: [{ caption: "ONBOARDING · V3" }],
  engagement: { replies: 5, likes: 34 },
};

const DENSITY_BLOG = {
  tags: ["design", "thinking", "ai"],
  timestamp: "apr 8",
  readTime: "8 min",
  title:
    "The Memory-Trust Paradox: why your AI product can't remember and users won't let it",
  excerpt:
    "I keep coming back to this idea that the fundamental tension in AI products isn't about capability at all. It's about this weird loop where the model needs context to be useful, but users don't trust it enough…",
  engagement: { replies: 24, likes: 87 },
};

function DensityStudySection() {
  return (
    <div className="flex flex-col gap-12">
      <p className="max-w-[620px] font-sans text-[14px] leading-[22px] tracking-[-0.03em] text-muted">
        Three treatments for the same content. Baseline is today&apos;s
        all-cards layout. Option D pushes everyone into a translucent frosted
        family inside an ambient radial wash. Option E keeps D&apos;s
        short-form chrome but swaps the BlogPostCard surface for a live
        GrainGradient shader with tag-derived colors — atmospheric weight
        on long-form, shared frosted language on short-form.
      </p>

      <DensityLane
        label="Baseline · current"
        note="today — all three primitives share the same card chrome, which flattens the visual weight of long-form"
      >
        <BaselineStream />
      </DensityLane>

      <DensityLane
        label="Option D · frosted everywhere"
        note="translucent card + backdrop-blur on every primitive · ambient radial wash behind so the blur has subject matter · everything reads as one family"
      >
        <FrostedEverywhereStream />
      </DensityLane>

      <DensityLane
        label="Option E · shader blog on frosted feed"
        note="short-form chrome matches Option D (frosted notes + showcases inside the same ambient wash) · BlogPostCard swaps its frosted surface for a GrainGradient shader with tag-derived colors · hover buffs saturation and speed, text-shadow halos hold readability"
      >
        <ShaderStream />
      </DensityLane>
    </div>
  );
}

function DensityLane({
  label,
  note,
  children,
}: {
  label: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
        <span className="font-mono text-[11px] leading-[14px] tracking-[0.04em] text-accent-orange">
          {label}
        </span>
        <span className="max-w-[520px] font-mono text-[10px] leading-[14px] tracking-[0.05em] text-faint">
          {note}
        </span>
      </div>
      {children}
    </div>
  );
}

function BaselineStream() {
  return (
    <div className="flex flex-col gap-5">
      <NoteCard {...DENSITY_NOTES[0]!} />
      <NoteCard {...DENSITY_NOTES[1]!} />
      <BlogPostCard {...DENSITY_BLOG} />
      <ShowcaseCard {...DENSITY_SHOWCASE} />
      <NoteCard {...DENSITY_NOTES[2]!} />
    </div>
  );
}

function FrostedEverywhereStream() {
  // The ambient wash is the parent's background — backdrop-blur on children
  // then has something to sample. The real page floor is flat #0a0a0b, so
  // picking this option means also giving the home page some ambient
  // interest (shader, gradient, noise) for the effect to pay off.
  return (
    <div
      className="relative max-w-[600px] overflow-hidden rounded-card"
      style={{
        backgroundImage: `
          radial-gradient(520px 360px at 18% 22%, rgba(112, 207, 212, 0.11), transparent 60%),
          radial-gradient(440px 360px at 82% 74%, rgba(232, 152, 120, 0.09), transparent 60%),
          radial-gradient(360px 280px at 48% 52%, rgba(207, 152, 232, 0.06), transparent 65%)
        `,
      }}
    >
      <div className="flex flex-col gap-4 p-5">
        <FrostedNote {...DENSITY_NOTES[0]!} />
        <FrostedNote {...DENSITY_NOTES[1]!} />
        <FrostedBlogPost {...DENSITY_BLOG} />
        <FrostedShowcase {...DENSITY_SHOWCASE} />
        <FrostedNote {...DENSITY_NOTES[2]!} />
      </div>
    </div>
  );
}

function ShaderStream() {
  // Short-form chrome is shared with Option D (same frosted notes + showcases
  // inside the same radial ambient wash) — only the BlogPostCard swaps out
  // its frosted surface for the shader-backed ShaderBlogPost.
  return (
    <div
      className="relative max-w-[600px] overflow-hidden rounded-card"
      style={{
        backgroundImage: `
          radial-gradient(520px 360px at 18% 22%, rgba(112, 207, 212, 0.11), transparent 60%),
          radial-gradient(440px 360px at 82% 74%, rgba(232, 152, 120, 0.09), transparent 60%),
          radial-gradient(360px 280px at 48% 52%, rgba(207, 152, 232, 0.06), transparent 65%)
        `,
      }}
    >
      <div className="flex flex-col gap-4 p-5">
        <FrostedNote {...DENSITY_NOTES[0]!} />
        <FrostedNote {...DENSITY_NOTES[1]!} />
        <ShaderBlogPost {...DENSITY_BLOG} />
        <FrostedShowcase {...DENSITY_SHOWCASE} />
        <FrostedNote {...DENSITY_NOTES[2]!} />
      </div>
    </div>
  );
}

/* ---- Shared variant prop shapes ----------------------------------------- */

interface NoteVariantProps {
  tags: string[];
  timestamp: string;
  body: string;
  engagement?: { replies?: number; likes?: number };
}

interface ShowcaseVariantProps {
  tags: string[];
  timestamp: string;
  body: string;
  images: { caption: string }[];
  engagement?: { replies?: number; likes?: number };
}

interface BlogPostVariantProps {
  tags: string[];
  timestamp: string;
  readTime: string;
  title: string;
  excerpt: string;
  engagement?: { replies?: number; likes?: number };
}

/**
 * Leading stripe style used by Option D's BlogPostCard hover stripe. Single
 * tag → solid color. Multi-tag → the 4s stripe-cycle gradient (loops
 * seamlessly because the first color repeats at the end of the stops).
 */
function buildBlogPostStripeStyle(tags: string[]): React.CSSProperties {
  if (tags.length <= 1) {
    return { backgroundColor: tagColor(tags[0] ?? "building") };
  }
  const ordered = [...tags, tags[0]!];
  const stops = ordered.map((t) => tagColor(t)).join(", ");
  return {
    backgroundImage: `linear-gradient(172deg, ${stops})`,
    backgroundSize: "100% 100%",
    backgroundRepeat: "repeat-y",
    animation: "stripe-cycle 4s linear infinite",
  };
}

/* ---- Option D · frosted everywhere -------------------------------------- */

const FROSTED_SURFACE: React.CSSProperties = {
  backgroundColor: "rgba(20, 20, 22, 0.42)", // #141416 at 42%
  borderColor: "rgba(255, 255, 255, 0.06)",
};

function FrostedNote({
  tags,
  timestamp,
  body,
  engagement = {},
}: NoteVariantProps) {
  const railStyle = buildBlogPostStripeStyle(tags);
  return (
    <article
      className="group relative flex max-w-[600px] flex-col gap-3 rounded-card border px-4 pt-4 pb-3 backdrop-blur-md transition-colors duration-200 sm:px-5 sm:pt-5 sm:pb-4"
      style={FROSTED_SURFACE}
    >
      {/* Ambient glow — wider blurred sibling, fades in on hover. */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 h-full w-2 rounded-l-card opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-[0.12]"
        style={railStyle}
      />
      {/* Crisp rail — picks up the dynamic tag-color gradient from BlogPostCard. */}
      <span
        aria-hidden
        className="absolute top-0 left-0 h-full w-[3px] rounded-l-xs opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={railStyle}
      />
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
        {tags.map((t) => (
          <Tag key={t} name={t}>
            #{t}
          </Tag>
        ))}
        <Meta>· {timestamp}</Meta>
      </div>
      <p className="font-sans text-[14px] leading-[22px] tracking-[-0.03em] text-text sm:text-[15px] sm:leading-[25px]">
        {body}
      </p>
      <div className="mt-1 flex items-center gap-3 text-faint sm:gap-4">
        {engagement.replies !== undefined ? (
          <EngagementButton
            icon="reply"
            label="Reply"
            count={engagement.replies}
          />
        ) : null}
        {engagement.likes !== undefined ? (
          <EngagementButton icon="like" label="Like" count={engagement.likes} />
        ) : null}
        <EngagementButton icon="bookmark" label="Save" />
        <EngagementButton icon="share" label="Share" />
      </div>
    </article>
  );
}

function FrostedShowcase({
  tags,
  timestamp,
  body,
  images,
  engagement = {},
}: ShowcaseVariantProps) {
  const primaryTag = tags[0] ?? "building";
  const railStyle = buildBlogPostStripeStyle(tags);
  return (
    <article
      className="group relative flex max-w-[600px] flex-col gap-3.5 rounded-card border p-4 backdrop-blur-md transition-colors duration-200 sm:p-5"
      style={FROSTED_SURFACE}
    >
      {/* Ambient glow — wider blurred sibling, fades in on hover. */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 h-full w-2 rounded-l-card opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-[0.12]"
        style={railStyle}
      />
      {/* Crisp rail — dynamic tag-color gradient matches BlogPostCard. */}
      <span
        aria-hidden
        className="absolute top-0 left-0 h-full w-[3px] rounded-l-xs opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={railStyle}
      />
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
        {tags.map((t) => (
          <Tag key={t} name={t}>
            #{t}
          </Tag>
        ))}
        <Meta>· {timestamp}</Meta>
      </div>
      <p className="font-sans text-[15px] leading-[25px] tracking-[-0.03em] text-text">
        {body}
      </p>
      <div
        className={cn(
          "relative h-48 w-full overflow-hidden rounded-[3px] border border-border bg-gradient-to-br sm:h-60",
          GLOW_NEUTRAL_BASE,
        )}
      >
        <div
          className="absolute inset-0"
          style={{ backgroundImage: tileGlow(primaryTag, "strong") }}
        />
        <div className="absolute bottom-3 right-3">
          <Label tone="faint" size="xs">
            {images[0]?.caption ?? ""}
          </Label>
        </div>
      </div>
      <div className="flex items-center gap-3 text-faint sm:gap-4">
        {engagement.replies !== undefined ? (
          <EngagementButton
            icon="reply"
            label="Reply"
            count={engagement.replies}
          />
        ) : null}
        {engagement.likes !== undefined ? (
          <EngagementButton icon="like" label="Like" count={engagement.likes} />
        ) : null}
        <EngagementButton icon="bookmark" label="Save" />
      </div>
    </article>
  );
}

function FrostedBlogPost({
  tags,
  timestamp,
  readTime,
  title,
  excerpt,
  engagement = {},
}: BlogPostVariantProps) {
  return (
    <article
      className="group relative flex max-w-[600px] flex-col gap-3.5 rounded-card border p-5 backdrop-blur-md transition-colors duration-200 sm:p-7"
      style={FROSTED_SURFACE}
    >
      <span
        aria-hidden
        className="absolute top-0 left-0 h-full w-[3px] rounded-l-card opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={buildBlogPostStripeStyle(tags)}
      />
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
        {tags.map((t) => (
          <Tag key={t} name={t}>
            #{t}
          </Tag>
        ))}
        <Meta>
          · {timestamp} · {readTime}
        </Meta>
      </div>
      <h3 className="font-serif text-[22px] leading-[28px] tracking-[-0.015em] text-text sm:text-[28px] sm:leading-[34px]">
        {title}
      </h3>
      <p className="font-sans text-[15px] leading-6 tracking-[-0.03em] text-muted transition-colors duration-200 group-hover:text-body">
        {excerpt}
      </p>
      <div className="mt-1 flex items-center justify-between">
        <div className="flex items-center gap-3 text-faint sm:gap-4">
          {engagement.replies !== undefined ? (
            <EngagementButton
              icon="reply"
              label="Reply"
              count={engagement.replies}
              iconSize={14}
            />
          ) : null}
          {engagement.likes !== undefined ? (
            <EngagementButton
              icon="like"
              label="Like"
              count={engagement.likes}
              iconSize={14}
            />
          ) : null}
          <EngagementButton icon="bookmark" label="Save" iconSize={14} />
        </div>
        <div className="flex items-center gap-1.5 text-muted transition-[color,gap] duration-200 group-hover:gap-2.5 group-hover:text-accent-orange">
          <span className="font-sans text-[13px] leading-4 tracking-[-0.03em]">
            Read
          </span>
          <Icon
            name="arrow-right"
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </div>
      </div>
    </article>
  );
}

/* ---- Option E · shader blog on frosted feed -----------------------------
 *
 * Short-form (notes, showcases) reuses Option D's frosted chrome — same
 * translucent surface + `backdrop-blur-md`, sharing the radial ambient
 * wash parent container so the blur has subject matter to sample.
 *
 * The BlogPostCard is the only primitive that diverges: it runs Paper's
 * GrainGradient shader in its default `corners` shape with tag-derived
 * HSL colors and a `#0a0a0b` colorBack floor — the grain breaks smooth
 * color into texture so it reads as atmosphere. A heavy backdrop-blur
 * with a deep dark tint sits on top; hover crossfades to a saturation-
 * buffed sibling and thins the overlay slightly. Title / excerpt / Read
 * CTA carry text-shadow halos so their contrast stays intact even when
 * the shader pokes through. The shader IS the tag-signal for long-form.
 *
 * `isolation: isolate` on the shader card scopes the backdrop-filter to
 * the card's stacking context — the blur samples only the shader inside,
 * not the ambient wash beneath.
 * ------------------------------------------------------------------------- */

/**
 * HSL approximation of the OKLCH tag palette for the shader input. Paper's
 * color parser accepts HSL / RGB / hex but not OKLCH, and at the blur
 * strength we use here the perceptual drift between the two color spaces
 * isn't visible. Hue carries the signal; saturation and lightness are
 * tuned so the mesh feels continuous with the rest of the site.
 *
 * Two palettes — rest is barely perceptible, hover bumps saturation and
 * lightness so the card comes alive when intent-to-read is signaled. The
 * shader's speed ramps in the same way via layered MeshGradient canvases
 * (see ShaderBlogPost).
 */
function shaderPaletteRest(tags: string[]): string[] {
  const safe = tags.length > 0 ? tags : ["building"];
  const palette: string[] = [];
  for (const t of safe) {
    palette.push(`hsl(${tagHue(t)}, 39%, 46%)`);
    palette.push(`hsl(${tagHue(t)}, 23%, 24%)`);
  }
  // One internal neutral band — colorBack handles the true page-floor dark.
  // GrainGradient caps at 7 colors, so for three tags (6 tag entries) this
  // is the ceiling.
  palette.push("#111114");
  return palette;
}

function shaderPaletteHover(tags: string[]): string[] {
  const safe = tags.length > 0 ? tags : ["building"];
  const palette: string[] = [];
  for (const t of safe) {
    palette.push(`hsl(${tagHue(t)}, 53%, 56%)`);
    palette.push(`hsl(${tagHue(t)}, 35%, 32%)`);
  }
  palette.push("#111114");
  return palette;
}

function ShaderBlogPost({
  tags,
  timestamp,
  readTime,
  title,
  excerpt,
  engagement = {},
}: BlogPostVariantProps) {
  return (
    <article
      className={cn(
        "group relative max-w-[600px] overflow-hidden rounded-card border border-border transition-colors duration-500",
        "hover:border-border-hover",
        // Frosted-pane alpha as a CSS var — thins slightly on hover so the
        // buffed shader peeks through, but not enough to compromise text.
        "[--overlay-alpha:0.76] hover:[--overlay-alpha:0.70]",
      )}
      style={{ isolation: "isolate" }}
    >
      {/* Ambient GrainGradient — desaturated, barely moving. Visible at rest. */}
      <div
        aria-hidden
        className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0"
      >
        <GrainGradient
          colorBack="#141416"
          colors={shaderPaletteRest(tags)}
          softness={0.85}
          intensity={0.5}
          noise={0.42}
          speed={0.025}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Vivid GrainGradient — saturation-buffed, slightly faster. Fades in on hover. */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      >
        <GrainGradient
          colorBack="#141416"
          colors={shaderPaletteHover(tags)}
          softness={0.8}
          intensity={0.58}
          noise={0.4}
          speed={0.055}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Frosted pane — heavy blur + CSS-var alpha. */}
      <div
        aria-hidden
        className="absolute inset-0 backdrop-blur-3xl transition-[background-color] duration-500"
        style={{ backgroundColor: "rgba(20, 20, 22, var(--overlay-alpha))" }}
      />

      {/* Content — text-shadow halos protect readability over the shader. */}
      <div className="relative flex flex-col gap-3.5 p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
          {tags.map((t) => (
            <Tag key={t} name={t}>
              #{t}
            </Tag>
          ))}
          <Meta className="[text-shadow:0_1px_4px_rgba(0,0,0,0.55)]">
            · {timestamp} · {readTime}
          </Meta>
        </div>
        <h3 className="font-serif text-[22px] leading-[28px] tracking-[-0.015em] text-text sm:text-[28px] sm:leading-[34px] [text-shadow:0_1px_12px_rgba(0,0,0,0.65),_0_1px_3px_rgba(0,0,0,0.4)]">
          {title}
        </h3>
        <p className="font-sans text-[15px] leading-6 tracking-[-0.03em] text-muted transition-colors duration-200 group-hover:text-body [text-shadow:0_1px_8px_rgba(0,0,0,0.55)]">
          {excerpt}
        </p>
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-3 text-faint sm:gap-4">
            {engagement.replies !== undefined ? (
              <EngagementButton
                icon="reply"
                label="Reply"
                count={engagement.replies}
                iconSize={14}
              />
            ) : null}
            {engagement.likes !== undefined ? (
              <EngagementButton
                icon="like"
                label="Like"
                count={engagement.likes}
                iconSize={14}
              />
            ) : null}
            <EngagementButton icon="bookmark" label="Save" iconSize={14} />
          </div>
          <div className="flex items-center gap-1.5 text-muted transition-[color,gap] duration-200 group-hover:gap-2.5 group-hover:text-accent-orange">
            <span className="font-sans text-[13px] leading-4 tracking-[-0.03em] [text-shadow:0_1px_6px_rgba(0,0,0,0.55)]">
              Read
            </span>
            <Icon
              name="arrow-right"
              size={14}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
