import * as THREE from "three"

// Use 360 * 566 for the size of the cover image
export let coverHero = "/cc/sf/why.jpg"
let loaded = false

const heroPrint = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load(coverHero, () => {
        console.log("loaded")
        loaded = true
        booklet.add(coverHeroMesh)
    }),
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
    color: 0xe3e3e3,
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
    new THREE.Mesh(segment2, bookletPaper)
]
for (const mesh of BookletMeshes) {
    mesh.castShadow = true
    booklet.add(mesh)
}

export default booklet
export const coverLoaded = new Promise((resolve) => {
    setInterval(() => {
        if (loaded) {
            resolve(true)
        }
    }, 50)
})
