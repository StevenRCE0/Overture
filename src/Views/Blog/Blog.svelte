<script lang="ts">
    import type { InflatedBlog } from "../../Stuff/Blog/types"
    import { onMount } from "svelte"
    import SvelteMarkdown from "svelte-markdown"
    import { blogIndex } from "../../Stuff/Blog"
    import type { SvelteComponent } from "svelte/internal"

    let indexes: InflatedBlog[] = blogIndex.map((entry) => ({
        title: entry.title,
        date: entry.date,
        category: entry.category,
        legacy: entry.legacy,
        content: undefined,
    }))

    onMount(async () => {
        for (const entry of blogIndex) {
            const index = blogIndex.indexOf(entry)
            console.log(entry.content());
            if (entry.legacy) {
                
                entry.content().then((content) => {
                    indexes[index].content = content
                })
            } else {
                indexes[index].content = entry.content()
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
        {#if entry.content}
            {#if entry.legacy}
                <section class="Article">
                    <SvelteMarkdown source={entry.content} />
                </section>
            {:else}
                <svelte:component this={entry.content} />
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
