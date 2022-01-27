<script lang="ts">
    import { watchResize } from "svelte-watch-resize"

    import {
        Canvas,
        Scene,
        PerspectiveCamera,
        DirectionalLight,
        AmbientLight,
        BoxBufferGeometry,
        Mesh,
        MeshStandardMaterial,
        WebGLRenderer,
        SphereGeometry,
    } from "svelthree" // or from "https://unpkg.com/svelthree@latest/dist/svelthree.mjs" in REPL
    let cubeGeometry = new BoxBufferGeometry(1, 1, 1)
    let cubeMaterial = new MeshStandardMaterial()
    let frameDimensions = {
        x: window.innerWidth,
        y: window.innerHeight,
    }
    function reDoAssign(node: HTMLElement) {
        frameDimensions = {
            x: node.clientWidth,
            y: node.clientHeight,
        }
    }
</script>

<main use:watchResize={reDoAssign}>
    <Canvas let:sti w={frameDimensions.x} h={frameDimensions.y}>
        <Scene {sti} let:scene id="scene1" props={{ background: 0xedf2f7 }}>
            <PerspectiveCamera
                {scene}
                id="cam1"
                pos={[0, 0, 3]}
                lookAt={[0, 0, 0]}
            />
            <AmbientLight {scene} intensity={1.25} />
            <DirectionalLight {scene} pos={[3, 3, 3]} />

            <Mesh
                {scene}
                geometry={new SphereGeometry(1, 99, 99)}
                material={cubeMaterial}
                mat={{ roughness: 0.5, metalness: 0.5, color: 0x66ccff }}
                pos={[0, 0, 0]}
                rot={[0.5, 0.6, 0]}
                scale={[1, 1, 1]}
            />
        </Scene>

        <WebGLRenderer
            {sti}
            sceneId="scene1"
            camId="cam1"
            config={{ antialias: true, alpha: false }}
        />
    </Canvas>
</main>

<style>
    main {
        width: 100vw;
        height: 100vh;
    }
</style>
