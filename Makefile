installClient:
	cd client && npm install
installBackend:
	cd backend && npm install
buildClient:
	cd client && npm run build
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