# FakeCord-v2
*A newer development of https://github.com/wa1ker38552/fakecord*

**Developement halted as Autocord is finished so that it can provide support for FakeCord (Unable to use Discord py)**
Uses Flask as a framework and Python as the backend. Javascript is used to render content.

**Notes 📝**
- This project is still in development so not all features from [FakeCord](https://github.com/wa1ker38552/fakecord) are ported / things might not work
- You **have** to clone your own instance for it to work because of rate limits
- Most small features will not be ported through because they take too much time and aren't needed as part of Discord's core functionality
- ⚠️ This project would be considered a 'selfbot', use at your own risk

**Setup ⚙️**
1. Clone this repository `git clone https://github.com/wa1ker38552/fakecord`
2. Create a new environmental variable with the key as `TOKEN` and the value as your discord *Authorization* token, ctrl/cmd+shift+i -> Network -> (click a random channel on discord) -> messages?limit=50 -> Headers -> Request Headers -> Authorization
3. Create a new environmental variable with the key as `SBTOKEN` and the value as your discord token, ctrl/cmd+shift+i -> Application -> Local Storage -> `https://discord.com` -> token
4. Run the program, should be on https://0.0.0.0:8080

**Whats New ⭐**
- Visual improvments
- Support for message events, no more reloading to show new messages!
- More versatile backend to handle exceptions and events
- Content rendered by JS
- Fully working API
