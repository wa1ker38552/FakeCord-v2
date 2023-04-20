# FakeCord-v2
*A newer development of https://github.com/wa1ker38552/fakecord*

FakeCord is a custom web client for Discord which uses Flask as a framework and Python as the backend. Javascript is used to render content.

**Notes 📝**
- This project is still in development so not all features from [FakeCord](https://github.com/wa1ker38552/fakecord) are ported / things might not work
- You **have** to clone your own instance for it to work because of rate limits
- Most small features will not be ported through because they take too much time and aren't needed as part of Discord's core functionality
- ⚠️ This project would be considered a 'selfbot', use at your own risk

**Setup ⚙️** (Replit deployment recommended)

1. Clone this repository `git clone https://github.com/wa1ker38552/fakecord-v2`

Replit Deployment
3. Create a new environmental variable with the key as `TOKEN` and the value as your discord *Authorization* token, ctrl/cmd+shift+i -> Network -> (click a random channel on discord) -> messages?limit=50 -> Headers -> Request Headers -> Authorization
4. Run the program

Replit Deployment
3. Change the client initialization in `api.py` and `main.py` for the Discord client and the requests client to your token.
4. Run the program, should be running at https://0.0.0.0:8080

**Whats New ⭐**
- Config files to load proxy images and change image resolutions
- Visual improvments
- Support for message events, no more reloading to show new messages!
- More versatile backend to handle exceptions and events
- Content rendered by JS instead of Jinja
- Fully working API

![image](https://user-images.githubusercontent.com/100868154/232855897-4cd42745-f46e-4b8e-8b09-55074cc2bd46.png)

