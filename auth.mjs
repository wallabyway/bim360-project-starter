import http from 'http';
import url from 'url';
import child_process from 'child_process';
import fetch from 'node-fetch';

// Class Auth
// purpose: get a 3-legged access token, from cli.
// how: launches browser, host index.html via http server, waits for oauth callback
export class auth {
	static launchBrowserForLogin() {
		child_process.exec('open http://localhost:8080/');
	}

	static async login_twolegged(KEY, SECRET) {
		const url = `https://developer.api.autodesk.com/authentication/v1/authenticate`;
		const SCOPE = encodeURIComponent("data:create account:read account:write bucket:read user:read viewables:read data:read user-profile:read data:search");
		const tokenResponse = await (await fetch( url, { 
			method: 'POST', 
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, 
			body: `grant_type=client_credentials&client_id=${ KEY }&client_secret=${ SECRET }&scope=${ SCOPE }` 
		})).json();
		return tokenResponse.access_token;
	}

	static startMiniServer() {
		const server = http.createServer(async (req, res) => {

			const params = url.parse(req.url, true).query;
			if (params.access_token) {
				console.log(`export TOKEN3=${params.access_token}`);
				process.env['TOKEN3']=params.access_token;
			}
			res.writeHead(200, { 'content-type': 'text/html' });
			const indexHTML = await (await fetch( 'https://wallabyway.github.io/bim360-project-starter/index.html')).text();
			res.end(indexHTML);
		});
		server.listen(8080);
		return server;
	}
}

