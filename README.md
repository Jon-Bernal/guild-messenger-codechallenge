# Messenger App Read Me

## View Live

I plan to try and throw this on a "production" test server for fun over the weekend. I can't guarantee I'll get to it, but hopefully you'll be able to see a live example running [here](https://jonbernal.com/)

## To Install and Run Locally

### Requirements:

- Node version 16.5.0 installed
- Git installed
- A Mongo Atlas account (or local database setup). This is free for small databases and super easy to setup [here](https://www.mongodb.com/cloud/atlas/register?utm_content=rlsapostreg&utm_source=google&utm_campaign=gs_americas_uscan_search_brand_dsa_atlas_desktop_rlsa_postreg&utm_term=&utm_medium=cpc_paid_search&utm_ad=&utm_ad_campaign_id=14383025495&adgroup=129270225274&gclid=Cj0KCQiAnaeNBhCUARIsABEee8W77aYGjMTHqQo-JpRvi7I_dUZlpXhJ64I4GFX3h-bPhGPLDcgZhQIaAmUnEALw_wcB)

### Steps

- git clone from repo
- fill in backend .env file in same directory as .env.example. Follow the .env.example to fill in the .env file
- mkdir backend/.env file in same directory as .env.example. Follow the .env.example to fill in the .env file
- make client/src/config/clientConfig.js with info same as example file in same directory
- make installClient
- make installBackend
- open two terminals or splits
- set node to version 16.5.0
- whitelist your ip with mongodb atlas (if you're using the service)
- terminal 1: cd backend
- terminal 1: npm run dev
- terminal 2: cd client
- terminal 2: npm start

### Things to improve for a real production app

- Make one mongodb pool of connections to reuse instead of three pools.
- Use Fastify or Adonis.js instead of Expressjs. Express is starting to show it's age unfortunately.
- Use redis or something similar to keep track of connections across multiple servers or use a pub/sub setup with something like graphql. I would also consider using something like [socket.io](http://socket.io/) which would have better documentation around it for a team to use.
- I considered making things less explicit when just changing a single field with the global reducer. However I prefer to think in terms of actions rather than fields that are changed in the database. If this were a long term project I would fix some of the reducer states and turn them into user actions instead which makes things much clearer. Also I would use a finite state machine wherever possible, because they're the best!
- Loading the entire user list into the client is not ideal. Should be a search feature server side rather than dumping all usernames to the client. It's slow, heavy with lots of users.
- styling is all over the place, because went for speed not for neatness, I prefer to use a single system and not css plus inline styling all over the place. I'm a fan of SCSS, SASS and LESS, but also enjoy just plain old css. Not as big of a fan of css in js, but I'd get over it if the team is using that.
- No backend routes are actually protected by the user auth, it's just really just there to gather usernames for conversations between two users and making IDs.

### Some known bugs and limitations

- Restarts or crashes on server drops websocket connection which means everyone has to reload their web browser, which includes changing the code.
- Needs a way to limit number of concurrent websockets so it won't get overloaded with no way to fix.
- To update userlist you must reload the application. I would consider updating list using websocket if I were going to keep doing it this way. However it's bad practice to ship so much user data to the client (performance issues). I would instead make this a server side search. This was just much faster to make for a quick and dirty code challenge.
- Jest testing throws an error around the web socket. This is fixable but would take a bit more time than I had.

## Design decisions and explanations
