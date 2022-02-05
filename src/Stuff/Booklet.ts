import * as THREE from "three"
import { multiLineTitle, toTitleCase, wrapText } from "../workers/textProcess"
import { Canvg } from "canvg"

// Use 360 * 566 for the size of the cover image
export interface BookletProps {
    cover?: string
    colour?: THREE.ColorRepresentation
    title?: string
    author?: string
    reading?: boolean
    comment?: string
}

export function ratioPixels(given: number): number {
    return given * window.devicePixelRatio * 5
}

class BookLet {
    preferences: BookletProps
    loaded: boolean
    book: THREE.Object3D
    tape: Promise<THREE.Object3D>
    tapeFont = "'Times New Roman', 'Noto Serif SC', Times, serif"
    catLocation = "./readingCat.svg"
    coverLoaded = new Promise((resolve) => {
        setInterval(() => {
            if (this.loaded) {
                resolve(true)
            }
        }, 50)
    })

    tapeDimensions = {
        width: Math.min(100, window.innerWidth / 5),
        height: 300,
        margin: ratioPixels(8),
        titleSize: ratioPixels(8),
        titleLineHeight: ratioPixels(11),
        authorSize: ratioPixels(5),
        authorLineHeight: ratioPixels(9),
        commentSize: ratioPixels(3),
        commentLineHeight: ratioPixels(6),
    }

    resize = () => {
        if (
            Math.min(100, window.innerWidth / 5) !== this.tapeDimensions.width
        ) {
            this.tapeDimensions.width = Math.min(100, window.innerWidth / 5)
            this.printTape()
        }
    }

    printReadingCat = async (
        context: CanvasRenderingContext2D,
        offsetX: number,
        offsetY: number
    ) => {
        const instance = await Canvg.from(context, this.catLocation, {
            offsetX: offsetX,
            offsetY: offsetY,
            ignoreAnimation: true,
            ignoreMouse: true,
            ignoreClear: true,
            ignoreDimensions: true,
        })
        instance.start()
        instance.stop()
    }

    printTape = async () => {
        const tapeText = document.createElement("canvas")
        const glyphs = tapeText.getContext("2d")
        let writerOffset = ratioPixels(38)
        const tapeGeometry = new THREE.BoxBufferGeometry(
            this.tapeDimensions.width,
            this.tapeDimensions.height,
            1
        )

        tapeText.width = ratioPixels(this.tapeDimensions.width)
        tapeText.height = ratioPixels(this.tapeDimensions.height)
        glyphs.fillStyle = "hsl(27, 23%, 96%)"
        glyphs.fillRect(0, 0, tapeText.width, tapeText.height)

        // Printing Title
        glyphs.font = `bold ${this.tapeDimensions.titleSize}pt ${this.tapeFont}`
        glyphs.fillStyle = "black"
        glyphs.textAlign = "center"
        writerOffset +=
            wrapText(
                glyphs,
                toTitleCase(this.preferences.title),
                ratioPixels(this.tapeDimensions.width) / 2,
                writerOffset,
                ratioPixels(this.tapeDimensions.width) -
                    this.tapeDimensions.margin * 2,
                this.tapeDimensions.titleLineHeight
            ) * this.tapeDimensions.titleLineHeight

        // Printing Author
        glyphs.font = `${this.tapeDimensions.authorSize}pt ${this.tapeFont}`
        glyphs.fillStyle = "#666"
        glyphs.textAlign = "center"
        writerOffset +=
            wrapText(
                glyphs,
                this.preferences.author,
                ratioPixels(this.tapeDimensions.width) / 2,
                writerOffset,
                ratioPixels(this.tapeDimensions.width) -
                    this.tapeDimensions.margin * 2,
                this.tapeDimensions.authorLineHeight
            ) *
                this.tapeDimensions.authorLineHeight +
            ratioPixels(3)

        if (this.preferences.reading) {
            // Printing Reading Cat
            glyphs.fillStyle = "#999"
            await this.printReadingCat(
                glyphs,
                0,
                -ratioPixels(this.tapeDimensions.height / 2) +
                    writerOffset +
                    ratioPixels(50)
            )
            glyphs.textAlign = "center"
            glyphs.fillText(
                "I'm reading...",
                ratioPixels(this.tapeDimensions.width) / 2,
                writerOffset + ratioPixels(80)
            )
        } else {
            // Printing Comment
            glyphs.font = `normal ${this.tapeDimensions.commentSize}pt ${this.tapeFont}`
            glyphs.fillStyle = "black"
            glyphs.textAlign = "left"
            writerOffset +=
                wrapText(
                    glyphs,
                    this.preferences.comment,
                    this.tapeDimensions.margin,
                    writerOffset,
                    ratioPixels(this.tapeDimensions.width) -
                        this.tapeDimensions.margin * 2,
                    this.tapeDimensions.commentLineHeight
                ) * this.tapeDimensions.commentLineHeight
        }
        const tapeTextTexture = new THREE.Texture(tapeText)
        tapeTextTexture.needsUpdate = true

        tapeGeometry.translate(0, -this.tapeDimensions.height / 2, -10)
        const tapeMesh = new THREE.Mesh(
            tapeGeometry,
            new THREE.MeshStandardMaterial({
                map: tapeTextTexture,
            })
        )
        tapeMesh.castShadow = true
        tapeMesh.receiveShadow = true
        tapeMesh.matrixAutoUpdate = true

        return tapeMesh
    }

    constructor(preferences: BookletProps) {
        let presetProps = {
            cover: "",
            colour: 0xe3e3e3,
            title: "Tape title test",
            author: "Author",
            comment: "推荐的话语正在等待着被编写……",
        }
        this.preferences = Object.assign(presetProps, preferences)
        if (this.preferences.cover.length === 0 && !this.preferences.reading) {
            this.loaded = true
        }

        const heroPrint = new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load(
                this.preferences.cover,
                () => {
                    this.loaded = this.preferences.reading || true
                    booklet.add(coverHeroMesh)
                },
                () => {},
                (error) => {
                    console.warn(error)
                }
            ),
            shininess: 20,
        })
        const CoverLayerGeometry = new THREE.PlaneGeometry(36, 56.56)
        const Cover = new THREE.BoxGeometry(36, 56.56, 1)
        const Cover2 = new THREE.BoxGeometry(36, 56.56, 1)
        const Papers = new THREE.BoxGeometry(37.6, 56.16, 2)
        const segment1 = new THREE.BoxGeometry(1.2, 56.36, 0.6)
        const segment10 = new THREE.BoxGeometry(1.2, 56.36, 0.6)
        const segment2 = new THREE.BoxGeometry(1, 56.56, 4)
        CoverLayerGeometry.translate(0, 0, 2.01)
        Cover.translate(0, 0, 1.5)
        Cover2.translate(0, 0, -1.5)
        Papers.translate(-1.2, 0, 0)
        segment1.translate(-18.6, 0, 1.3)
        segment10.translate(-18.6, 0, -1.3)
        segment2.translate(-19.6, 0, 0)
        const bookletPaper = new THREE.MeshPhongMaterial({
            color: this.preferences.colour,
            shininess: 20,
        })
        const bookletPaperArticle = new THREE.MeshStandardMaterial({
            color: 0xeeeedf,
            roughness: 0.7,
        })
        const booklet = new THREE.Object3D()
        const coverHeroMesh = new THREE.Mesh(CoverLayerGeometry, heroPrint)
        coverHeroMesh.castShadow = true
        const BookletMeshes = [
            new THREE.Mesh(Papers, bookletPaperArticle),
            new THREE.Mesh(Cover, bookletPaper),
            new THREE.Mesh(Cover2, bookletPaper),
            new THREE.Mesh(segment1, bookletPaper),
            new THREE.Mesh(segment10, bookletPaper),
            new THREE.Mesh(segment2, bookletPaper),
        ]
        for (const mesh of BookletMeshes) {
            mesh.castShadow = true
            booklet.add(mesh)
        }
        this.book = booklet
        this.tape = new Promise((resolve, reject) => {
            resolve(this.printTape())
        })
    }
}

export default BookLet
