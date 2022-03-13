<script lang="ts">
    // import gsap from "gsap"
    import { fly } from "svelte/transition"
    import { onMount } from "svelte"

    export const themeColour = "rgb(241, 211, 169)"
    export let dynamicCover: HTMLElement

    onMount(() => {})
</script>

<div bind:this={dynamicCover} transition:fly={{ x: -50, duration: 300 }} />
