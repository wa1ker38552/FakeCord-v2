async function refreshStream() {
  const promise = await fetch('/api/stream')
  const data = await promise.json()
  if (data.length > 0) {
    var parent = document.getElementById("messagesContainer")
    for (var i=0; i<data.length; i++) {
      parent.append(createMessage(data[i].id,
                                  data[i].authorId,
                                  data[i].authorAvatar,
                                  data[i].username,
                                  data[i].timestamp,
                                  data[i].content))
    }
    scrollBottom(parent)
  }
}

setInterval(refreshStream, 1000)
