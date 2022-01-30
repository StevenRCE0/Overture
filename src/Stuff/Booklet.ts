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
    cover: string
    colour: string
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

    constructor(preferences: BookletProps) {
        let props = {
            cover: "/sf/why.jpg",
            colour: "0xe3e3e3",
            title: "Tape title TO test",
            author: "Me",
            comment: "I don't know",
        }
        Object.assign(props, preferences)
        this.cover = props.cover
        this.colour = props.colour

        const heroPrint = new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load(
                this.cover,
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
            color: this.colour,
            shininess: 20,
        })
        const bookletPaperArticle = new THREE.MeshStandardMaterial({
            color: 0xeeeedf,
            roughness: 0.7,
        })
        const tapePaper = new THREE.MeshStandardMaterial({
            color: 0xfffef9,
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
            width: 120,
            height: 300,
            titleMargin: ratioPixels(4),
            titleSize: ratioPixels(8),
            titleLineHeight: ratioPixels(12),
        }
        function ratioPixels(given: number): number {
            return given * window.devicePixelRatio * 10
        }
        const tapeText = document.createElement("canvas")
        const glyphs = tapeText.getContext("2d")
        tapeText.width = ratioPixels(tapeDimensions.width)
        tapeText.height = ratioPixels(tapeDimensions.height)
        glyphs.fillStyle = "white"
        glyphs.fillRect(0, 0, tapeText.width, tapeText.height)
        glyphs.font = `bold ${tapeDimensions.titleSize}pt 'Times New Roman'`
        glyphs.fillStyle = "black"
        glyphs.textAlign = "center"
        wrapText(
            glyphs,
            toTitleCase(props.title),
            ratioPixels(tapeDimensions.width) / 2,
            ratioPixels(38),
            ratioPixels(tapeDimensions.width) - (tapeDimensions.titleMargin * 2),
            tapeDimensions.titleLineHeight
        )
        console.log(
            props.title,
            ratioPixels(tapeDimensions.width) - 2 * tapeDimensions.titleMargin,
            tapeDimensions.titleSize
        )

        const tapeTextTexture = new THREE.Texture(tapeText)
        tapeTextTexture.needsUpdate = true

        const tapeGeometry = new THREE.BoxBufferGeometry(
            tapeDimensions.width,
            tapeDimensions.height,
            1
        )
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
