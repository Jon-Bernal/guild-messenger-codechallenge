installClient:
	cd client && npm install
installBackend:
	cd backend && npm install
buildClient:
	cd client && npm run build
stopAll:
	caddy stop
	pm2 stop all
deploy:
	make stopAll
	make installClient
	make installBackend
	make buildClient
	caddy run --config ./client/Caddyfile
	cd backend && pm2 start server.js