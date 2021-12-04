installClient:
	cd client && npm install && cd ..
installBackend:
	cd backend && npm install && cd ..
buildClient:
	cd client && npm run build && cd ..
stopAll:
	caddy stop
	pm2 stop all
startServices:
	pm2 start ./backend/server.js
	caddy run --config ./client/Caddyfile
deploy:
	make stopAll
	make installClient
	make installBackend
	make buildClient
	make startServices