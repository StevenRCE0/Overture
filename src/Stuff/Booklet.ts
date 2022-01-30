import * as THREE from "three"
import { multiLineTitle, toTitleCase, wrapText } from "../workers/textProcess"

// Use 360 * 566 for the size of the cover image
interface BookletProps {
    cover?: string
    colour?: THREE.ColorRepresentation
    title?: string
    author?: string
    comment?: string
}

class BookLet {
    preferences: BookletProps
    loaded = false
    book: THREE.Object3D
    tape: THREE.Object3D
    coverLoaded = new Promise((resolve) => {
        setInterval(() => {
            if (this.loaded) {
                resolve(true)
            }
        }, 50)
    })

    constructor(preferences?: BookletProps) {
        let presetProps = {
            cover: "/sf/why.jpg",
            colour: "0xe3e3e3",
            title: "Tape title TO test",
            author: "Me",
            comment:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Turpis egestas pretium aenean pharetra. Orci eu lobortis elementum nibh tellus molestie. Vulputate dignissim suspendisse in est. Vel pharetra vel turpis nunc. Malesuada nunc vel risus commodo. Nisi vitae suscipit tellus mauris. Posuere morbi leo urna molestie at elementum eu. Urna duis convallis convallis tellus. Urna molestie at elementum eu. Nunc sed blandit libero volutpat.",
        }
        Object.assign(presetProps, preferences)
        this.preferences = presetProps

        const heroPrint = new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load(
                this.preferences.cover,
                () => {
                    console.log("loaded")
                    this.loaded = true
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

        const tapeDimensions = {
            width: 100,
            height: 500,
            margin: ratioPixels(0.6),
            titleSize: ratioPixels(8),
            titleLineHeight: ratioPixels(12),
            commentSize: ratioPixels(3),
            commentLineHeight: ratioPixels(6),
        }
        function ratioPixels(given: number): number {
            return given * window.devicePixelRatio * 5
        }
        const tapeText = document.createElement("canvas")
        const glyphs = tapeText.getContext("2d")
        let writerOffset = ratioPixels(38)

        tapeText.width = ratioPixels(tapeDimensions.width)
        tapeText.height = ratioPixels(tapeDimensions.height)
        glyphs.fillStyle = "white"
        glyphs.fillRect(0, 0, tapeText.width, tapeText.height)
        glyphs.font = `bold ${tapeDimensions.titleSize}pt 'Times New Roman'`
        glyphs.fillStyle = "black"
        glyphs.textAlign = "center"

        writerOffset +=
            wrapText(
                glyphs,
                toTitleCase(this.preferences.title),
                ratioPixels(tapeDimensions.width) / 2,
                writerOffset,
                ratioPixels(tapeDimensions.width) - tapeDimensions.margin * 2,
                tapeDimensions.titleLineHeight
            ) * tapeDimensions.titleLineHeight

        glyphs.font = `normal ${tapeDimensions.commentSize}pt 'Times New Roman'`
        glyphs.fillStyle = "black"
        glyphs.textAlign = "left"
        console.log(writerOffset)

        writerOffset +=
            wrapText(
                glyphs,
                this.preferences.comment,
                ratioPixels(tapeDimensions.margin),
                writerOffset,
                ratioPixels(tapeDimensions.width) - tapeDimensions.margin * 10,
                tapeDimensions.commentLineHeight
            ) * tapeDimensions.commentLineHeight

        const tapeTextTexture = new THREE.Texture(tapeText)
        tapeTextTexture.needsUpdate = true

        const tapeGeometry = new THREE.BoxBufferGeometry(
            tapeDimensions.width,
            tapeDimensions.height,
            1
        )
        tapeGeometry.translate(0, -tapeDimensions.height / 2, -10)
        const tapeMesh = new THREE.Mesh(
            tapeGeometry,
            new THREE.MeshStandardMaterial({
                map: tapeTextTexture,
            })
        )
        tapeMesh.castShadow = true
        tapeMesh.receiveShadow = true
        tapeMesh.matrixAutoUpdate = true
        this.tape = tapeMesh
    }
}

export default BookLet
