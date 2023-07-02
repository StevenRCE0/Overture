import * as THREE from 'three'

function clamp(min: number, max: number, value: number) {
    return Math.min(Math.max(value, min), max)
}

export interface EventSource {
    eventTitle: string
    eventDescription?: string
    timestamp: number
    importance: number
    urgency: number
    revelance?: number
    preference?: number
    peopleInvolved?: string[]
    extrusions?: {
        span: number
    }[]
}

interface ShapeFormationProps {
    importance: number
    urgency: number
    revelance?: number
    preference?: number
    extrusions?: {
        span: number
    }[]
}

function bendPlaneGeometry(planeGeometry, centerBendZ)
{
    console.log(planeGeometry)
    var curve = new THREE.CubicBezierCurve3(
        planeGeometry.vertices[0],
        new THREE.Vector3(planeGeometry.parameters.width/2, 0, centerBendZ ),
        new THREE.Vector3(planeGeometry.parameters.width/2, 0, centerBendZ ),
        planeGeometry.vertices[(planeGeometry.vertices.length/2) - 1]
    );
    var planePoints = curve.getPoints(Math.abs(planeGeometry.vertices.length/2)-1);
    for(var edgeI = 1; edgeI < 3; edgeI++){
        for(var pointI = 0; pointI < planePoints.length; pointI++){
            planeGeometry.vertices[(edgeI === 2) ? planePoints.length + pointI : pointI].z = planePoints[pointI].z;
        }
    }
    planeGeometry.computeFaceNormals();
    planeGeometry.computeVertexNormals();
    return planeGeometry;
}

function curvedPlaneGeometry(geometry, width = 20, height = 20, radius = 40) {
    const segments = 32
    const segmentsH = segments
    const segmentsV = segments / (width / height) // square
    const geometryR = geometry
    // const geometryR = new THREE.PlaneGeometry(width, height, segmentsH, segmentsV)

    let heightMin = Infinity
    let heightMax = -Infinity

    const distanceMax = Math.sqrt((width / 2) ** 2 + (height / 2) ** 2)
    radius = Math.max(distanceMax, radius)

    const position = geometryR.attributes.position
    for (let i = 0; i < position.count; i++) {
        const x = position.getX(i)
        const y = position.getY(i)

        const distance = Math.sqrt(x * x + y * y)
        const height = Math.sqrt(Math.max(radius ** 2 - distance ** 2, 0))
        heightMin = Math.min(height, heightMin)
        heightMax = Math.max(height, heightMax)
        position.setZ(i, height)
    }

    return geometryR
}

export default class TimeEvent {
    properties: EventSource
    geometry: THREE.Object3D<THREE.Event>

    shapeFormation = (params: ShapeFormationProps) => {
        const thicknessBase = params.urgency
        const thicknessPedal = params.urgency / 2
        const height = params.importance
        const offset = params.revelance * height
        const alphaAngle = ((clamp(params.preference, 0, 1) + 1) * Math.PI) / 3

        // Geometry generation
        const baseShape = new THREE.Shape()

        baseShape.moveTo(-thicknessBase, 0)
        baseShape.bezierCurveTo(
            -params.urgency,
            params.importance / 2,
            -params.urgency / 2,
            params.importance,
            0,
            params.importance
        )
        baseShape.bezierCurveTo(
            params.urgency / 2,
            params.importance,
            params.urgency,
            params.importance / 2,
            params.urgency,
            0
        )
        baseShape.bezierCurveTo(
            params.urgency,
            -params.importance / 2,
            params.urgency / 2,
            -params.importance,
            0,
            -params.importance
        )
        baseShape.bezierCurveTo(
            -params.urgency / 2,
            -params.importance,
            -params.urgency,
            -params.importance / 2,
            -params.urgency,
            0
        )
        baseShape.closePath()

        let vessel = new THREE.ShapeGeometry(baseShape, 64)
        // vessel = curvedPlaneGeometry(vessel)
        // Material generation
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.5,
            metalness: 0.2,
            wireframe: true,
        })

        const vesselMesh = new THREE.Mesh(vessel, baseMaterial)
        vesselMesh.receiveShadow = true
        vesselMesh.castShadow = true
        return vesselMesh
    }

    constructor(properties: EventSource) {
        this.properties = properties
        this.geometry = this.shapeFormation({
            importance: properties.importance,
            urgency: properties.urgency,
            revelance: properties.revelance ?? 0.5,
            preference: properties.preference ?? 0.5,
        })
    }
}