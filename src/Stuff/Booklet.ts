import * as THREE from "three"

export let coverHero = "/cc/sf/why.jpg"

const heroPrint = new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load(coverHero, () => {
        console.log("loaded")
        booklet.add(new THREE.Mesh(CoverLayerGeometry, heroPrint))
    }),
    metalness: 0.5,
    roughness: 0.6,
})
const CoverLayerGeometry = new THREE.PlaneGeometry(36, 56.56)
const Cover = new THREE.BoxGeometry(36, 56.56, 1)
const Cover2 = new THREE.BoxGeometry(36, 56.56, 1)
const Papers = new THREE.BoxGeometry(35.6, 56.16, 2)
const segment1 = new THREE.BoxGeometry(2, 56.36, 3.6)
const segment2 = new THREE.BoxGeometry(2, 56.56, 4)
CoverLayerGeometry.translate(0, 0, 2.001)
Cover.translate(0, 0, 1.5)
Cover2.translate(0, 0, -1.5)
Papers.translate(-0.2, 0, 0)
segment1.translate(-19, 0, 0)
segment2.translate(-21, 0, 0)
const bookletPaper = new THREE.MeshStandardMaterial({
    color: 0xe3e3e3,
    roughness: 0.8,
    metalness: 0.2
})
const bookletPaper2 = new THREE.MeshStandardMaterial({
    color: 0xdddddd,
    roughness: 0.8,
    metalness: 0.2
})
const bookletPaperArticle = new THREE.MeshStandardMaterial({
    color: 0xeeeeee,
    roughness: 0.7,
})
const booklet = new THREE.Object3D()
booklet.add(new THREE.Mesh(Cover, bookletPaper))
booklet.add(new THREE.Mesh(segment1, bookletPaper2))
booklet.add(new THREE.Mesh(segment2, bookletPaper))
booklet.add(new THREE.Mesh(Cover2, bookletPaper2))
booklet.add(new THREE.Mesh(Papers, bookletPaperArticle))
booklet.matrixAutoUpdate = true
export default booklet
