var formattedText = {
  "**": "b",
  "`": "code",
  "*": "i"
}

async function getChannelHistory(config, id) {
  var parent = document.getElementById("channelContent")
  var a = await fetch(`/api/channels/${id}/messages`)
  var b = await a.json()

  for (message of b) {
    var messageParent = document.createElement("div")
    var messageAuthorAvatar = document.createElement("div")
    var authorAvatar = document.createElement("img")
    var messageText = document.createElement("div")
    var messageAuthor = document.createElement("div")
    var messageContent = document.createElement("div")

    messageParent.id = message.id
    messageParent.className = "message"
    messageAuthorAvatar.className = "message-author-avatar"
    messageText.className = "message-text"
    messageAuthor.className = "message-author"
    messageContent.className = "message-content"
    authorAvatar.style.borderRadius = "50%"

    if (message.author.avatar) {
      if (config.proxy) {
        authorAvatar.src = `/api/avatars/${message.author.id}/${message.author.avatar}`
      } else {
        authorAvatar.src = `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=${config.resolution}`
      }
    } else {
      authorAvatar.src = "/static/assets/loading.png"
    }

    for (const [key, value] of Object.entries(formattedText)) {
      if (message.content.includes(key)) {
        message.content = parseFormattedText(key, value)
      }
    }
    
    messageContent.innerHTML = message.content
    messageAuthor.innerHTML = message.author.username

    if (message.mentions) {
      for (mention of message.mentions) {
        message.content = message.content.split(`<@${mention.id}>`).join(`<span class="message-mention">@${mention.username}</span>`)
      }
      messageContent.innerHTML = message.content
    }

    if (message.attachments) {
      for (attachment of message.attachments) {
        var attachmentContainer = document.createElement("a")
        var attachmentImage = document.createElement("img")
        attachmentContainer.className = "attachment"
        attachmentContainer.style.width = config.attachmentSize+"em"
        attachmentContainer.style.height = config.attachmentSize+"em"

        if (config.proxy) {
          attachmentImage.src = `/api/attachments/${message.channel_id}/${attachment.id}/${attachment.filename}`
        } else {
          attachmentImage.src = attachment.url
        }
        attachmentImage.style.borderRadius = "5px"
        attachmentContainer.href = attachmentImage.src
        attachmentContainer.target = "_blank"

        attachmentContainer.append(attachmentImage)
        messageContent.append(attachmentContainer)
      }
    }

    if ("bot" in message.author) {
      var botTag = document.createElement("div")
      botTag.innerHTML = "BOT"
      botTag.className = "bot-tag"
      messageAuthor.append(botTag)
    }

    if (messageContent.innerHTML == "") {
      var error = document.createElement("span")
      var traceback = document.createElement("a")
      error.className = "error"
      traceback.className = "traceback"
      error.innerHTML = "Unsupported message type (system notification?)"
      
      traceback.href = `/api/traceback?json=`+JSON.stringify(message)
      traceback.target = "_blank"
      traceback.innerHTML = "(traceback)"

      messageContent.append(error, traceback)
    }

    var timestamp = document.createElement("div")
    timestamp.className = "message-timestamp"
    timestamp.innerHTML = message.timestamp.split("T")[0]+" "+message.timestamp.split("T")[1].split(".")[0]
    messageAuthor.append(timestamp)

    messageText.append(messageAuthor)
    messageText.append(messageContent)
    messageAuthorAvatar.append(authorAvatar)
    messageParent.append(messageAuthorAvatar)
    messageParent.append(messageText)
    parent.append(messageParent)
  }

  scroll(parent)
}
