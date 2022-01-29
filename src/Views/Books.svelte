<script lang="ts">
    import CentreStage from "../Views/CentreStage.svelte"
    import Booklet, {coverLoaded} from "../Stuff/Booklet"
    const processedBook = Booklet.translateZ(-10)
    let rotation = 0
    let stage: CentreStage
    coverLoaded.then(() => stage.render())
    $: processedBook.rotateX(rotation * Math.PI / 360 - processedBook.rotation.x)
</script>

<div
    style="display: block; position: fixed; z-index: 999; bottom: 50px; left: 50px"
>
    <input type="range" min="-360" max="360" step="1" bind:value={rotation} on:input={() => {stage.render()}} />
</div>
<CentreStage objects={[processedBook]} bind:this={stage} />
