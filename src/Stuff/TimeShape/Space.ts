// @ts-ignore
import * as THREE from "three"
import type TimeEvent from "./Event"
import type { EventSource } from "./Event"

export interface SpaceProperties {
    events: TimeEvent[]
    axis: THREE.Vector3
}

export default class Space {
    properties: SpaceProperties
    eventShapes: THREE.Object3D<THREE.Event>[]

    spaceCompliance = (events: SpaceProperties) => {}

    constructor(parameters: SpaceProperties) {
        this.properties = parameters
    }
}
