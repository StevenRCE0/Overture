<script lang="ts">
    import * as THREE from "three"
    import { onMount, onDestroy } from "svelte"
    import { watchResize } from "svelte-watch-resize"

    export let objects: THREE.Object3D[] = []
    export let clear = false
    export let resizeHandled = false

    let night = window.matchMedia("(prefers-color-scheme: dark)").matches
    const changeAppearance = () => {
        night = window.matchMedia("(prefers-color-scheme: dark)").matches
        tuneLight()
        deepRender()
    }
    window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", changeAppearance)

    let anchor: HTMLElement
    let innerWidth: number
    let innerHeight: number
    export let spotlightLevers: { [index: string]: number } = {
        x: 0,
        y: 0.6,
        z: 3,
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.shadowMap.enabled = true
    const camera = new THREE.PerspectiveCamera()
    camera.translateOnAxis(new THREE.Vector3(0, 0, 1), 100)
    camera.fov = 60
    camera.near = 1
    camera.far = 2000

    const regulatedTranslation = 100
    const scene = new THREE.Scene()

    let ambientLight: THREE.AmbientLight
    let Spotlight: THREE.SpotLight
    let directionalLight: THREE.DirectionalLight

    function tuneLight() {
        spotlightLevers.y = night ? 0.2 : 0.6
        scene.fog = night
            ? new THREE.Fog(0x000000, 20, 1000)
            : new THREE.Fog(0xffffff, 20, 1000)
        ambientLight = new THREE.AmbientLight(0xffffff, night ? 0.1 : 0.65)
        Spotlight = new THREE.SpotLight(
            0xffffff,
            night ? 0.5 : 0.15,
            0,
            Math.PI / (night ? 8 : 4),
            0.1,
            4
        )
        Spotlight.translateOnAxis(
            new THREE.Vector3(
                spotlightLevers.x,
                spotlightLevers.y,
                spotlightLevers.z
            ),
            20
        )
        directionalLight = new THREE.DirectionalLight(0xffffff, night ? 0 : 0.2)
        directionalLight.position.set(10, 0, 50)
        directionalLight.rotateY(Math.PI / 3)

        Spotlight.castShadow = true
        Spotlight.shadow.radius = 8
        Spotlight.shadow.mapSize.width = 2048
        Spotlight.shadow.mapSize.height = 2048
        Spotlight.shadow.camera.near = 0.5
        Spotlight.shadow.camera.far = 5000
        Spotlight.angle = Math.PI / 4
    }
    tuneLight()

    const wallMaterial = new THREE.MeshStandardMaterial({
        metalness: 0,
        roughness: 0.6,
        color: 0xe3e3e3,
    })

    let wallBack: THREE.BufferGeometry
    let floor: THREE.BufferGeometry
    let ceiling: THREE.BufferGeometry
    let leftWall: THREE.BufferGeometry
    let rightWall: THREE.BufferGeometry

    let wallBackMesh: THREE.Mesh
    let floorMesh: THREE.Mesh
    let ceilingMesh: THREE.Mesh
    let leftWallMesh: THREE.Mesh
    let rightWallMesh: THREE.Mesh

    function assignSizes() {
        wallBack = new THREE.PlaneGeometry(innerWidth, innerHeight / 1.5)
        floor = new THREE.PlaneGeometry(innerWidth, innerHeight)
        ceiling = floor.clone()
        leftWall = wallBack.clone()
        rightWall = wallBack.clone()

        leftWall.rotateY(Math.PI / 2)
        rightWall.rotateY(-Math.PI / 2)
        floor.rotateX(-Math.PI / 2)
        ceiling.rotateX(Math.PI / 2)
        leftWall.translate(-innerWidth / 3, 0, -regulatedTranslation)
        rightWall.translate(innerWidth / 3, 0, -regulatedTranslation)
        floor.translate(0, -innerHeight / 3, -regulatedTranslation)
        ceiling.translate(0, innerHeight / 3, -regulatedTranslation)
        wallBack.translate(
            0,
            0,
            -Math.min(
                Math.min(innerHeight, innerWidth) / 2,
                camera.far - regulatedTranslation
            )
        )

        wallBackMesh = new THREE.Mesh(wallBack, wallMaterial)
        wallBackMesh.receiveShadow = true
        floorMesh = new THREE.Mesh(floor, wallMaterial)
        floorMesh.receiveShadow = true
        ceilingMesh = new THREE.Mesh(ceiling, wallMaterial)
        ceilingMesh.receiveShadow = true
        leftWallMesh = new THREE.Mesh(leftWall, wallMaterial)
        leftWallMesh.receiveShadow = true
        rightWallMesh = new THREE.Mesh(rightWall, wallMaterial)
        rightWallMesh.receiveShadow = true
    }

    function mountSet() {
        scene.add(ambientLight)
        scene.add(Spotlight)
        scene.add(directionalLight)
        if (!clear) {
            scene.add(wallBackMesh)
            scene.add(leftWallMesh)
            scene.add(rightWallMesh)
            scene.add(floorMesh)
            scene.add(ceilingMesh)
        }
        for (const object of objects) {
            scene.add(object)
        }
    }

    export function render() {
        camera.aspect = innerWidth / innerHeight
        renderer.setSize(innerWidth, innerHeight)
        renderer.setPixelRatio(window.devicePixelRatio)
        camera.updateProjectionMatrix()

        scene.autoUpdate = true
        renderer.render(scene, camera)
    }

    export function deepRender() {
        scene.clear()
        assignSizes()
        mountSet()
        render()
    }

    onMount(() => {
        anchor.appendChild(renderer.domElement)
        assignSizes()
        mountSet()
        render()
    })

    onDestroy(() => {
        window
            .matchMedia("(prefers-color-scheme: dark)")
            .removeEventListener("change", changeAppearance)
    })
</script>

<main
    bind:this={anchor}
    use:watchResize={() => {
        resizeHandled || deepRender()
    }}
/>
<svelte:window bind:innerWidth bind:innerHeight />

<style>
    main {
        position: fixed;
        overflow: hidden;
        height: 100vh;
        width: 100vw;
    }
</style>
