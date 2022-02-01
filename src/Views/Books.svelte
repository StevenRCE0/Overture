<script lang="ts">
    import CentreStage from "../Views/CentreStage.svelte"
    import Booklet from "../Stuff/Booklet"
    import { fetchBook } from "../workers/gistParser"
    import { Vector3 } from "three"
    import { watchResize } from "svelte-watch-resize"
    import { onMount } from "svelte"
    import Counter from "../Stuff/Counter"

    let bookShelf = new Array<Booklet>()
    let itemBuffer = new Array<THREE.Object3D<THREE.Event>>()
    let rotation = 0
    let scroll = 0
    let stage: CentreStage

    let currentBook: Booklet
    let figure: Counter
    let currentIndex = 1

    $: innerWidth = window.innerWidth
    $: innerHeight = window.innerHeight

    $: figure?.digitCurrent.translateX(-innerWidth / 15)
    $: figure?.digitCurrent.translateY(innerHeight / 15)
    $: figure?.digitCurrent.translateZ(-75)
    $: figure?.digitTotal.translateX(innerWidth / 15)
    $: figure?.digitTotal.translateY(innerHeight / 15)
    $: figure?.digitTotal.translateZ(-75)
    $: figure?.outOf.translateY(innerHeight / 12)
    $: figure?.outOf.translateZ(-115)

    $: outtaScale = Math.max(0, 1 - scroll / (innerHeight / 20))
    $: figure?.outOf.scale.set(outtaScale, outtaScale, 1)

    $: currentBook?.tape.translateY(
        -10 + scroll / 3 - currentBook.tape.position.y
    )
    $: currentBook?.book.rotateX(
        ((rotation + scroll / 8 - 40) * Math.PI) / 360 -
            currentBook.book.rotation.x
    )
    $: currentBook?.book.translateY(
        -Math.max(-scroll / 3.5 - 5, -innerHeight / 20 + 5) -
            currentBook.book.position.y
    )
    $: currentBook &&
        (currentBook.book.scale.x =
            currentBook.book.scale.y =
            currentBook.book.scale.z =
                Math.max(1 - scroll / (innerHeight / 3.5), 0.5))

    onMount(() => {
        fetchBook("/gist/StevenRCE0/a68460422937f182bc591788fa30e930/raw").then(
            (books) => {
                books.map((bookInformation) => {
                    const newBook = new Booklet(bookInformation)
                    figure = new Counter(books.length, currentIndex)
                    bookShelf = [...bookShelf, newBook]
                    itemBuffer = [...itemBuffer, newBook.book, newBook.tape, figure.digitCurrent, figure.digitTotal, figure.outOf]
                    newBook.book.translateOnAxis(new Vector3(0, 15, -5), 1)
                    newBook.tape.translateZ(-20)
                    newBook.coverLoaded.then(() => stage.deepRender())
                })
                currentBook = bookShelf[0]
            }
        )
    })
</script>

<div
    id="BooksStage"
    use:watchResize={() => {
        // book.resize()
        stage.deepRender()
    }}
>
    <CentreStage objects={[...itemBuffer]} bind:this={stage} resizeHandled />
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
