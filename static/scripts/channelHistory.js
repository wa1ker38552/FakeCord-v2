var currentAuthor = null
var formattedText = {
  "**": "b",
  "`": "code",
  "*": "i"
}

function createMessage(config, message, new_message=false) {
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
      message.content = parseFormattedText(message.content, key, value)
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

  if (message.embeds) {
    for (e of message.embeds) {
      var em = document.createElement("div")
      em.className = "embed"

      if ("title" in e) {
        var embedTitle = document.createElement("div")
        embedTitle.className = "embed-title"
        embedTitle.innerHTML = e.title
        em.append(embedTitle)
      }

      if ("description" in e) {
        var embedDescription = document.createElement("div")
        embedDescription.className = "embed-description"

        for (const [key, value] of Object.entries(formattedText)) {
          if (e.description.includes(key)) {
            e.description = parseFormattedText(e.description, key, value)
          }
        }
        console.log(e.description)
        embedDescription.innerHTML = e.description
        em.append(embedDescription)
      }

      try {
        em.style.borderColor = `#${e.color.toString(16)}`
      } catch (e) {}
      messageContent.append(em)
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

  if (new_message) {
    messageParent.style.marginTop = "0.5em"
    messageText.append(messageAuthor)
  } else {
    if (currentAuthor != message.author.id) {
      messageParent.style.marginTop = "0.5em"
      messageText.append(messageAuthor)
      currentAuthor = message.author.id
    } else {
      authorAvatar.src = ""
      messageAuthorAvatar.style.opacity = 0
      messageAuthorAvatar.style.height = "1.5em"
      messageAuthorAvatar.style.width = "2.5em"
    }
  }

  messageParent.append(messageAuthorAvatar)
  messageText.append(messageContent)
  messageAuthorAvatar.append(authorAvatar)
  messageParent.append(messageText)
  
  return messageParent
}

async function getChannelHistory(config, id, cursor=null) {
  var parent = document.getElementById("channelContent")

  if (cursor) {
    var cont = []
    var a = await fetch(`/api/channels/${id}/messages?cursor=`+cursor)
  } 
  else {
    var a = await fetch(`/api/channels/${id}/messages`)
  }

  var b = await a.json()
  // currentAuthor = b[0].author.id
  currentAuthor = null
    
  for (message of b) {
    if (cursor != null) {
      cont.push(createMessage(config, message))
    } else {
      parent.append(createMessage(config, message))
    }
  }
  if (cursor != null) {
    cont.reverse()
    for (c of cont) {parent.prepend(c)}
  }
}
