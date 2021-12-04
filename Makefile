installClient:
	cd client && npm install
installBackend:
	cd backend && npm install
buildClient:
	cd client && npm run build
buildBackend:
	cd backend && npm run build
stopAll:
	caddy stop
	pm2 stop all
deploy:
	make stopAll
	make installClient
	make installBackend
	make buildClient
	make buildBackend
	caddy run --config ./client/Caddyfile
	cd backend && pm2 start server.js