<script lang="ts">
    import CentreStage from "../Views/CentreStage.svelte"
    import Booklet from "../Stuff/Booklet"
    import { Vector3 } from "three"
    const book = new Booklet({ colour: 0x992323, title: "I Love yuu" })
    const tape = book.tape
    const processedBook = book.book
    processedBook.translateOnAxis(new Vector3(0, 15, -5), 1)
    tape.translateZ(-20)
    let rotation = 0
    let scroll = 0
    let stage: CentreStage
    $: properScroll = scroll / 1.6
    $: tape.translateY(-10 + properScroll - tape.position.y)
    $: processedBook.rotateX(
        ((rotation + scroll / 8 - 40) * Math.PI) / 360 -
            processedBook.rotation.x
    )
    book.coverLoaded.then(() => stage.render())
</script>

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
