from flask import render_template
from database import Database
from threading import Thread
from flask import redirect
from flask import request
from flask import Flask
import requests
import discord
import json
import copy
import os

app = Flask(__name__)
listening = None
sb = discord.Client(self_bot=True)
client = requests.Session()
client.headers = {'Authorization': os.environ['TOKEN']}

@app.route('/api/@me')
def me():
  global client
  db = Database().load()
  if db['client'] == {}:
    Database().set_key('client', client.get('https://discord.com/api/v9/users/@me').json())
  return db['client']

@app.route('/api/channels')
def channels():
  global client
  db = Database().load()
  if request.args.get('refresh') == '1':
    Database().set_key('channels', client.get('https://discord.com/api/v9/users/@me/channels').json())
  else:
    if db['channels'] == {}:
      Database().set_key('channels', client.get('https://discord.com/api/v9/users/@me/channels').json())

  for i, c in enumerate(db['channels']):
    if c['last_message_id'] is None: db['channels'][i]['last_message_id'] = 0

  # sort channels T_T
  for a in range(len(db['channels'])):
    for b in range(len(db['channels'])-1):
      if int(db['channels'][b]['last_message_id']) < int(db['channels'][b+1]['last_message_id']):
        save = db['channels'][b+1]
        db['channels'][b+1] = db['channels'][b]
        db['channels'][b] = save

  return db['channels']

@app.route('/api/guilds')
def guilds():
  global client
  db = Database().load()
  if db['guilds'] == []:
    Database().set_key('guilds', client.get('https://discord.com/api/v9/users/@me/guilds').json())
  return db['guilds']

@app.route('/api/channels/<id>/messages')
def messages(id):
  global client
  data = client.get(f'https://discord.com/api/v9/channels/{id}/messages?limit=50').json()
  data.reverse()
  return data

@app.route('/api/channels/<id>/message', methods=['POST'])
def message(id):
  global client
  content = json.loads(request.data.decode('utf-8'))['content']
  return client.post(f'https://discord.com/api/v9/channels/{id}/messages', {'content': content}).json()

@app.route('/api/stream')
def stream():
  global message_queue
  reference = copy.copy(message_queue)
  message_queue = []
  return reference

@app.route('/')
def index():
  global listening
  listening = None
  return render_template('index.html')

@app.route('/channels/<id>')
def private_channel(id):
  global listening
  listening = int(id)
  channel_name = '?'
  channel_icon = '/static/assets/error.png'
  for channel in Database().load()['channels']:
    if channel['id'] == id:
      if 'name' in channel:
        channel_name = channel['name']
      else:
        channel_name = channel['recipients'][0]['username']

      if 'icon' in channel:
        if channel['icon'] is None:
          channel_icon = "/static/assets/group icon.png"
        else:
          channel_icon = f'https://cdn.discordapp.com/channel-icons/{channel["id"]}/{channel["icon"]}.webp?size=512'
      else:
        if channel["recipients"][0]["avatar"] is None:
          channel_icon = "/static/assets/error.png"
        else:
          channel_icon = f'https://cdn.discordapp.com/avatars/{channel["recipients"][0]["id"]}/{channel["recipients"][0]["avatar"]}'
      break
    
  return render_template('private-channel.html', channel_name=channel_name, channel_icon=channel_icon)


@sb.event
async def on_ready():
  print(sb.user)

@sb.event
async def on_message(message):
  global listening, message_queue
  if message.channel.id == listening:
    if isinstance(message.channel, discord.channel.DMChannel):
      url = str(message.author.avatar_url).split('/')
      message_queue.append({
        'content': message.content,
        'username': str(message.author).split('#')[0],
        'id': message.id,
        'authorId': url[4],
        'authorAvatar': url[5].split('.')[0],
        'timestamp': str(message.created_at).split()[1].split('.')[0],
      })

message_queue = []
Thread(target=lambda: app.run(host='0.0.0.0', port=8080)).start()
sb.run(os.environ['SBTOKEN'], bot=False)
