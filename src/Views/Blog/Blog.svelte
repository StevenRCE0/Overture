<script lang="ts">
    import type { InflatedBlog } from "../../Stuff/Blog/types"
    import { onMount } from "svelte"
    import SvelteMarkdown from "svelte-markdown"
    import { blogIndex } from "../../Stuff/Blog"

    let indexes: InflatedBlog[] = blogIndex.map((entry) => ({
        title: entry.title,
        date: entry.date,
        category: entry.category,
        content: undefined,
    }))

    onMount(async () => {
        for (const entry of blogIndex) {
            const index = blogIndex.indexOf(entry)
            entry.content().then((content) => {
                indexes[index].content = content
            })
        }
    })
</script>

<main>
    <h1>Just s Simple Markdown Blog</h1>
    <hr />
    {#each indexes as entry}
        <h2>{entry.title}</h2>
        <section class="Article">
            <SvelteMarkdown source={entry.content} />
        </section>
    {/each}
</main>

<style>
    .Article {
        background: #f4f4f4;
    }
</style>
