
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

## Migrate the database
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

## API Routes

All `/user/*` or `/users/*` routes need a valid basic auth header, meaning that 
the user must exist in the database.

If you seeded the database with the `root` / `root` user, you can just
these values.

### Login user
`GET /user/login`

### Add a user
`POST /user`

#### Body
```json
{
  "username": "value",
  "password": "value"
}
```

### Get all users
`GET /users`

### Delete a user
`DELETE /user?username=value`

### Summarize an article
`POST /summarization`

#### Body
```json
{
  "article": "lorem ipsum...",
  "ratio": 0.4 
}
```
*ratio is the summarization ratio*

### Summarize from URL
`POST /summarize_site`

#### Body
```json
{
  "article": "url",
  "ratio": 0.4 
}
```
*ratio is the summarization ratio*

### Save a summary to database
`POST /summary/store?edited=1`
```json
{
  "summary": {
    "content": "lorem...",
    "grade": 3,
    "isAccepted": true,
    "userVersion": "lorem edited version..."
  },
  "article": {
    "fullText": "lorem ipsum..."
  }
}
```

*If edited is 1, the user has edited the generated version.*

### Search summary
`GET /user/summary`

#### URL Queries
 - `grade` filter by grade
 - `isIncorrect`
 - `date` format YYYY-MM-DD
 - `category` category of the linked article
 - `keywords` joined by +, keywords of the linked article
 - `count` count the number of summaries, grouped by grades
 - `id` select by summary id
 - `articleId` select by linked article ID
 - `fullText` select by part of given fulltext
 - `isGenerated` select only generated summaries 

### Search article
`GET /user/article`

#### URL Queries
 - `date` format YYYY-MM-DD
 - `category` category of the linked article
 - `keywords` joined by +, keywords of the linked article
 - `id` select by article id
 - `summaryId` select by linked summary ID
 - `fullText` select by part of given fulltext
 - `isGenerated` select only generated summaries 
