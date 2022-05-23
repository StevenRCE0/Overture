const prepList = [
    'to',
    'for',
    'between',
    'without',
    'alongside',
    'underneath',
    'in',
    'at',
    'on',
]

function isChinese(str: string) {
    return /[\u4E00-\u9FA5]/.test(str)
}

export function toTitleCase(text: string) {
    const characters = text.split(' ').map((word, wordIndex) => {
        if (wordIndex !== 0 && prepList.indexOf(word.toLowerCase()) >= 0) {
            return word.toLowerCase()
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    return characters.join(' ')
}

export function multiLine(text: string, maxWidth: number, fontSize: number) {
    const words = text.split(' ')
    const lines = []
    let currentLine = words[0]
    for (let i = 1; i < words.length; i++) {
        const word = words[i]
        const width = (currentLine + ' ' + word).length
        if (width < maxWidth / fontSize) {
            currentLine += ' ' + word
        } else {
            lines.push(currentLine)
            currentLine = word
        }
    }
    lines.push(currentLine)
    return { text: lines.join('\n'), lines: lines.length }
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
    const splitSpace = isChinese(text) ? '' : ' '
    var words = text.split(splitSpace)
    var line = ''
    var lineCount = 1

    for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + splitSpace
        var metrics = context.measureText(testLine)
        var testWidth = metrics.width
        if (words[n].charAt(0) === '\n') {
            line = line.replace(/\s*$/, '')
            context.fillText(line, x, y)
            line = words[n] + splitSpace
            y += lineHeight * 2
            lineCount += 2
        } else if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y)
            line = words[n] + splitSpace
            y += lineHeight
            lineCount += 1
        } else {
            line = testLine
        }
    }
    context.fillText(line, x, y)

    return lineCount
}
