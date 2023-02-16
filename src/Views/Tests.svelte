<script lang="ts">
    import Scrollers from "../tests/Scrollers.svelte";
    $: currentPos = {
        x: undefined,
        y: undefined
    }
    $: initialPos = {
        x: undefined,
        y: undefined
    }

    const handlePos = ({x, y}) => {
        currentPos.x = x
        currentPos.y = y
        if (!currentPos.x || !currentPos.y) {
            initialPos = currentPos
        }
    }
</script>

<Scrollers />

<div class="box">
    Drop Zone
</div>
<div class="box">
    Drop Zone
</div>
<div draggable='true' on:drag={currentPos}>
    Drag Me
</div>

<style>
    .box {
        height: 200px;
        width: 200px;
    }
</style>