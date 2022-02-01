import type { BookletProps } from "../Stuff/Booklet"

export async function fetchBook(url: string): Promise<BookletProps[]> {
    const response = await (await fetch(url)).json()
    return response['books']
}
