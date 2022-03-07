<script lang="ts">
    import Bomb from "../mob/bomb/Bomb.svelte"
    let progress: number = 0
</script>

<div class="center">
    <Bomb bind:progress />
    <h1>{Math.round(progress * 100)}%</h1>
</div>

<style>
    .center {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>
