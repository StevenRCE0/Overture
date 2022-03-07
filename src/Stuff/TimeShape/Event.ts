import * as THREE from "three"

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

export default class TimeEvent {
    properties: EventSource
    geometry: THREE.Object3D<THREE.Event>


    shapeFormation = (params: ShapeFormationProps) => {
        const baseShape = new THREE.Shape()

        const thicknessBase = params.urgency
        const thicknessPedal = params.urgency / 2
        const height = params.importance
        const offset = params.revelance * height
        const alphaAngle = (clamp(params.preference, 0, 1) + 1) * Math.PI / 3

        baseShape.moveTo(-thicknessBase / 2, 0)
        baseShape.bezierCurveTo(-params.urgency, params.importance / 2, -params.urgency / 2, params.importance, 0, params.importance)
        baseShape.bezierCurveTo(params.urgency / 2, params.importance, params.urgency, params.importance / 2, params.urgency, 0)
        baseShape.bezierCurveTo(params.urgency, -params.importance / 2, params.urgency / 2, -params.importance, 0, -params.importance)
        baseShape.bezierCurveTo(-params.urgency / 2, -params.importance, -params.urgency, -params.importance / 2, -params.urgency, 0)
        const baseMaterial = new THREE.MeshStandardMaterial({color: 0xffffff, roughness: 0.5, metalness: 0.2})
        const vessel = new THREE.ExtrudeGeometry(baseShape, {
            steps: 1,
            bevelEnabled: false,
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
            revelance: properties.revelance??0.5,
            preference: properties.preference??0.5
        })
    }
}