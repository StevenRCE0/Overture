import Overture from "./Overture.svelte"
import Redirect from "./Stuff/Redirect.svelte"
import CentreStage from "./Views/CentreStage.svelte"
import Books from "./Views/Books.svelte"
import Tests from "./Views/Tests.svelte"
import Scrollers from "./tests/Scrollers.svelte"
import TimeShape from "./Views/TimeShape.svelte"
import MikuPlayer from "./Views/MikuPlayer.svelte"
import GetChicken from "./Views/GetChicken.svelte"
import FormChicken from "./Views/FormChicken.svelte"

export const routes = [
    {
        name: "/",
        component: Redirect,
    },
    {
        name: "Overture",
        component: Overture,
    },
    {
        name: "CentreStage",
        component: CentreStage,
    },
    {
        name: "Books",
        component: Books,
    },
    {
        name: "Scrollers",
        component: Scrollers,
    },
    {
        name: "Chicken",
        component: GetChicken,
    }
]

export const testRoutes = [
    {
        name: "Tests",
        component: Tests,
    },
    {
        name: "TimeShape",
        component: TimeShape,
    },
    {
        name: "MikuPlayer",
        component: MikuPlayer,
    },
    {
        name: "FormChicken",
        component: FormChicken,
    }
]
