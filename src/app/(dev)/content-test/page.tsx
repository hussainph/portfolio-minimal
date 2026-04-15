import { notFound } from "next/navigation";
import { Label } from "@/components/ui/Label";
import { loadAll } from "@/lib/content";

export default async function ContentTestPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const index = await loadAll();

  const feedRows = index.items.map((item) => ({
    kind: item.kind,
    slug: item.frontmatter.slug,
    tags: item.frontmatter.tags,
    projects: item.frontmatter.projects ?? [],
    published: item.frontmatter.published.toISOString(),
    readingTime: item.readingTimeMinutes,
    excerpt:
      item.kind === "post"
        ? item.excerpt
        : item.kind === "showcase"
          ? `${item.frontmatter.variant} · ${item.frontmatter.images.length} image${
              item.frontmatter.images.length === 1 ? "" : "s"
            }`
          : "—",
  }));

  return (
    <main className="min-h-screen bg-background text-text">
      <div className="mx-auto flex max-w-[960px] flex-col gap-10 px-12 pt-16 pb-24">
        <header className="flex flex-col gap-2">
          <Label tone="faint">Dev · Content Index Dump</Label>
          <h1 className="font-serif text-[32px] leading-[38px] tracking-[-0.015em] text-text">
            Phase 1 loader proof
          </h1>
          <p className="font-sans text-[15px] leading-[22px] tracking-[-0.03em] text-muted">
            Raw output of <code className="font-mono text-[13px] text-text">loadAll()</code>.
            If this renders without a build error and the numbers below match the
            <code className="font-mono text-[13px] text-text"> content/</code> directory,
            the CMS plumbing works.
          </p>
        </header>

        <section className="flex flex-col gap-3">
          <Label tone="faint" size="xs">
            Feed items · {index.items.length}
          </Label>
          <div className="rounded-card border border-border bg-sunken p-5">
            <table className="w-full text-left font-mono text-[11px] leading-[16px] text-body">
              <thead className="text-faint">
                <tr>
                  <th className="pb-2 pr-4">kind</th>
                  <th className="pb-2 pr-4">slug</th>
                  <th className="pb-2 pr-4">published</th>
                  <th className="pb-2 pr-4">tags</th>
                  <th className="pb-2 pr-4">projects</th>
                  <th className="pb-2 pr-4">read</th>
                  <th className="pb-2">preview</th>
                </tr>
              </thead>
              <tbody>
                {feedRows.map((row) => (
                  <tr key={row.slug} className="border-t border-border">
                    <td className="py-2 pr-4 text-accent-orange">{row.kind}</td>
                    <td className="py-2 pr-4 text-text">{row.slug}</td>
                    <td className="py-2 pr-4 text-muted">{row.published.slice(0, 16)}</td>
                    <td className="py-2 pr-4 text-body">{row.tags.join(" ")}</td>
                    <td className="py-2 pr-4 text-muted">
                      {row.projects.length ? row.projects.join(" ") : "—"}
                    </td>
                    <td className="py-2 pr-4 text-faint">{row.readingTime}m</td>
                    <td className="py-2 text-faint">
                      {row.excerpt.length > 70
                        ? `${row.excerpt.slice(0, 70)}…`
                        : row.excerpt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <Label tone="faint" size="xs">
            Projects · {index.projects.length}
          </Label>
          <div className="flex flex-col gap-4">
            {index.projects.map((project) => (
              <div
                key={project.frontmatter.slug}
                className="rounded-card border border-border bg-sunken p-5"
              >
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="font-mono text-[11px] text-accent-orange">
                    {project.frontmatter.tier}
                  </span>
                  <span className="font-serif text-[19px] leading-[26px] text-text">
                    {project.frontmatter.title}
                  </span>
                  <span className="font-mono text-[11px] text-faint">
                    {project.frontmatter.slug}
                  </span>
                </div>
                <p className="mt-2 font-sans text-[14px] leading-[20px] tracking-[-0.03em] text-body">
                  {project.frontmatter.subtitle}
                </p>
                <p className="mt-3 font-mono text-[11px] text-muted">
                  timeline: {project.timeline.length} item
                  {project.timeline.length === 1 ? "" : "s"}
                  {project.timeline.length
                    ? ` — ${project.timeline
                        .map((i) => `${i.kind}:${i.frontmatter.slug}`)
                        .join(", ")}`
                    : ""}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <Label tone="faint" size="xs">
            Tags · {index.byTag.size}
          </Label>
          <div className="rounded-card border border-border bg-sunken p-5">
            <ul className="flex flex-col gap-1 font-mono text-[11px] leading-[16px] text-body">
              {Array.from(index.byTag.entries())
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([tag, items]) => (
                  <li key={tag}>
                    <span className="text-accent-orange">#{tag}</span>
                    <span className="text-faint"> · {items.length}</span>
                    <span className="text-muted">
                      {" "}
                      · {items.map((i) => i.frontmatter.slug).join(", ")}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <Label tone="faint" size="xs">
            bySlug map · {index.bySlug.size}
          </Label>
          <div className="rounded-card border border-border bg-sunken p-5 font-mono text-[11px] leading-[16px] text-muted">
            {Array.from(index.bySlug.keys()).sort().join(" · ")}
          </div>
        </section>
      </div>
    </main>
  );
}
