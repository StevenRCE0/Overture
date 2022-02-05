import * as THREE from "three"
import { ratioPixels } from "./Booklet"

export default class Counter {
    total: number
    current: number
    digitTotal: THREE.Object3D<THREE.Event>
    digitCurrent: THREE.Object3D<THREE.Event>
    outOf: THREE.Object3D<THREE.Event>

    dimensions = {
        width: 99,
        height: 99,
    }

    makeTextTexture(text: string, fill: string = "white", multiplier = 1) {
        const currentFigureText = document.createElement("canvas")
        const glyphs = currentFigureText.getContext("2d")

        currentFigureText.width =
            ratioPixels(this.dimensions.width) * multiplier
        currentFigureText.height =
            ratioPixels(this.dimensions.height) * multiplier
        glyphs.fillStyle = "black"
        glyphs.fillRect(0, 0, currentFigureText.width, currentFigureText.height)

        glyphs.font = `bold ${this.dimensions.width * multiplier}pt 'Cochin'`

        glyphs.fillStyle = fill
        glyphs.textAlign = "center"
        glyphs.fillText(
            text,
            currentFigureText.width / 2,
            currentFigureText.height / 2
        )

        const tapeTextTexture = new THREE.Texture(currentFigureText)
        tapeTextTexture.needsUpdate = true

        return tapeTextTexture
    }

    constructor(total: number, current: number, multiplier?: number) {
        this.total = total
        this.current = current

        const totalTexture = this.makeTextTexture(
            this.total.toString(),
            "white",
            multiplier
        )
        const currentTexture = this.makeTextTexture(
            this.current.toString(),
            "white",
            multiplier
        )
        const outOfTexture = this.makeTextTexture(
            "out of",
            "#777",
            multiplier * 0.8
        )

        const figureGeometry = new THREE.PlaneGeometry(
            this.dimensions.width,
            this.dimensions.height
        )

        this.digitTotal = new THREE.Mesh(
            figureGeometry,
            new THREE.MeshBasicMaterial({
                alphaMap: totalTexture,
                transparent: true,
                color: "black",
            })
        )
        this.digitCurrent = new THREE.Mesh(
            figureGeometry,
            new THREE.MeshBasicMaterial({
                alphaMap: currentTexture,
                transparent: true,
                color: "black",
            })
        )
        this.outOf = new THREE.Mesh(
            figureGeometry,
            new THREE.MeshBasicMaterial({
                alphaMap: outOfTexture,
                transparent: true,
                color: "black",
            })
        )
    }
}
