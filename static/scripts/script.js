async function getConfig() {
  var a = await fetch("/api/config")
  var b = await a.json()
  return b
}

function scroll(div) {
  div.scrollTop = div.scrollHeight;
}

function parseFormattedText(target, tag) {
  var str = ""
  var i = 0
  for (split of message.content.split(target)) {
    if (i%2==0) {
      str += split+`<${tag}>`
    } else {
      str += split+`</${tag}>`
    }
    i += 1
  }
  return str.substring(0, str.length-(2+tag.length))
}
