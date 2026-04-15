import { z } from "zod";

const slug = z
  .string()
  .regex(/^[a-z0-9][a-z0-9-]*$/, "slug must be kebab-case: lowercase, digits, hyphens");

const engagement = z
  .object({
    replies: z.number().int().nonnegative().optional(),
    likes: z.number().int().nonnegative().optional(),
  })
  .partial()
  .optional();

const baseFields = {
  slug,
  published: z.coerce.date(),
  tags: z.array(z.string().min(1)).min(1, "at least one tag required"),
  projects: z.array(z.string().min(1)).optional(),
  draft: z.boolean().default(false),
  engagement,
};

export const noteFrontmatter = z.object({
  type: z.literal("note"),
  title: z.string().optional(),
  ...baseFields,
});

export const postFrontmatter = z.object({
  type: z.literal("post"),
  title: z.string().min(1),
  excerpt: z.string().optional(),
  ...baseFields,
});

export const showcaseImage = z.object({
  caption: z.string().min(1),
  src: z.string().optional(),
  glow: z.enum(["warm", "cool", "pink", "amber"]).optional(),
  picked: z.boolean().optional(),
});

export const showcaseFrontmatter = z.object({
  type: z.literal("showcase"),
  title: z.string().optional(),
  variant: z.enum(["single", "grid", "bento"]),
  images: z.array(showcaseImage).min(1).max(6),
  ...baseFields,
});

export const projectMeta = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

export const projectCta = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

export const projectFrontmatter = z.object({
  type: z.literal("project"),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  tier: z.enum(["showcase", "smaller", "bitesized"]),
  status: z.string().optional(),
  badge: z.string().optional(),
  meta: z.array(projectMeta).optional(),
  primaryCta: projectCta.optional(),
  secondaryCta: projectCta.optional(),
  visualBadge: z.string().optional(),
  ...baseFields,
});

export const frontmatter = z.discriminatedUnion("type", [
  noteFrontmatter,
  postFrontmatter,
  showcaseFrontmatter,
  projectFrontmatter,
]);

export type NoteFrontmatter = z.infer<typeof noteFrontmatter>;
export type PostFrontmatter = z.infer<typeof postFrontmatter>;
export type ShowcaseFrontmatter = z.infer<typeof showcaseFrontmatter>;
export type ProjectFrontmatter = z.infer<typeof projectFrontmatter>;
export type ShowcaseImage = z.infer<typeof showcaseImage>;
export type ProjectMeta = z.infer<typeof projectMeta>;
export type Frontmatter = z.infer<typeof frontmatter>;
export type FeedFrontmatter = NoteFrontmatter | PostFrontmatter | ShowcaseFrontmatter;
