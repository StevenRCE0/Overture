<script lang="ts">
    import CentreStage from "../Views/CentreStage.svelte"
    import Booklet from "../Stuff/Booklet"
    const processedBook = Booklet
    let rotation = 0
    let stage: CentreStage
    $: processedBook.rotateX(rotation * Math.PI / 360 - processedBook.rotation.x)
</script>

<div
    style="display: block; position: fixed; z-index: 999; bottom: 50px; left: 50px"
>
    <input type="range" min="0" max="360" step="1" bind:value={rotation} on:mousemove={() => {stage.render()}} />
</div>
<CentreStage objects={[processedBook]} bind:this={stage} />
