const prepList = [
    "to",
    "for",
    "between",
    "without",
    "alongside",
    "underneath",
    "in",
    "at",
    "on",
]

export function toTitleCase(text: string) {
    const characters = text.split(" ").map((word, wordIndex) => {
        if (wordIndex !== 0 && prepList.indexOf(word.toLowerCase()) >= 0) {
            return word.toLowerCase()
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    return characters.join(" ")
}

export function multiLine(text: string, maxWidth: number, fontSize: number) {
    const words = text.split(" ")
    const lines = []
    let currentLine = words[0]
    for (let i = 1; i < words.length; i++) {
        const word = words[i]
        const width = (currentLine + " " + word).length
        if (width < maxWidth / fontSize) {
            currentLine += " " + word
        } else {
            lines.push(currentLine)
            currentLine = word
        }
    }
    lines.push(currentLine)
    return { text: lines.join("\n"), lines: lines.length }
}
export function multiLineTitle(
    text: string,
    maxWidth: number,
    fontSize: number
) {
    return multiLine(toTitleCase(text), maxWidth, fontSize)
}

export function wrapText(
    context: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
) {
    var words = text.split(" ")
    var line = ""

    for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + " "
        var metrics = context.measureText(testLine)
        var testWidth = metrics.width
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y)
            line = words[n] + " "
            y += lineHeight
        } else {
            line = testLine
        }
    }
    context.fillText(line, x, y)
}
