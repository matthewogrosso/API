function SanitizeUrl(url) {
    var replacedSpaces = url.replace(/\%20/g, ' ')
    var replacedDoubleQuotes = replacedSpaces.replace(/\%22/g, '\"')
    var replacedSingleQuotes = replacedDoubleQuotes.replace(/\%27/g, '\'')

    return replacedSingleQuotes
}

exports.SanitizeUrl = SanitizeUrl