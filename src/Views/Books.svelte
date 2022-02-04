<script lang="ts">
    import { fade } from "svelte/transition"
    import { fade } from "svelte/transition"
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
    import "../../public/sourceFont.css"

    let loading = true
    let bookShelf = new Array<Booklet>()
    let itemBuffer = new Array<THREE.Object3D<THREE.Event>>()
    let counterBuffer: THREE.Object3D<THREE.Event>[] = []
    let scrollers: number[] = []
    let scrollingBlocks: HTMLElement[] = []
    let stage: CentreStage
    let index: number
    const fineOffset = tweened(0, {
        duration: 2000,
        easing: cubicInOut,
    })
    fineOffset.subscribe((value) => {
        handleSwitch(value)
    })
    const Spacer = 1 / 4

    let figure: Counter

    $: innerWidth = window.innerWidth
    $: innerHeight = window.innerHeight

    $: outtaScale = counterBuffer
        .filter((x, i) => i % 3 === 1)
        .map((entry, index) =>
            Math.max(0, 1 - scrollers[index] / (innerHeight / 20))
        )

    function clamp(value: number, min: number, max: number) {
        return Math.max(min, Math.min(max, value))
    }

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
                            (entryIndex - 1) * 30 -
                            entry.position.x
                    )
                )
        })
        stage?.render()
    }

    function handleScroll(index: number) {
        bookShelf[index].tape.translateY(
            scrollers[index] / 3 - bookShelf[index].tape.position.y
        )
        bookShelf[index].book.rotateX(
            ((scrollers[index] / 8 - 40) * Math.PI) / 360 -
                bookShelf[index].book.rotation.x
        )
        bookShelf[index].book.translateY(
            -clamp(-scrollers[index] / 3.5 - 5, -50, -12.5) -
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
                    newBook.book.translateY(15)
                    newBook.book.translateZ(-5)
                    newBook.tape.translateZ(-20)
                    figure.digitCurrent.translateX(
                        bookIndex * innerWidth * Spacer
                    )
                    figure.digitTotal.translateX(
                        bookIndex * innerWidth * Spacer
                    )
                    figure.outOf.translateX(bookIndex * innerWidth * Spacer)

                    figure.digitCurrent.translateX(-30)
                    figure.digitCurrent.translateY(75)
                    figure.digitCurrent.translateZ(-75)
                    figure.digitTotal.translateX(30)
                    figure.digitTotal.translateY(75)
                    figure.digitTotal.translateZ(-75)
                    figure.outOf.translateY(90)
                    figure.outOf.translateZ(-115)
                    newBook.book.translateX(bookIndex * innerWidth * Spacer)
                    newBook.tape.translateX(bookIndex * innerWidth * Spacer)
                    newBook.coverLoaded.then(() => stage.deepRender())
                })
                stage?.render()
                loading = false
            }
        )
    })
</script>

<title>Bookshelf</title>
<main>
    {#if loading}
        <div id="LoadingPlaceholder" in:fade out:fade>
            Loading
            <br />
            <span style="font-size: 23pt;">Swipe to go for the next book</span>
        </div>
    {/if}
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
            fineOffset.set(e.detail[0][0].activeIndex)
            index = e.detail[0][0].activeIndex
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
                    <div
                        style="height: 150vh;"
                        bind:this={scrollingBlocks[i]}
                    />
                </div>
            </SwiperSlide>
        {/each}
    </Swiper>
</main>

<style>
    main {
        position: fixed;
        height: 0;
        width: 0;
        overflow: visible;
    }
    .tall {
        height: 100vh;
        overflow-y: scroll;
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
    }
    .tall::-webkit-scrollbar {
        display: none;
    }
    #LoadingPlaceholder {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 33pt;
        font-weight: lighter;
        text-align: center;
        color: #666;
        z-index: 1;
    }
</style>
