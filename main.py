from flask import render_template
from database import Database
from threading import Thread
from flask import redirect
from api import app
import requests
import discord
import copy
import os

current_stream = []
current_channel = None
client = discord.Client(self_bot=True)
cli = requests.Session()
cli.headers = {'Authorization': os.environ['TOKEN']}
db = Database()

def format_embed(e):
  embed = {}
  try:
    embed['author'] = {
      'name': embed.author.name,
      'url': embed.author.url
    }
  except KeyError: pass
  try:
    embed['color'] = embed.color
  except KeyError: embed.color = None
  try:
    embed['thumbnail'] = {
      'height': embed.thumbnail.height,
      'url': embed.thumbnail.url,
      'width': embed.thumbnail.width
    }
  except KeyError: pass
  try:
    embed['title'] = embed.title
  except KeyError:
    embed['title'] = ''
  try:
    embed['description'] = embed.description
  except KeyError:
    embed['description'] = ''
  embed['type'] = embed.type
  try:
    embed['url'] = embed.url
  except KeyError: pass

@app.route('/api/stream')
def stream():
  global current_stream
  reference = copy.copy(current_stream)
  current_stream = []
  return reference

@app.route('/')
def app_index():
  global current_channel
  current_channel = None
  return render_template('index.html')

@app.route('/channels/<id>')
def app_channels(id):
  global current_channel, current_stream
  try:
    current_channel = int(id)
    current_stream = []
  except ValueError: pass
  return render_template('channels.html', channel_id=id)

@app.route('/guilds/<id>')
def app_guilds(id):
  data = db.load()['guilds']
  for i, guild in enumerate(data):
    if guild['id'] == id:
      if 'channels' in guild:
        return redirect(f'/channels/{id}/{guild["channels"][0]["id"]}')
      else:
        channels = cli.get(f'https://discord.com/api/v9/guilds/{id}/channels').json()
        data[i]['channels'] = channels
        db.set('guilds', data)
        return redirect(f'/channels/{id}/{channels[0]["id"]}')
  return redirect('/')

@app.route('/channels/<guild>/<id>')
def app_guild_channels(guild, id):
  return render_template('guild_channels.html', guild_id=guild, channel_id=id)

@client.event
async def on_ready():
  print(client.user)

@client.event
async def on_message(message):
  global current_channel
  if message.channel.id == current_channel:
    try:
      mentions = [{
        'avatar': m.avatar,
        'discriminator': m.discriminator,
        'display_name': m.display_name,
        'id': str(m.id),
        'username': str(m).split("#")[0]
      } for m in message.mentions]
    except KeyError: mentions = []
    current_stream.append({
      'attachments': [{
        'content_type': a.content_type,
        'filename': a.filename,
        'height': a.height,
        'id': a.id,
        'proxy_url': a.proxy_url,
        'size': a.size,
        'url': a.url,
        'width': a.width
      } for a in message.attachments],
      'author': {
        'avatar': message.author.avatar,
        'discriminator': message.author.discriminator,
        'display_name': message.author.display_name,
        'id': str(message.author.id),
        'username': str(message.author).split("#")[0]
      },
      'channel_id': message.channel.id,
      'content': message.content,
      'embeds': [format_embed(e) for e in message.embeds],
      'id': message.id,
      'mention_everyone': message.mention_everyone,
      'mentions': mentions,
      'pinned': message.pinned,
      'timestamp': 'T'.join(str(message.created_at).split()),
      'tts': message.tts,
      'type': message.type
    })


Thread(target=lambda: app.run(host='0.0.0.0', port=8080)).start()
client.run(os.environ['TOKEN'], bot=False)
