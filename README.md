# Boba Time
A web-based interface for a boba shop database with CRUD functionality (Create Read Update Delete).

- Local: http://localhost:54321/
- Flip: http://flip3.engr.oregonstate.edu:54321/

## Database Design
!place schema/erd here

## How to Develop / Start from Scratch
Install dependencies:
```bash
npm install
```

Run with command (you should see a link to open site):
```bash
npm run start
```
Or to run in developer mode (changes update with saves)
```bash
npm run dev
```

1. Source/make sure the DDL.sql is loaded into a database
2. Pick a port to connect to
3. Run `app.js` and open either link (flip link is specifically if on VPN)
- Assumption is that server is running on `flip3`

## How to Launch on Server
Run below (ignore warnings):
```bash
forever start app.js
# or if not aliased...
./node_modules/forever/bin/forever start app.js
```
To stop:
```bash
forever stop app.js
# or if not aliased...
./node_modules/forever/bin/forever stop app.js
```

## Resources
+ [Express Guide](https://expressjs.com/en/guide/routing.html)
+ [Handlebars Guide](https://handlebarsjs.com/guide/)
  + [Partials and compiling templates](https://handlebarsjs.com/installation/precompilation.html#getting-started)
+ [SVG 101](https://www.aleksandrhovhannisyan.com/blog/svg-tutorial-how-to-code-svg-icons-by-hand/)
+ [Fonts](https://fonts.google.com/)
+ [JS Logs](https://dmitripavlutin.com/console-log-tips/)
+ [Git Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
+ [Git Troubleshoot](https://ohshitgit.com/)
