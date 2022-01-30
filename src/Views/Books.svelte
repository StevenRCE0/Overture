<script lang="ts">
    import CentreStage from "../Views/CentreStage.svelte"
    import Booklet from "../Stuff/Booklet"
    const book = new Booklet({colour: 0x992323})
    const tape = book.tape
    const processedBook = book.book
    tape.translateZ(-50)
    let rotation = 0
    let scroll = 0
    let stage: CentreStage
    $: tape.translateY(-180 + scroll - tape.position.y)
    $: processedBook.rotateX(
        ((rotation + (scroll / 8) - 40) * Math.PI) / 360 - processedBook.rotation.x
    )
    book.coverLoaded.then(() => stage.render())
</script>

<div
    style="display: block; position: fixed; z-index: 999; bottom: 50px; left: 50px"
>
    <input
        type="range"
        min="-360"
        max="360"
        step="1"
        bind:value={rotation}
        on:input={() => {
            stage.render()
        }}
    />
</div>
<div id="BooksStage">
    <CentreStage objects={[processedBook, tape]} bind:this={stage} />
</div>

<svelte:window
    bind:scrollY={scroll}
    on:scroll={() => {
        stage.render()
    }}
/>

<style>
    #BooksStage {
        height: 150vh;
    }
</style>
