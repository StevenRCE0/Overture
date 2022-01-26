import Overture from './Overture.svelte';
import Redirect from './Stuff/Redirect.svelte'
import CentreStage from './Views/CentreStage.svelte';
import NativeThree from './Views/NativeThree.svelte';

export const routes = [
    {
        name: '/',
        component: Redirect
    },
    {
        name: 'Overture',
        component: Overture
    },
    {
        name: 'CentreStage', 
        component: CentreStage
    },
    {
        name: 'native',
        component: NativeThree
    }
]