<script lang="ts">
    import Tnt from "./tnt.svelte"
    import Wire from "./wire.svelte"

    export let progress = 0
</script>

<div class="wrap">
    <Tnt style="width: 100px" />
    <div class="wire">
        <input
            class="slider"
            type="range"
            min="0"
            max="1"
            step="0.01"
            bind:value={progress}
        />
        <Wire bind:progress />
    </div>
</div>

<style>
    .wrap {
        height: 100px;
        display: flex;
        flex-direction: row;
        text-align: left;
    }
    .wire {
        position: relative;
    }
    .slider {
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>
