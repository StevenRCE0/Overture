import Overture from './Overture.svelte';
import CentreStage from './Views/CentreStage.svelte';

export const routes = [
    {
        name: '/',
        component: Overture
    },
    {
        name: 'CentreStage', 
        component: CentreStage
    }
]