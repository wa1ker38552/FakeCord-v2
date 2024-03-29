async function openModal(config, id) {
  document.getElementById("modal").style.display = "flex"

  var a = await fetch("/api/users/"+id)
  var b = await a.json()

  if (b.user.avatar) {
    if (config.proxy) {
      document.getElementById("modalAvatar").src = `/api/avatars/${b.user.id}/${b.user.avatar}`
    } else {
      document.getElementById("modalAvatar").src = `https://cdn.discordapp.com/avatars/${b.user.id}/${b.user.avatar}.png?size=${config.resolution}`
    }
  }

  var badgeContainer = document.getElementById("badgeContainer")
  badgeContainer.innerHTML = ""
  for (badge of b.badges) {
    var badgeObject = document.createElement("a")
    var badgeIcon = document.createElement("img")
    badgeObject.className = "badge"
    badgeObject.target = "_blank"
    badgeObject.href = badge.link

    if (config.proxy) {
      badgeIcon.src = `/api/badge-icons/${badge.icon}`
    } else {
      badgeIcon.src = `https://cdn.discordapp.com/badge-icons/${badge.icon}.png?size=${config.resolution}`
    }
    badgeObject.append(badgeIcon)
    badgeContainer.append(badgeObject)
  }

  if (b.user.banner_color) {
    document.getElementById("modalBanner").style.background = b.user.banner_color
  } else {
    document.getElementById("modalBanner").style.backgroundColor = "#000000"
  }
  document.getElementById("modalUsername").innerHTML = b.user.username+"#"+b.user.discriminator
  document.getElementById("aboutMe").innerHTML = b.user.bio
  document.getElementById("modalFlags").innerHTML = b.user.public_flags
  document.getElementById("modalID").innerHTML = b.user.id
}
