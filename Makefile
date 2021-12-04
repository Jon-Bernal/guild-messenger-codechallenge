installClient:
	cd client && npm install
installBackend:
	cd backend && npm install
buildClient:
	cd client && npm run build
buildBackend:
	cd backend && npm run build
deploy:
	caddy run --config ./client/Caddyfile
	cd backend && pm2 start server.js