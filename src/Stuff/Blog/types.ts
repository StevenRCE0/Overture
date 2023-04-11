export enum BlogCategory {
    "General" = "General",
    "Design" = "Design",
    "Development" = "Development",
}

export interface BlogMeta {
    title: string
    date: Date
    category: BlogCategory[]
}

export interface Blog extends BlogMeta {
    content:  () => Promise<string>
}

export interface InflatedBlog extends BlogMeta {
    content: string
}

export type BlogList = Blog[]

export function blog(
    title: string,
    pathName: string,
    category: BlogCategory[],
    date: Date
): Blog {
    return {
        title,
        category,
        date,
        content: () => fetch(`/blog/${pathName}.md`).then((response) => response.text()),
    }
}