async function getChannelHistory(channel) {
  var parent = document.getElementById("messagesContainer")
  const promise = await fetch(`/api/channels/${channel}/messages`)
  const data = await promise.json()

  for (var i=0; i<data.length; i++) {
    parent.append(createMessage(data[i].id, 
                                data[i].author.id, 
                                data[i].author.avatar, 
                                data[i].author.username, 
                                data[i].timestamp.split('T')[1].split('.')[0], 
                                data[i].content))
  }

  scrollBottom(document.getElementById("messagesContainer"))
}

function createMessage(id, authorId, authorAvatar, username, timestamp, content) {
  var message = document.createElement("div")
  var messageAuthorAvatar = document.createElement("div")
  var messageAuthorImage = document.createElement("img")
  var messageContentContainer = document.createElement("div")
  var messageAuthor = document.createElement("span")
  var messageTimestamp = document.createElement("span")
  var messageContent = document.createElement("div")
  
  message.id = id
  message.className = "message"
  messageAuthorAvatar.className = "message-author-avatar"
  messageAuthorImage.style = "border-radius: 50%;"
  messageAuthorImage.src = `https://cdn.discordapp.com/avatars/${authorId}/${authorAvatar}.png?size=512`
  messageContentContainer.className = "message-content-container"
  messageAuthor.className = "message-author"
  messageAuthor.innerHTML = username
  messageTimestamp.className = "message-timestamp"
  messageTimestamp.innerHTML = timestamp
  messageContent.className = "message-content"
  messageContent.innerHTML = content

  messageAuthorAvatar.append(messageAuthorImage)
  messageContentContainer.append(messageAuthor)
  messageContentContainer.append(messageTimestamp)
  messageContentContainer.append(messageContent)
  message.append(messageAuthorAvatar)
  message.append(messageContentContainer)
  return message
}

function sendMessage() {
  var message = document.getElementById("messageInput").value
  fetch('/api/channels/'+window.location.href.split('/')[4]+'/message', {
    method: 'POST',
    headers: {Accept: 'application.json', 'Content-Type': 'application/json'},
    body: JSON.stringify({"content": message})
  })
    .then(response => response.json())
    .then(response => {
      
    })
}

window.onload = async function() {
  var channelId = window.location.href.split('/')[4]
  getClientData()
  getGuildData()
  getChannelData(0, channelId)
  getChannelHistory(channelId)

  $(document).on('submit','#submitMessage', function(e) {
    e.preventDefault()
  
    var message = document.getElementById("messageInput").value
    document.getElementById("messageInput").value = ""
    
    fetch('/api/channels/'+window.location.href.split('/')[4]+'/message', {
      method: 'POST',
      headers: {Accept: 'application.json', 'Content-Type': 'application/json'},
      body: JSON.stringify({"content": message})
    })
      .then(response => response.json())
      .then(response => {
        console.log(response)
      })
})
}
