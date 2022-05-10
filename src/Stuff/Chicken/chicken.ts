export interface NotionConnection {
    token: ""
    database: ""
}
export interface ChickenCard {
    name: string
    slogan: string
    wishes: string[]
    skills: string[]
    communicating: string[]
    tel: string
}
export interface ChickenForm extends ChickenCard {
    gender: string
    grade: string
    university: string
    chickenCard?: object
}

export const postChicken = async (
    connectionConfiguration: NotionConnection,
    chicken: ChickenForm
) => {
    submitQuery(connectionConfiguration, chicken)
}

const submitQuery = async (
    connectionConfiguration: NotionConnection,
    query: object
): Promise<Response> => {
    const response = await fetch("https://api.notion.com/v1/pages", {
        method: "POST",
        headers: {
            Authorization: connectionConfiguration.token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query,
        }),
    })
    return response
}
