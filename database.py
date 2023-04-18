import json

class Database:
  def __init__(self, route='database.json'):
    self.route = route

  def load(self):
    return json.loads(open(self.route, 'r').read())

  def save(self, data: dict):
    with open(self.route, 'w') as file:
      file.write(json.dumps(data, indent=2))

  def set(self, key, value):
    data = self.load()
    data[key] = value
    self.save(data)

  def delete(self, key):
    data = self.load()
    del data[key]
    self.save(data)
