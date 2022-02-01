<script lang="ts">
    import CentreStage from "../Views/CentreStage.svelte"
    import Booklet from "../Stuff/Booklet"
    import { fetchBook } from "../workers/gistParser"
    import { ConeBufferGeometry, Vector3 } from "three"
    import { watchResize } from "svelte-watch-resize"
    import { onMount } from "svelte"

    let bookShelf = new Array<Booklet>()
    let itemBuffer = new Array<THREE.Object3D<THREE.Event>>()
    let rotation = 0
    let scroll = 0
    let stage: CentreStage

    let currentBook: Booklet

    $: currentBook?.tape.translateY(
        -10 + scroll / 1.6 - currentBook.tape.position.y
    )
    $: currentBook?.book.rotateX(
        ((rotation + scroll / 8 - 40) * Math.PI) / 360 -
            currentBook.book.rotation.x
    )
    $: currentBook?.book.translateY(
        -Math.max(-scroll / 3 - 5, -window.innerHeight / 20 + 3) -
            currentBook.book.position.y
    )
    $: currentBook
        ?.printTape()
        .translateY(
            -Math.max(-scroll / 3 - 5, -window.innerHeight / 20 + 3) -
                currentBook.book.position.y
        )
    $: currentBook &&
        (currentBook.book.scale.x =
            currentBook.book.scale.y =
            currentBook.book.scale.z =
                Math.max(1 - scroll / (window.innerHeight / 4), 0.5))

    onMount(() => {
        fetchBook("/gist/StevenRCE0/a68460422937f182bc591788fa30e930/raw").then(
            (books) => {
                books.map((bookInformation) => {
                    const newBook = new Booklet(bookInformation)
                    bookShelf = [...bookShelf, newBook]
                    itemBuffer = [...itemBuffer, newBook.book, newBook.tape]
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
    <CentreStage objects={itemBuffer} bind:this={stage} resizeHandled />
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
