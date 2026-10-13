import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(), eyebrow: z.string(), description: z.string(), category: z.enum(['Play','Products','Experiments','Design']),
    color: z.string(), ink: z.string().default('#171a21'), icon: z.string(), featured: z.boolean().default(false),
    live: z.string().url().optional(), github: z.string().url().optional(), stack: z.array(z.string()), year: z.number(),
    problem: z.string(), solution: z.string(), outcome: z.string(), status: z.enum(['Live','Prototype','In progress']).default('Prototype')
  })
});
export const collections = { projects };