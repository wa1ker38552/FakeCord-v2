async function updateStream(config) {
  var parent = document.getElementById("channelContent")
  var a = await fetch("/api/stream")
  var b = await a.json()

  if (b.length > 0) {
    for (message of b) {
      parent.append(createMessage(config, message))
      currentAuthor = message.author.id
    }
    scroll(parent)
  }
}
