<script lang="ts">
    // import gsap from "gsap"
    import { fly } from "svelte/transition"
    import { onMount } from "svelte"
    import Play from "./Play.svelte";
    import Previous from "./Previous.svelte";
    import Next from "./Next.svelte";

    export const themeColour = "rgb(241, 211, 169)"
    export let controllers: HTMLElement
    export let dynamicCover: HTMLElement

    onMount(() => {})
</script>

<div bind:this={dynamicCover} transition:fly={{ x: -50, duration: 300 }} />

<div bind:this={controllers} id="controllersWrapper">
    <Previous />
    <Play />
    <Next />
</div>

<style>
    #controllersWrapper {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        justify-content: space-around;
        width: 100%;
        height: 100%;
    }
</style>