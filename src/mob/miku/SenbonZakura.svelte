<script lang="ts">
    import gsap from "gsap"
    import { fly } from "svelte/transition"
    import { onMount } from "svelte"

    export const themeColour = "rgb(241, 211, 169)"
    export let dynamicCover: HTMLElement

    const timeline = gsap.timeline({
        defaults: {
            duration: 1,
            ease: "power2.inOut",
            repeat: 1,
        },
    })
    timeline.from(".cover", {
        y: "-100%",
        ease: "power2.inOut",
    })

    onMount(() => {})
</script>

<div bind:this={dynamicCover} transition:fly={{ x: -50, duration: 300 }}>
    <svg />
</div>
