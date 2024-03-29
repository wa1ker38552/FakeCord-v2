from flask import render_template
from database import Database
from flask import send_file
from flask import redirect
from flask import request
from flask import Flask
import requests
import json
import io
import os


db = Database()
app = Flask(__name__)
client = requests.Session()
client.headers = {'Authorization': os.environ['TOKEN']}

# ===== PROXY ===== #
@app.route('/api/avatars/<id>/<avatar>')
def api_avatars(id, avatar):
  r = requests.get(f'https://cdn.discordapp.com/avatars/{id}/{avatar}.png?size={db.load()["config"]["resolution"]}').content
  return send_file(io.BytesIO(r), mimetype='image/png')

@app.route('/api/channel-icons/<id>/<icon>')
def api_channel_icons(id, icon):
  r = requests.get(f'https://cdn.discordapp.com/channel-icons/{id}/{icon}.png?size={db.load()["config"]["resolution"]}').content
  return send_file(io.BytesIO(r), mimetype='image/png')

@app.route('/api/icons/<id>/<icon>')
def api_icons(id, icon):
  r = requests.get(f'https://cdn.discordapp.com/icons/{id}/{icon}.png?size={db.load()["config"]["resolution"]}').content
  return send_file(io.BytesIO(r), mimetype='image/png')

@app.route('/api/attachments/<channel>/<id>/<name>')
def api_attachments(channel, id, name):
  r = requests.get(f'https://cdn.discordapp.com/attachments/{channel}/{id}/{name}?size={db.load()["config"]["resolution"]}').content
  return send_file(io.BytesIO(r), mimetype='image/png')

@app.route('/api/badge-icons/<icon>')
def api_badget_icons(icon):
  r = requests.get(f'https://cdn.discordapp.com/badge-icons/{icon}.png?size={db.load()["config"]["resolution"]}').content
  return send_file(io.BytesIO(r), mimetype='image/png')

# ===== API ===== #
@app.route('/api/config')
def config():
  return db.load()

@app.route('/api/traceback')
def traceback():
  try:
    return json.loads(request.args.get('json'))
  except json.decoder.JSONDecodeError:
    return request.args.get('json')

@app.route('/api/guilds')
def guilds():
  if not 'guilds' in db.load():
    db.set('guilds', client.get('https://discord.com/api/v9/users/@me/guilds').json())
  return db.load()['guilds']

@app.route('/api/channels')
def channels():
  if not 'channels' in db.load():
    channels = client.get('https://discord.com/api/v9/users/@me/channels').json()

    for i, c in enumerate(channels):
      if c['last_message_id'] is None: channels[i]['last_message_id'] = 0
  
    for a in range(len(channels)):
      for b in range(len(channels)-1):
        if int(channels[b]['last_message_id']) < int(channels[b+1]['last_message_id']):
          save = channels[b+1]
          channels[b+1] = channels[b]
          channels[b] = save

    db.set('channels', channels)
  return db.load()['channels']

@app.route('/api/channels/<guild>')
def guild_channels(guild):
  database = db.load()
  for i, g in enumerate(database['guilds']):
    if g['id'] == guild:
      if not 'channels' in g:
        channels = client.get(f'https://discord.com/api/v9/guilds/{guild}/channels').json()
        database['guilds'][i]['channels'] = channels
        db.save(database)
      return database['guilds'][i]['channels']
        
@app.route('/api/@me')
def self():
  return client.get('https://discord.com/api/v9/users/@me').json()

@app.route('/api/channels/<id>/messages')
def messages(id):
  if request.args.get('cursor'):
    return client.get(f'https://discord.com/api/v9/channels/{id}/messages?limit=50&before={request.args.get("cursor")}').json()[::-1]
  return client.get(f'https://discord.com/api/v9/channels/{id}/messages?limit=50').json()[::-1]

@app.route('/api/channels/<id>/message', methods=['POST'])
def message_channel(id):
  content = json.loads(request.data.decode('utf-8'))['content']
  return client.post(f'https://discord.com/api/v9/channels/{id}/messages', {'content': content}).json()

@app.route('/api/users/<id>')
def users(id):
  return client.get(f'https://discord.com/api/v9/users/{id}/profile?with_mutual_guilds=false&with_mutual_friends_count=false').json()
