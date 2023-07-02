import type { SvelteComponent } from "svelte"
import { SvelteComponentTyped } from "svelte"

export class SVXBlogEntry extends SvelteComponentTyped {}

export enum BlogCategory {
    "General" = "General",
    "Design" = "Design",
    "Development" = "Development",
}

export interface BlogMeta {
    title: string
    date: Date
    category: BlogCategory[]
    legacy: boolean
}

export interface Blog extends BlogMeta {
    content: () => Promise<string> | SvelteComponent
}

export interface InflatedBlog extends BlogMeta {
    fulfilled: boolean
    content?: string
    component?: SVXBlogEntry
}

export type BlogList = Blog[]

export function blog(
    title: string,
    pathName: string,
    category: BlogCategory[],
    date: Date,
    component: SvelteComponent | true = true
): Blog {
    return {
        title,
        category,
        date,
        content: component === true
            ? async () => {
                  const response = await fetch(`/blog/${pathName}.md`)
                  return await response.text()
              }
            : () => component,
        legacy: component === true,
    }
}
