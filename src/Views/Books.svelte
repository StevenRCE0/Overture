<script lang="ts">
    import CentreStage from "../Views/CentreStage.svelte"
    import Booklet from "../Stuff/Booklet"
    import { fetchBook } from "../workers/gistParser"
    import { Vector3 } from "three"
    import { watchResize } from "svelte-watch-resize"
    import { onDestroy, onMount } from "svelte"
    import { tweened } from "svelte/motion"
    import { Swiper, SwiperSlide } from "swiper/svelte"
    import { Mousewheel, Keyboard } from "swiper"
    import "swiper/css"
    import Counter from "../Stuff/Counter"
    import { cubicInOut } from "svelte/easing"

    let bookShelf = new Array<Booklet>()
    let itemBuffer = new Array<THREE.Object3D<THREE.Event>>()
    let counterBuffer: THREE.Object3D<THREE.Event>[] = []
    let scrollers: number[] = []
    let scrollingBlocks: HTMLElement[] = []
    let stage: CentreStage
    const fineOffset = tweened(0, {
        duration: 4000,
        easing: cubicInOut,
    })
    fineOffset.subscribe((value) => {
        handleSwitch(value)
    })
    const Spacer = 1 / 2

    let figure: Counter

    $: innerWidth = window.innerWidth
    $: innerHeight = window.innerHeight

    $: outtaScale = counterBuffer
        .filter((x, i) => i % 3 === 1)
        .map((entry, index) =>
            Math.max(0, 1 - scrollers[index] / (innerHeight / 20))
        )

    function handleSwitch(number: number) {
        bookShelf.map((book, index) => {
            book.book.translateX(
                -(number - index) * innerWidth * Spacer - book.book.position.x
            )
            book.tape.translateX(
                -(number - index) * innerWidth * Spacer - book.tape.position.x
            )
            counterBuffer
                .slice(index * 3, index * 3 + 3)
                .map((entry, entryIndex) =>
                    entry.translateX(
                        -(number - index) * innerWidth * Spacer +
                            ((entryIndex - 1) * innerWidth) / 15 -
                            entry.position.x
                    )
                )
        })
        stage?.render()
    }

    function handleScroll(index: number) {
        bookShelf[index].tape.translateY(
            -10 + scrollers[index] / 3 - bookShelf[index].tape.position.y
        )
        bookShelf[index].book.rotateX(
            ((scrollers[index] / 8 - 40) * Math.PI) / 360 -
                bookShelf[index].book.rotation.x
        )
        bookShelf[index].book.translateY(
            -Math.max(-scrollers[index] / 3.5 - 5, -innerHeight / 20 + 5) -
                bookShelf[index].book.position.y
        )
        bookShelf[index].book.scale.x =
            bookShelf[index].book.scale.y =
            bookShelf[index].book.scale.z =
                Math.max(1 - scrollers[index] / (innerHeight / 3.5), 0.5)

        counterBuffer
            .filter((x, i) => i % 3 === 1)
            [index].scale.set(outtaScale[index], outtaScale[index], 1)

        stage?.render()
    }

    onMount(() => {
        fetchBook("/gist/StevenRCE0/a68460422937f182bc591788fa30e930/raw").then(
            (books) => {
                books.map((bookInformation, bookIndex) => {
                    const newBook = new Booklet(bookInformation)
                    scrollers.push(0)
                    figure = new Counter(books.length, bookIndex + 1)
                    bookShelf = [...bookShelf, newBook]
                    itemBuffer = [...itemBuffer, newBook.book, newBook.tape]
                    counterBuffer = [
                        ...counterBuffer,
                        figure.digitCurrent,
                        figure.outOf,
                        figure.digitTotal,
                    ]
                    newBook.book.rotateX(
                        (-40 * Math.PI) / 360 - newBook.book.rotation.x
                    )
                    newBook.book.translateOnAxis(new Vector3(0, 15, -5), 1)
                    newBook.tape.translateZ(-20)
                    figure.digitCurrent.translateX(
                        bookIndex * innerWidth * Spacer
                    )
                    figure.digitTotal.translateX(
                        bookIndex * innerWidth * Spacer
                    )
                    figure.outOf.translateX(bookIndex * innerWidth * Spacer)

                    figure.digitCurrent.translateX(-innerWidth / 15)
                    figure.digitCurrent.translateY(innerHeight / 15)
                    figure.digitCurrent.translateZ(-75)
                    figure.digitTotal.translateX(innerWidth / 15)
                    figure.digitTotal.translateY(innerHeight / 15)
                    figure.digitTotal.translateZ(-75)
                    figure.outOf.translateY(innerHeight / 12)
                    figure.outOf.translateZ(-115)
                    newBook.book.translateX(bookIndex * innerWidth * Spacer)
                    newBook.tape.translateX(bookIndex * innerWidth * Spacer)
                    newBook.coverLoaded.then(() => stage.deepRender())
                })
            }
        )
    })
</script>

<title>Bookshelf</title>
<div
    use:watchResize={() => {
        // book.resize()
        stage.deepRender()
    }}
>
    <CentreStage
        objects={[...itemBuffer, ...counterBuffer]}
        bind:this={stage}
    />
</div>
<Swiper
    spaceBetween={0}
    slidesPerView={1}
    shortSwipes={true}
    mousewheel={{ forceToAxis: true, thresholdDelta: 20 }}
    keyboard={{ enabled: true }}
    modules={[Mousewheel, Keyboard]}
    style="width: 100vw;"
    on:slideChange={(e) => {
        console.log(e.detail[0][0].activeIndex)
        fineOffset.set(e.detail[0][0].activeIndex)
    }}
>
    {#each bookShelf as book, i}
        <SwiperSlide>
            <div
                class="tall"
                id={`book-${i}`}
                bind:this={scrollingBlocks[i]}
                on:scroll={(e) => {
                    // @ts-ignore
                    scrollers[i] = e.target.scrollTop
                    handleScroll(i)
                }}
            >
                <div style="height: 150vh;" bind:this={scrollingBlocks[i]} />
            </div>
        </SwiperSlide>
    {/each}
</Swiper>

<style>
    .tall {
        height: 100vh;
        overflow-y: scroll;
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
    }
    .tall::-webkit-scrollbar {
        display: none;
    }
</style>
