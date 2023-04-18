from flask import render_template
from flask import redirect
from flask import request
from flask import Flask

app = Flask(__name__)

@app.route('/')
def app_index():
  return render_template('index.html')

@app.route('/channels/<id>')
def app_channels(id):
  return render_template('channels.html', channel_id=id)
  
