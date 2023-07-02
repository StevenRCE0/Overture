import { blog, BlogCategory, BlogList } from './types'
import BlogTest from "../../../public/blog/mdx-init.svx"

export const blogIndex: BlogList = [
    blog(
        "Svelte Transition",
        "svelte-transition",
        [BlogCategory.General],
        new Date("2023-04-12"),
        true
    ),
    blog(
        "Todo List №3",
        "todo-23",
        [BlogCategory.General],
        new Date("2023-04-12"),
        true
    ),
    blog(
        "MDX Initiated",
        "mdx-init",
        [BlogCategory.General],
        new Date("2023-07-02"),
        BlogTest
    )
]
