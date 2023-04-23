async function getAuthenticatedUser(config) {
  var a = await fetch("/api/@me")
  var b = await a.json()

  document.getElementsByClassName("menu-text-username")[0].innerHTML = `${b.username}#${b.discriminator}`
  document.getElementsByClassName("menu-text-status")[0].innerHTML = b.bio

  if (config.proxy) {
     document.getElementById("menuAvatar").src = `/api/avatars/${b.id}/${b.avatar}`
  } else {
    document.getElementById("menuAvatar").src = `https://cdn.discordapp.com/avatars/${b.id}/${b.avatar}.png?size=${config.resolution}`
  }
}

async function getGuildData(config) {
  var parent = document.getElementById("guildContainer")
  var a = await fetch("/api/guilds")
  var b = await a.json()

  for (guild of b) {
    if (!(guild.features.includes("HUB"))) {
      var guildParent = document.createElement("a")
      var guildIcon = document.createElement("img")
      
      guildParent.href = "/guilds/"+guild.id
      guildParent.className = "guild"
      guildIcon.style.borderRadius = "10%"
  
      if (guild.icon) {
        if (config.proxy) {
          guildIcon.src = `/api/icons/${guild.id}/${guild.icon}`
        } else {
          guildIcon.src = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=${config.resolution}`
        }
      } else {
        guildIcon.src = "/static/assets/loading.png"
      }
  
      guildParent.append(guildIcon)
      parent.append(guildParent)
    }
  }
}

async function getChannelData(config) {
  var parent = document.getElementById("channelContainer")
  var a = await fetch("/api/channels")
  var b = await a.json()

  for (channel of b) {
    var channelParent = document.createElement("a")
    var channelIconContainer = document.createElement("div")
    var channelIcon = document.createElement("img")
    var channelTextContainer = document.createElement("div")
    var channelTextUsername = document.createElement("div")

    channelParent.id = channel.id
    channelParent.href = "/channels/"+channel.id
    channelParent.className = "channel centered-children-vert"
    channelIconContainer.className = "channel-icon"
    channelIcon.style.borderRadius = "5px"
    channelTextContainer.className = "channel-text-container"
    channelTextUsername.className = "channel-text-username"

    channelTextContainer.append(channelTextUsername)
    if (channel.recipients.length == 1) {
      channelTextContainer.style.display = "flex"
      channelTextContainer.style.alignItems = "center"
      channelTextContainer.style.justifyContent = "left"
      channelTextUsername.innerHTML = channel.recipients[0].username

      if (channel.recipients[0].avatar) {
        if (config.proxy) {
          channelIcon.src = `/api/avatars/${channel.recipients[0].id}/${channel.recipients[0].avatar}`
        } else {
          channelIcon.src = `https://cdn.discordapp.com/avatars/${channel.recipients[0].id}/${channel.recipients[0].avatar}.png?size=${config.resolution}`
        }
      } else {
        channelIcon.src = "/static/assets/loading.png"
      }
      
    } else {
      var channelTextSub = document.createElement("div")

      channelTextSub.className = "channel-text-sub"
      channelTextSub.innerHTML = channel.recipients.length+" Members"
      channelTextContainer.append(channelTextSub)

      if (channel.name) {
        channelTextUsername.innerHTML = channel.name
      } else {
        var name = ""
        for (user of channel.recipients) {name += user.username+", "}
        name = name.slice(0, name.length-2)
        channelTextUsername.innerHTML = name
      }

      if (channel.icon) {
        if (config.proxy) {
          channelIcon.src = `/api/channel-icons/${channel.id}/${channel.icon}`
        } else {
          channelIcon.src = `https://cdn.discordapp.com/channel-icons/${channel.id}/${channel.icon}.png?size=${config.resolution}`
        }
      } else {
        channelIcon.src = "/static/assets/loading.png"
      }
    }

    channelIconContainer.append(channelIcon)
    channelParent.append(channelIconContainer)
    channelParent.append(channelTextContainer)
    parent.append(channelParent)
  }

  return b
}

function getChannelMeta(config, id, channels) {
  for (channel of channels) {
    if (channel.id == id) {
      document.getElementById(id).classList.add("selected-channel")

      if (channel.recipients.length > 1) {
        if (channel.icon) {
          if (config.proxy) {
            document.getElementById("channelIcon").src = `/api/channel-icons/${channel.id}/${channel.icon}`
          } else {
            document.getElementById("channelIcon").src = `https://cdn.discordapp.com/channel-icons/${channel.id}/${channel.icon}.png?size=${config.resolution}`
          }
        } else {
          document.getElementById("channelIcon").src = "/static/assets/loading.png"
        }
        
        if (channel.name) {
          document.getElementById("channelInput").placeholder = `Message ${channel.name}`
          document.getElementById("channelName").innerHTML = channel.name
        } else {
          var name = ""
          for (user of channel.recipients) {name += user.username+", "}
          name = name.slice(0, name.length-2)
          document.getElementById("channelInput").placeholder = `Message ${name}`
          document.getElementById("channelName").innerHTML = name
        }
      } else {
        try {
          if (channel.recipients[0].avatar){
            if (config.proxy) {
              document.getElementById("channelIcon").src = `/api/avatars/${channel.recipients[0].id}/${channel.recipients[0].avatar}`
            } else {
              document.getElementById("channelIcon").src = `https://cdn.discordapp.com/avatars/${channel.recipients[0].id}/${channel.recipients[0].avatar}.png?size=${config.resolution}`
            }
          } else {
            document.getElementById("channelIcon").src = "/static/assets/loading.png"
          }
          document.getElementById("channelInput").placeholder = `Message ${channel.recipients[0].username}`
          document.getElementById("channelName").innerHTML = channel.recipients[0].username+"#"+channel.recipients[0].discriminator
        } catch (err) {
          document.getElementById("channelInput").placeholder = `Message Unkown Channel`
          document.getElementById("channelInput").style.cursor = "not-allowed" 
          document.getElementById("channelInput").readOnly = true
          document.getElementById("channelName").innerHTML = "Unkown Channel"
        }
      }
    }
  }
}
