// @ts-ignore
import * as THREE from "three"
import TimeEvent from "./Event"
import type { EventSource } from "./Event"

interface SpaceProperties {
    events: THREE.Object3D<THREE.Event>[]
    axis: THREE.Vector3
}

export default class Space {
    properties: SpaceProperties
    eventShapes: THREE.Object3D<THREE.Event>[]

    shapeFormation = (params: EventSource[]) => {
        return params.map(entry => {
            const eventShape = new TimeEvent(entry)
            return 0
        })
    }

    spaceCompliance = (events: SpaceProperties) => {

    }

    constructor(parameters: SpaceProperties) {
        this.properties = parameters
    }
}