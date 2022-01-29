<script lang="ts">
    import * as THREE from "three"
    import { onMount } from "svelte"
    import { watchResize } from "svelte-watch-resize"

    export let objects: THREE.Object3D[] = []

    let anchor: HTMLElement
    export let spotlightLevers: { [index: string]: number } = {
        x: 0,
        y: -2,
        z: 10,
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    const camera = new THREE.PerspectiveCamera()
    camera.translateOnAxis(new THREE.Vector3(0, 0, 1), 100)
    camera.fov = 90
    camera.near = 1
    camera.far = 500
    const regulatedTranslation = 100
    const scene = new THREE.Scene()

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)

    function render() {
        console.log(spotlightLevers)
        const Spotlight = new THREE.SpotLight(0xffffff, 0.5)

        Spotlight.translateOnAxis(
            new THREE.Vector3(spotlightLevers.x, spotlightLevers.y, spotlightLevers.z),
            20
        )
        Spotlight.decay = 0.5
        Spotlight.castShadow = true
        Spotlight.angle = Math.PI / 2

        const wallBack = new THREE.PlaneGeometry(
            window.innerWidth,
            window.innerHeight / 1.5
        )
        const leftWall = wallBack.clone()
        const rightWall = wallBack.clone()
        const floor = wallBack.clone()
        const ceiling = wallBack.clone()
        leftWall.rotateY(Math.PI / 2)
        rightWall.rotateY(-Math.PI / 2)
        floor.rotateX(-Math.PI / 2)
        ceiling.rotateX(Math.PI / 2)
        leftWall.translate(-window.innerWidth / 3, 0, -regulatedTranslation)
        rightWall.translate(window.innerWidth / 3, 0, -regulatedTranslation)
        floor.translate(0, -window.innerHeight / 3, -regulatedTranslation)
        ceiling.translate(0, window.innerHeight / 3, -regulatedTranslation)
        const wallMaterial = new THREE.MeshStandardMaterial({
            metalness: 0,
            roughness: 0.6,
            color: 0xe3e3e3,
        })
        wallBack.translate(
            0,
            0,
            -(Math.min(Math.min(window.innerHeight, window.innerWidth) / 2, camera.far - regulatedTranslation))
        )
        const wallBackMesh = new THREE.Mesh(wallBack, wallMaterial)
        const leftWallMesh = new THREE.Mesh(leftWall, wallMaterial)
        const rightWallMesh = new THREE.Mesh(rightWall, wallMaterial)
        const floorMesh = new THREE.Mesh(floor, wallMaterial)
        const ceilingMesh = new THREE.Mesh(ceiling, wallMaterial)
        camera.aspect = window.innerWidth / window.innerHeight

        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(window.devicePixelRatio)

        camera.updateProjectionMatrix()
        scene.clear()
        scene.add(ambientLight)
        scene.add(Spotlight)
        scene.add(wallBackMesh)
        scene.add(leftWallMesh)
        scene.add(rightWallMesh)
        scene.add(floorMesh)
        scene.add(ceilingMesh)
        for (const object of objects) {
            scene.add(object)
        }
        renderer.render(scene, camera)
    }

    function handleResize(node: HTMLElement) {
        render()
    }

    onMount(() => {
        anchor.appendChild(renderer.domElement)
        render()
    })
</script>

<div style="display: block; position: fixed; z-index: 999; top: 50px; left: 50px">
    <input
        type="range"
        min="-10"
        max="10"
        step="0.01"
        bind:value={spotlightLevers.x}
        on:change={() => render()}
    />
    <input
        type="range"
        min="-10"
        max="10"
        step="0.01"
        bind:value={spotlightLevers.y}
        on:change={() => render()}
    />
    <input
        type="range"
        min="-10"
        max="10"
        step="0.01"
        bind:value={spotlightLevers.z}
        on:change={() => render()}
    />
</div>
<main bind:this={anchor} use:watchResize={handleResize} />

<style>
    main {
        height: 100vh;
        width: 100vw;
        display: block;
    }
</style>
