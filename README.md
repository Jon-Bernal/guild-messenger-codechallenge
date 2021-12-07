# Messenger App Read Me

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

## Design decisions and explanations

The challenge is to create a messaging application that will allow two people to send messages to each other. There are a number of different ways to accomplish this task with pros and cons to each. The choices I came up with on the spot were websockets, long polling, timed check-ins and peer to peer connections, there are more, but those were the easiest.

Long polling is doable but less reliable than a websocket and actually takes more time to setup than a websocket, so that was out. Timed check-ins, periodically asking the server if there are new messages and and requesting them if there are, would be simple but slower and have more overhead. A peer to peer connection is fast and light, but I am less familiar with them and hammering it out in a couple of hours would have been a challenge. Also a peer to peer connection means no storage of the conversation. Lastly websockets are fast and light but have a little extra setup and work when it comes to deploying to production with a reverse proxy and with scaling past one server but we're not actually putting this in production.

I finished the websocket server and a frontend that would send and receive messages in about an hour and was enjoying it enough I decided to bite off a bit too much. I wanted to be able to allow users to send messages to a particular user and only that user as well store the conversation history. I chose MongoDB Atlas because of how quick and simple it is to setup a database and I wouldn't have to wrangle tables and migrations throughout working on this quick project. Lastly I chose to use express for similar reasons. I am very familiar with it, however I wouldn't use it in production these days. I would be more likely to reach for something like Fastify because it is more performant.

Lastly I chose to go with as close to just websocket API as I could. I had a few reasons for doing this and most were curiosity. I have implemented a production websocket connection with graphQL using a pub/sub system and redis in the past and it has been a wonderful system. I didn't userstand as much of the system as I would like to have. I was considering using socket.io, but I felt I would learn more by trying out a mostly bare websocket api. I learned quite a bit along the way about the extra features many websocket packages bring to the table and why they're important for production applications.

### Some known bugs and limitations

- Restarts or crashes on server drops websocket connection which means everyone has to reload their web browser, which includes changing the code.
- Needs a way to limit number of concurrent websockets so it won't get overloaded with no way to fix.
- To update userlist you must reload the application. I would consider updating list using websocket if I were going to keep doing it this way. However it's bad practice to ship so much user data to the client (performance issues). I would instead make this a server side search. This was just much faster to make for a quick and dirty code challenge.
- Jest testing throws an error around the web socket. This is fixable but would take a bit more time than I had.
- I used a websocket only package which is simple but not ideal. There is no fallback or fix for when the websocket connection is severed. In the future I would use something like socket.io because it has a reconnect feature and uses long polling before upgrading to websockets, which means there is a nice fall back in case the ideal case doesn't work.

### Things to improve for a real production app

- Make one Mongodb pool of connections to reuse instead of three pools.
- Use Fastify or Adonis.js instead of Expressjs. Express is starting to show it's age unfortunately.
- Use Redis or something similar to keep track of connections across multiple servers or use a pub/sub setup with something like Graphql. I would also consider using something like [socket.io](http://socket.io/) which would have better documentation around it for a team to use.
- I considered making things less explicit when just changing a single field with the global reducer. However I prefer to think in terms of actions rather than fields that are changed in the database. If this were a long term project I would fix some of the reducer states and turn them into user actions instead which makes things much clearer. Also I would use a finite state machine wherever possible, because they're the best!
- Loading the entire user list into the client is not ideal. Should be a search feature server side rather than dumping all usernames to the client. It's slow, heavy with lots of users.
- styling is all over the place, because went for speed not for neatness, I prefer to use a single system and not css plus inline styling all over the place. I'm a fan of SCSS, SASS and LESS, but also enjoy just plain old css. Not as big of a fan of css in js, but I'd get over it if the team is using that.
- No backend routes are actually protected by the user auth, it's just really just there to gather usernames for conversations between two users and making IDs.
