import { blog, BlogCategory, BlogList } from './types'

export const blogIndex: BlogList = [
    blog(
        "Svelte Transition",
        "svelte-transition",
        [BlogCategory.General],
        new Date("2023-04-12")
    ),
    blog(
        "Todo List №3",
        "todo-23",
        [BlogCategory.General],
        new Date("2023-04-12")
    ),
]
