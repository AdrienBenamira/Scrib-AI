
# API

## Install
Install all dependencies
```
$ npm update
```

Configure the app by renaming 
- `./config/default.example.js` into `./config/default.js`
- and `./config/config.example.json` into `./config/config.json`.

Then set the configuration files correctly

Create the database if it's not already done
```
$ node_modules/.bin/sequelize db:create
```

Migrate the database: 
```
$ node_modules/.bin/sequelize db:migrate
```

To add a default `root` / `root` user:
```
$ node_modules/.bin/sequelize db:seed:all
```

## Start the server

```
$ node index.js
```
