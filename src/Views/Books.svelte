<script lang="ts">
    import CentreStage from "../Views/CentreStage.svelte"
    import Booklet from "../Stuff/Booklet"
    import Counter from "../Stuff/Counter"
    import { fetchBook } from "../workers/gistParser"
    import { watchResize } from "svelte-watch-resize"
    import { onMount } from "svelte"
    import { cubicInOut } from "svelte/easing"
    import { tweened } from "svelte/motion"
    import { fade } from "svelte/transition"
    import { Swiper, SwiperSlide } from "swiper/svelte"
    import { Mousewheel, Keyboard } from "swiper"
    import "swiper/css"
    import "../../public/sourceFont.css"

    interface BookOnShelf {
        book: THREE.Object3D<THREE.Event>
        tape?: THREE.Object3D<THREE.Event>
    }

    let loading = true
    let bookShelf = new Array<BookOnShelf>()
    let itemBuffer = new Array<THREE.Object3D<THREE.Event>>()
    let counterBuffer: THREE.Object3D<THREE.Event>[] = []
    let scrollers: number[] = []
    let scrollingBlocks: HTMLElement[] = []
    let stage: CentreStage
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

    $: switchAnimationId = undefined

    function handleSwitch(number: number) {
        if (switchAnimationId) cancelAnimationFrame(switchAnimationId) // Cancel any existing animation

        switchAnimationId = requestAnimationFrame(() => {
            bookShelf.map((book, index) => {
                book.book.translateX(
                    -(number - index) * innerWidth * Spacer -
                        book.book.position.x
                )
                book.tape?.translateX(
                    -(number - index) * innerWidth * Spacer -
                        book.tape.position.x
                )
                counterBuffer
                    .slice(index * 3, index * 3 + 3)
                    .map((entry, entryIndex) =>
                        entry.translateX(
                            -(number - index) * innerWidth * Spacer +
                                (entryIndex - 1) *
                                    (2 / window.devicePixelRatio) *
                                    30 -
                                entry.position.x
                        )
                    )
            })
            stage?.render()
        })
    }

    function handleScroll(index: number) {
        requestAnimationFrame(() => {
            bookShelf[index].tape?.translateY(
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
            const applyBookScrollScale = Math.max(
                1 - scrollers[index] / (innerHeight / 3.5),
                0.5
            )
            bookShelf[index].book.scale.set(
                applyBookScrollScale,
                applyBookScrollScale,
                applyBookScrollScale
            )
            stage?.render()
        })
    }

    onMount(() => {
        fetchBook("/gist/StevenRCE0/a68460422937f182bc591788fa30e930/raw").then(
            (books) => {
                books.map(async (bookInformation, bookIndex) => {
                    const newBook = new Booklet(bookInformation)
                    scrollers.push(0)
                    figure = new Counter(books.length, bookIndex + 1, 0.75)
                    bookShelf = [...bookShelf, { book: newBook.book }]
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
                    figure.digitCurrent.translateX(
                        bookIndex * innerWidth * Spacer
                    )
                    figure.digitTotal.translateX(
                        bookIndex * innerWidth * Spacer
                    )
                    figure.outOf.translateX(bookIndex * innerWidth * Spacer)
                    figure.digitCurrent.translateX(
                        (2 / window.devicePixelRatio) * -30
                    )
                    figure.digitCurrent.translateY(
                        40 / window.devicePixelRatio + innerHeight * 0.06
                    )
                    figure.digitCurrent.translateZ(
                        (2 / window.devicePixelRatio) * -75
                    )
                    figure.digitTotal.translateX(
                        (2 / window.devicePixelRatio) * 30
                    )
                    figure.digitTotal.translateY(
                        40 / window.devicePixelRatio + innerHeight * 0.06
                    )
                    figure.digitTotal.translateZ(
                        (2 / window.devicePixelRatio) * -75
                    )
                    figure.outOf.translateY(
                        100 / window.devicePixelRatio + innerHeight * 0.04
                    )
                    figure.outOf.translateZ(
                        (2 / window.devicePixelRatio) * -115
                    )
                    newBook.book.translateX(bookIndex * innerWidth * Spacer)
                    itemBuffer = [...itemBuffer, newBook.book]
                    newBook.coverLoaded.then(() => {
                        stage.deepRender()
                        loading = false
                    })
                    newBook.tape.then((tape) => {
                        tape.translateZ(-20)
                        tape.translateX(bookIndex * innerWidth * Spacer)
                        bookShelf[bookIndex].tape = tape
                        itemBuffer = [...itemBuffer, tape]
                    })
                })
                stage?.render()
            }
        )
    })
</script>

<svelte:head>
    <title>Bookshelf</title>
</svelte:head>
<main>
    {#if loading}
        <div id="LoadingPlaceholder" in:fade out:fade>
            Loading
            <br />
            <span id="SwipeIndicator">Swipe to go for the next book</span>
        </div>
    {/if}
    <div
        id="BookshelfStage"
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
        edgeSwipeDetection={"prevent"}
        mousewheel={{ forceToAxis: true, thresholdDelta: 20 }}
        keyboard={{ enabled: true }}
        modules={[Mousewheel, Keyboard]}
        style="width: 100vw;"
        on:slideChange={(e) => {
            fineOffset.set(e.detail[0].activeIndex)
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
                        style="height: calc(100vh + 500pt);"
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
    #BookshelfStage {
        z-index: 0;
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
    #SwipeIndicator {
        display: block;
        font-size: 23pt;
        animation: SwipeIndication 0.85s cubic-bezier(0.175, 0.885, 0.32, 1.275)
            0.5s forwards;
    }
    @keyframes SwipeIndication {
        0% {
            transform: translateX(0);
        }
        50% {
            transform: translateX(-10px);
        }
        100% {
            transform: translateX(0);
        }
    }
</style>
