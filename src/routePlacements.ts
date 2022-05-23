export type RouteRole = 'major' | 'minor'
export type GenericRouteProps = {
    type: RouteRole
    target: string
    label: string
}

export const navigationList: Array<GenericRouteProps> = [
    {
        type: 'major',
        target: '/Overture',
        label: 'Overture',
    },
    {
        type: 'major',
        target: '/Books',
        label: 'Books',
    },
]
