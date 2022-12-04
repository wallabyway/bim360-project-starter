

import http from 'http';
import fs from 'fs';
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

	static async login_twolegged(key, secret) {
		const url = `https://developer.api.autodesk.com/authentication/v1/authenticate`;
		const header = { 'Content-Type': 'application/x-www-form-urlencoded' }
		//const scope = "account:read account:write bucket:create bucket:read bucket:update bucket:delete data:read data:write data:create data:search user:read user:write user-profile:read viewables:read";
		const scope2 = "data%3Acreate%20account%3Aread%20account%3Awrite%20bucket%3Aread%20user%3Aread%20viewables%3Aread%20data%3Aread%20user-profile%3Aread%20data%3Asearch"; 
		const body = `grant_type=client_credentials&client_id=${key}&client_secret=${secret}&scope=${scope2}`;
		//const body = `grant_type=client_credentials&client_id=${key}&client_secret=${secret}&scope=${encodeURIComponent(scope)}`;
		const resp = await fetch( url, { method: 'POST', headers: header, body: body });
		const json = await resp.json();
		return json.access_token;
	}

	static startMiniServer() {
		const server = http.createServer((req, res) => {

			const params = url.parse(req.url, true).query;
			if (params.access_token) {
				console.log(`export TOKEN3=${params.access_token}`);
				process.env['TOKEN3']=params.access_token;
			}
			res.writeHead(200, { 'content-type': 'text/html' });
			fs.createReadStream('https://wallabyway.github.io/bim360-project-starter/index.html').pipe(res);
		});
		server.listen(8080);
		return server;
	}
}

