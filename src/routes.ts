import type {Route} from 'svelte-router-spa/types/components/router'
import Overture from './Views/Overture.svelte'
import Redirect from './Stuff/Redirect.svelte'
import CentreStage from './Views/CentreStage.svelte'
import Books from './Views/Books.svelte'
import Tests from './Views/Tests.svelte'
import Scrollers from './tests/Scrollers.svelte'
import TimeShape from './Views/TimeShape.svelte'
import MikuPlayer from './Views/MikuPlayer.svelte'
import GetChicken from './Views/GetChicken.svelte'
import FormChicken from './Views/FormChicken.svelte'
import Studio from './Views/Studio.svelte'
import GraphRec from './Views/Works/GraphRec.svelte'

export type RouteRole = 'major' | 'minor'
export type DetailedRoute = Route & {
    type?: RouteRole
    label?: string
    target?: "_blank" | "_self"
}

export const routes: DetailedRoute[] = [
    {
        name: '/',
        component: Redirect,
    },
    {
        name: 'Overture',
        label: 'Overture',
        component: Overture,
        type: 'major',
    },
    {
        name: 'CentreStage',
        component: CentreStage,
    },
    {
        name: 'Books',
        label: 'Books',
        component: Books,
        type: 'major',
    },
    {
        name: 'Scrollers',
        component: Scrollers,
    },
    {
        name: 'Chicken',
        component: GetChicken,
    },
]

export const testRoutes: DetailedRoute[] = [
    {
        name: 'Tests',
        component: Tests,
    },
    {
        name: 'TimeShape',
        component: TimeShape,
    },
    {
        name: 'MikuPlayer',
        component: MikuPlayer,
    },
    {
        name: 'FormChicken',
        component: FormChicken,
    },
    {
        name: 'Studio',
        component: Studio,
    },
    {
        name: 'GR',
        component: GraphRec
    }
]

// @ts-ignore
export const finalRoutes = (isProduction ? routes : routes.concat(testRoutes)) as Route[];
