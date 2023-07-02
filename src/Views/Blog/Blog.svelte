<script lang="ts">
    import type { InflatedBlog } from "../../Stuff/Blog/types"
    import type { SVXBlogEntry } from "../../Stuff/Blog/types"
    import { onMount } from "svelte"
    import SvelteMarkdown from "svelte-markdown"
    import { blogIndex } from "../../Stuff/Blog"

    let indexes: InflatedBlog[] = blogIndex.map((entry) => ({
        title: entry.title,
        date: entry.date,
        category: entry.category,
        legacy: entry.legacy,
        fulfilled: false,
        content: undefined,
        component: undefined
    }))

    onMount(async () => {
        for (const entry of blogIndex) {
            const index = blogIndex.indexOf(entry)
            if (entry.legacy) {
                entry.content().then((content) => {
                    indexes[index].content = content
                    indexes[index].fulfilled = true
                })
            } else {
                indexes[index].component = entry.content() as SVXBlogEntry
                indexes[index].fulfilled = true
            }
        }
    })
</script>

<svelte:head>
    <title>Blog</title>
</svelte:head>

<main>
    <h1>Just Some Simple Markdown Blog</h1>
    <hr />
    {#each indexes as entry}
        <h2>{entry.title}</h2>
        {#if entry.fulfilled}
            {#if entry.legacy}
                <section class="Article">
                    <SvelteMarkdown source={entry.content} />
                </section>
            {:else}
                <svelte:component this={entry.component} />
            {/if}
        {:else}
            <p>...</p>
        {/if}
    {/each}
</main>

<style>
    .Article {
        background: #f4f4f4;
    }
</style>
