# Fullstack Arcade webapp

TODO

# Development notes

- Ensure installed globally:
  - `nodejs`
  - `npm`
  - `nodemon`

- Installing node_modules after cloning:
  - run `npm install` in:
    - ./
    - ./arcade-frontend/
    - ./arcade-backend/

- hosting frontend on localhost:
  - run `npm run dev` in ./arcade-frontend/

- starting the server:
  - run `pm2 start server.js --name arcade-backend` in ./arcade-backend/
  - note: `pm2 list` to show running servers and `pm2 delete <name>` to delete.

# Common Errors

- `injecting env (0) from .env`
  - ensure that the .env files exist in the appropriate location(s).

- For hosting frontend on production, ensure that `/etc/nginx/sites-available/sites-available` contains correct paths.
  - If modified, `systemctl restart nginx`.
