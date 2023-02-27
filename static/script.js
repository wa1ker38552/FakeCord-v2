async function getGuildData() {
  var parent = document.getElementById("guildContainer")
  const promise = await fetch('/api/guilds')
  const data = await promise.json()

  for (var i=0; i<data.length; i++) {
    var guildButton = document.createElement("a")
    var guildIcon = document.createElement("img")
    guildButton.style.marginRight = "0.8vw"
    guildButton.href = "/channels/"+data[i].id
    guildButton.className = "home-icon"
    guildIcon.className = "round-border"

    if (data[i].icon == null) {
      guildIcon.src = '/static/assets/error.png'
    } else {
      guildIcon.src = `https://cdn.discordapp.com/icons/${data[i].id}/${data[i].icon}.png?size=512`
    }
    
    guildButton.append(guildIcon)
    parent.append(guildButton)
  }
}

async function getClientData() {
  const promise = await fetch('/api/@me')
  const data = await promise.json()
  document.getElementById('selfAvatar').src = `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png?size=512`
  document.getElementsByClassName('client-username')[0].innerHTML = data.username
  document.getElementsByClassName('client-discriminator')[0].innerHTML = '#'+data.discriminator
}

async function getChannelData(type, c) {
  // type = refresh or fetch from cached
  // c = channel id, default is null
  if (type == 1) {
    document.getElementById("channelContainer").remove()
    var channelContainer = document.createElement("div")
    channelContainer.id = "channelContainer"
    channelContainer.className = "channel-navigation"
    var refreshButton = document.createElement("button")
    refreshButton.className = "button"
    refreshButton.innerHTML = "..."
    refreshButton.onclick = function() {getChannelData(1); location.refresh()}
    refreshButton.style.cursor = "not-allowed"
    
    channelContainer.append(refreshButton)
    document.getElementsByTagName("body")[0].prepend(channelContainer)
  }
  
  var parent = document.getElementById("channelContainer")
  const promise = await fetch('/api/channels?refresh='+type)
  const data = await promise.json()

  for (var i=0; i<data.length; i++) {
    var channel = document.createElement("a")
    var channelAvatar = document.createElement("div")
    var channelAvatarImage = document.createElement("img")
    var channelUsername = document.createElement("div")
    channel.id = data[i].id
    channel.href = "/channels/"+data[i].id

    if (c == data[i].id) {channel.className = "channel selected-channel"}
    else {channel.className = "channel"}
    
    channelAvatar.className = "channel-avatar"
    channelAvatarImage.style.borderRadius = "50%"

    if (data[i].recipients.length > 1) {
      if (data[i].icon == null) {
        channelAvatarImage.src = "/static/assets/group icon.png"
      } else {
        channelAvatarImage.src = `https://cdn.discordapp.com/channel-icons/${data[i].id}/${data[i].icon}.webp?size=512`
      }
      if (data[i].name == null) {
        var name = ""
        for (var j=0; j<data[i].recipients.length; j++) {
          name += data[i].recipients[j].username+" "
        }
        channelUsername.innerHTML = name
      } else {
        channelUsername.innerHTML = data[i].name
      }
    } else {
      try {
        if (data[i].recipients[0].avatar == null) {
          channelAvatarImage.src = "/static/assets/error.png"
        } else {
          channelAvatarImage.src = `https://cdn.discordapp.com/avatars/${data[i].recipients[0].id}/${data[i].recipients[0].avatar}.png?size=512`
        }
        channelUsername.innerHTML = data[i].recipients[0].username
      } catch (Exception) {}
    }
    channelUsername.className = "channel-name"

    channelAvatar.append(channelAvatarImage)
    channel.append(channelAvatar)
    channel.append(channelUsername)
    parent.append(channel)

    if (type == 1) {
      refreshButton.innerHTML = "Refresh Channels"
      refreshButton.style.cursor = "pointer"
    }
  }
}

function scrollBottom(element) {
  element.scrollTop = element.scrollHeight;
}
