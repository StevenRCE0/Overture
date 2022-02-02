<script lang="ts">
    import CentreStage from "../Views/CentreStage.svelte"
    import Booklet from "../Stuff/Booklet"
    import { fetchBook } from "../workers/gistParser"
    import { Vector3 } from "three"
    import { watchResize } from "svelte-watch-resize"
    import { onDestroy, onMount } from "svelte"
    import { Swiper, SwiperSlide } from "swiper/svelte"
    import { Mousewheel, Keyboard } from "swiper"
    import "swiper/css"
    import Counter from "../Stuff/Counter"

    let bookShelf = new Array<Booklet>()
    let itemBuffer = new Array<THREE.Object3D<THREE.Event>>()
    let counterBuffer: { [index: string]: THREE.Object3D<THREE.Event> }[] = []
    let scrollers: number[] = []
    let scrollingBlocks: HTMLElement[] = []
    let previousScrollingState: number
    let stage: CentreStage
    const Spacer = 1 / 2

    let figure: Counter
    let currentIndex = 0

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
    $: outtaScale = Math.max(
        0,
        1 - scrollers[currentIndex] / (innerHeight / 20)
    )
    $: figure?.outOf.scale.set(outtaScale, outtaScale, 1)

    function handleSwitch() {
        const value = scrollingBlocks.map(
            (entry) => entry.getBoundingClientRect().left / innerWidth
        )

        if (
            !scrollingBlocks[0] ||
            previousScrollingState === value[0] ||
            Math.abs(previousScrollingState - value[0]) > 0.5
        )
            return

        previousScrollingState = value[0]
        console.log(value)

        bookShelf.map((book, index) => {
            book.book.translateX(
                value[index] * window.innerWidth * Spacer - book.book.position.x
            )
            book.tape.translateX(
                value[index] * window.innerWidth * Spacer - book.tape.position.x
            )
        })
        stage.render()
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
        stage.render()
    }

    let interval: NodeJS.Timer
    function handleLoop(flick: Boolean) {
        if (!flick) {
            clearInterval(interval)
            return
        }
        interval = setInterval(() => {
            handleSwitch()
        }, 1000 / 60)
    }

    onMount(() => {
        fetchBook("/gist/StevenRCE0/a68460422937f182bc591788fa30e930/raw").then(
            (books) => {
                books.map((bookInformation, bookIndex) => {
                    const newBook = new Booklet(bookInformation)
                    scrollers.push(0)
                    figure = new Counter(books.length, currentIndex + 1)
                    bookShelf = [...bookShelf, newBook]
                    itemBuffer = [...itemBuffer, newBook.book, newBook.tape]
                    counterBuffer = [
                        ...counterBuffer,
                        {
                            current: figure.digitCurrent,
                            total: figure.digitTotal,
                            outOf: figure.outOf,
                        },
                    ]
                    newBook.book.rotateX(
                        (-40 * Math.PI) / 360 - newBook.book.rotation.x
                    )
                    newBook.book.translateOnAxis(new Vector3(0, 15, -5), 1)
                    newBook.tape.translateZ(-20)
                    newBook.book.translateX(bookIndex * innerWidth * Spacer)
                    newBook.tape.translateX(bookIndex * innerWidth * Spacer)
                    newBook.coverLoaded.then(() => stage.deepRender())
                })
                handleLoop(true)
            }
        )
    })
    onDestroy(() => {
        clearInterval(interval)
    })
</script>

<title>Bookshelf</title>
<div
    use:watchResize={() => {
        // book.resize()
        stage.deepRender()
    }}
>
    <CentreStage objects={[...itemBuffer]} bind:this={stage} resizeHandled />
</div>
<Swiper
    spaceBetween={0}
    slidesPerView={1}
    shortSwipes={true}
    mousewheel={{ forceToAxis: true, sensitivity: 0.1 }}
    keyboard={{ enabled: true }}
    modules={[Mousewheel, Keyboard]}
    style="width: 100vw;"
>
    {#each bookShelf as book, i}
        <SwiperSlide>
            <div
                style="height: 100vh; overflow-y: scroll;"
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
