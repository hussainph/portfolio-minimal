import { notFound } from "next/navigation";
import { BlogPostCard } from "@/components/ui/BlogPostCard";
import { BentoShowcase } from "@/components/ui/BentoShowcase";
import { BottomToolbar } from "@/components/ui/BottomToolbar";
import { Label } from "@/components/ui/Label";
import { Meta } from "@/components/ui/Meta";
import { NoteCard } from "@/components/ui/NoteCard";
import { Separator } from "@/components/ui/Separator";
import { ShowcaseCard } from "@/components/ui/ShowcaseCard";
import { Tag, type TagVariant } from "@/components/ui/Tag";
import { TextLink } from "@/components/ui/TextLink";

export default function UITestPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="min-h-screen bg-background text-text">
      <div className="mx-auto flex max-w-[960px] flex-col gap-16 px-12 pt-16 pb-48">
        <Header />

        <Section number="00" title="Colors" subtitle="ground · tags · accent">
          <ColorsSection />
        </Section>

        <Section number="01" title="Typography" subtitle="three fonts, three jobs">
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
          title="Bottom toolbar"
          subtitle="live at the bottom of this page — scroll to test auto-hide"
        >
          <ToolbarSection />
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
      <h1 className="font-serif text-[42px] leading-[52px] text-text">
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
        <h2 className="font-serif text-[24px] leading-[30px] text-text">
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
  const ground: { name: string; hex: string }[] = [
    { name: "background", hex: "#0a0a0b" },
    { name: "surface", hex: "#141416" },
    { name: "elevated", hex: "#1e1e21" },
    { name: "border", hex: "#252528" },
    { name: "text", hex: "#f0ebe3" },
    { name: "muted", hex: "#908a84" },
    { name: "faint", hex: "#555250" },
  ];

  const tags: { variant: TagVariant; hex: string }[] = [
    { variant: "ai", hex: "#7B7EFF" },
    { variant: "building", hex: "#FFB844" },
    { variant: "design", hex: "#FF7A94" },
    { variant: "thinking", hex: "#FFCC55" },
    { variant: "code", hex: "#4AE0B4" },
    { variant: "reading", hex: "#4AC0E0" },
  ];

  return (
    <div className="flex flex-col gap-10">
      <div>
        <Label tone="faint" size="xs" className="mb-3 block">
          Ground · Deeper Dark
        </Label>
        <div className="flex flex-wrap gap-4">
          {ground.map((c) => (
            <div key={c.name} className="flex w-[110px] flex-col gap-1.5">
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
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label tone="faint" size="xs" className="mb-3 block">
          Tags · 75% sat · 58% lightness
        </Label>
        <div className="flex flex-wrap items-center gap-3">
          {tags.map((t) => (
            <div key={t.variant} className="flex items-center gap-2">
              <div
                className="h-8 w-8 rounded-[3px] border border-border"
                style={{ backgroundColor: t.hex }}
              />
              <Tag variant={t.variant}>#{t.variant}</Tag>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label tone="faint" size="xs" className="mb-3 block">
          Accent · Text link
        </Label>
        <div className="flex items-center gap-3">
          <div
            className="h-8 w-32 rounded-[3px] border border-border"
            style={{ backgroundColor: "#70CFD4" }}
          />
          <span className="font-mono text-[11px] text-faint">
            #70CFD4 · accent-teal
          </span>
        </div>
      </div>
    </div>
  );
}

function TypographySection() {
  return (
    <div className="flex flex-col gap-6">
      <Specimen label="Display · Instrument Serif Regular · 42px / 52px">
        <div className="font-serif text-[42px] leading-[52px] text-text">
          Trust Is the Bottleneck
        </div>
      </Specimen>
      <Specimen label="H1 · Instrument Serif Regular · 28px">
        <div className="font-serif text-[28px] leading-[34px] text-text">
          The Memory-Trust Paradox
        </div>
      </Specimen>
      <Specimen label="H2 · DM Sans 500 · 22px / -3%">
        <div className="font-sans text-[22px] leading-[28px] tracking-[-0.03em] font-medium text-text">
          Building in the Gap
        </div>
      </Specimen>
      <Specimen label="H3 · DM Sans 500 · 18px / -3%">
        <div className="font-sans text-[18px] leading-[24px] tracking-[-0.03em] font-medium text-text">
          Craft Over Hype, Every Time
        </div>
      </Specimen>
      <Specimen label="Pull Quote · Instrument Serif Italic · 22px · muted">
        <div className="font-serif italic text-[22px] leading-[30px] text-muted">
          I guess what I&apos;m saying is, the best AI products aren&apos;t the
          most autonomous ones — they&apos;re the ones that make you feel like
          you&apos;re still driving.
        </div>
      </Specimen>
      <Specimen label="Body · DM Sans 400 · 15px · -3% · 1.65 line-height">
        <p className="font-sans text-[15px] leading-[25px] tracking-[-0.03em] text-text">
          I feel like the real problem with most AI products isn&apos;t
          capability, right? It&apos;s that they sort of skip the trust-building
          part entirely and go straight to &quot;look what I can do&quot; — and
          then people don&apos;t use them.
        </p>
      </Specimen>
      <Specimen label="System · JetBrains Mono · 11px · tags / timestamps / code">
        <div className="flex flex-wrap items-center gap-3">
          <Meta>Apr 13, 2026</Meta>
          <Meta>·</Meta>
          <Meta>4 min</Meta>
          <Tag variant="building">#building</Tag>
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
    <p className="font-sans text-[17px] leading-[28px] tracking-[-0.03em] text-text max-w-[600px]">
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

      <CardLane label="Showcase — single idea, one ambient image">
        <ShowcaseCard
          tags={["design"]}
          timestamp="apr 10 · small idea"
          body="Tried a different approach to the onboarding tooltip — ambient instead of intrusive. Small texture fragment shows up and fades. Feels way less like being yelled at."
          images={[{ caption: "ONBOARDING · V3", glow: "amber" }]}
          engagement={{ replies: 5, likes: 34 }}
        />
      </CardLane>

      <CardLane label="Bento — three iterations, picked one highlighted in #code teal">
        <BentoShowcase
          tags={["code", "building"]}
          timestamp="apr 11 · iterations"
          body="Three takes on the tool-use UI for Volli. Ended up liking v2 most — the side-rail keeps the context without hijacking the read."
          images={[
            { caption: "V1", glow: "warm" },
            { caption: "V2 ← picked", glow: "cool", picked: true },
            { caption: "V3", glow: "pink" },
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

function ToolbarSection() {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-sans text-[15px] leading-[25px] tracking-[-0.03em] text-muted max-w-[600px]">
        The toolbar at the bottom of this page is the real component. It uses{" "}
        <code className="font-mono text-[13px] text-text">
          useToolbarVisibility
        </code>{" "}
        to slide out after 3 seconds of cursor inactivity (once you&apos;ve
        scrolled past 200px), and slides back in on cursor movement, scroll, or
        keypress. Try it — scroll, then sit still.
      </p>
      <ul className="flex flex-col gap-1.5 font-mono text-[11px] leading-[18px] tracking-[0.04em] text-faint max-w-[600px]">
        <li>spring · stiffness 260 · damping 22 · mass 1</li>
        <li>backdrop-filter · blur 24px · bg #14141699</li>
        <li>auto-hide · 3000ms idle · scroll &gt; 200px</li>
        <li>prefers-reduced-motion · simple fade, no spring</li>
      </ul>
    </div>
  );
}
