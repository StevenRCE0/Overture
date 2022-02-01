<script lang="ts">
    import CentreStage from "../Views/CentreStage.svelte"
    import Booklet from "../Stuff/Booklet"
    import { Matrix4, Vector3, Vector4 } from "three"
    import { watchResize } from "svelte-watch-resize"

    const bookInformation = {
        cover: "/sf/why.jpg",
        colour: 0x992323,
        title: "I Love yuu",
    }
    let book = new Booklet(bookInformation)
    let tape = book.printTape()
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
    $: processedBook.translateY(
        -Math.max((-scroll / 3) - 5, -window.innerHeight / 20 + 3) -
            processedBook.position.y
    )
    $: processedBook.scale.x = processedBook.scale.y = processedBook.scale.z = Math.max(1 - scroll / (window.innerHeight / 4), 0.5)
    book.coverLoaded.then(() => stage.render())
</script>

<div
    id="BooksStage"
    use:watchResize={() => {
        book.resize()
        // tape = book.printTape()
        stage.deepRender()
    }}
>
    <CentreStage
        objects={[processedBook, tape]}
        bind:this={stage}
        resizeHandled
    />
</div>

<svelte:window
    bind:scrollY={scroll}
    on:scroll={() => {
        stage.render()
    }}
/>

<style>
    #BooksStage {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 150vh;
    }
</style>
