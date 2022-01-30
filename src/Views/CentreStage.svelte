<script lang="ts">
    import * as THREE from "three"
    import { onMount } from "svelte"
    import { watchResize } from "svelte-watch-resize"

    export let objects: THREE.Object3D[] = []
    export let clear = false

    let anchor: HTMLElement
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
    scene.fog = new THREE.Fog(0xffffff, 20, 1000)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65)
    const Spotlight = new THREE.SpotLight(0xffffff, 0.15, 0, Math.PI / 4, 0.1, 4)
    const DirectionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
    DirectionalLight.position.set(10, 0, 50)
    DirectionalLight.rotateY(Math.PI / 3)
    Spotlight.translateOnAxis(
        new THREE.Vector3(
            spotlightLevers.x,
            spotlightLevers.y,
            spotlightLevers.z
        ),
        20
    )
    Spotlight.castShadow = true
    Spotlight.shadow.radius = 8
    Spotlight.shadow.mapSize.width = 2048
    Spotlight.shadow.mapSize.height = 2048
    Spotlight.shadow.camera.near = 0.5
    Spotlight.shadow.camera.far = 5000
    Spotlight.angle = Math.PI / 4

    const wallMaterial = new THREE.MeshStandardMaterial({
        metalness: 0,
        roughness: 0.6,
        color: 0xe3e3e3,
    })
    const wallBack = new THREE.PlaneGeometry(
        window.innerWidth,
        window.innerHeight / 1.5
    )
    const floor = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight)
    const ceiling = floor.clone()
    const leftWall = wallBack.clone()
    const rightWall = wallBack.clone()
    leftWall.rotateY(Math.PI / 2)
    rightWall.rotateY(-Math.PI / 2)
    floor.rotateX(-Math.PI / 2)
    ceiling.rotateX(Math.PI / 2)
    leftWall.translate(-window.innerWidth / 3, 0, -regulatedTranslation)
    rightWall.translate(window.innerWidth / 3, 0, -regulatedTranslation)
    floor.translate(0, -window.innerHeight / 3, -regulatedTranslation)
    ceiling.translate(0, window.innerHeight / 3, -regulatedTranslation)
    wallBack.translate(
        0,
        0,
        -Math.min(
            Math.min(window.innerHeight, window.innerWidth) / 2,
            camera.far - regulatedTranslation
        )
    )
    const wallBackMesh = new THREE.Mesh(wallBack, wallMaterial)
    wallBackMesh.receiveShadow = true
    const leftWallMesh = new THREE.Mesh(leftWall, wallMaterial)
    leftWallMesh.receiveShadow = true
    const rightWallMesh = new THREE.Mesh(rightWall, wallMaterial)
    rightWallMesh.receiveShadow = true
    const floorMesh = new THREE.Mesh(floor, wallMaterial)
    floorMesh.receiveShadow = true
    const ceilingMesh = new THREE.Mesh(ceiling, wallMaterial)
    ceilingMesh.receiveShadow = true

    export function render() {
        camera.aspect = window.innerWidth / window.innerHeight
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(window.devicePixelRatio)
        camera.updateProjectionMatrix()

        scene.autoUpdate = true
        renderer.render(scene, camera)
    }

    function handleResize(node: HTMLElement) {
        render()
    }

    onMount(() => {
        anchor.appendChild(renderer.domElement)
        scene.add(ambientLight)
        scene.add(Spotlight)
        scene.add(DirectionalLight)
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
        render()
    })
</script>

<main bind:this={anchor} use:watchResize={handleResize} />

<style>
    main {
        position: fixed;
        overflow: hidden;
        height: 100vh;
        width: 100vw;
    }
</style>
