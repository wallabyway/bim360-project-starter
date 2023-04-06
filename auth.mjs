import http from 'http';
import url from 'url';
import child_process from 'child_process';
import fetch from 'node-fetch';
import { projects } from './api.mjs';
import {fileUtils} from './fileUtils.mjs';

// Class Auth
// purpose: get a 3-legged access token, from cli.
// how: launches browser, host index.html via http server, waits for oauth callback
export class auth {
	static launchBrowserForLogin() {
		child_process.exec('open http://localhost:8080/');
	}

	static async login_twolegged(KEY, SECRET) {
		const url = `https://developer.api.autodesk.com/authentication/v1/authenticate`;
		const SCOPE = encodeURIComponent("account:read account:write bucket:create bucket:read bucket:update bucket:delete data:read data:write data:create data:search user:read user:write user-profile:read viewables:read");
		
		const tokenResponse = await (await fetch( url, { 
			method: 'POST', 
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, 
			body: `grant_type=client_credentials&client_id=${ KEY }&client_secret=${ SECRET }&scope=${ SCOPE }` 
		})).json();
		return tokenResponse.access_token;
	}

	static startMiniServer(TOKEN2) {
		let TOKEN3 = null;
		const server = http.createServer(async (req, res) => {

			async function clone(TOKEN2, TOKEN3, params, res) {
				const hub_id = params.hub_id;
				let empty_project_id = await projects.alreadyExist(TOKEN2, hub_id, params.name);
				if (!empty_project_id)
					empty_project_id = await projects.createEmpty(TOKEN2, hub_id, params);
				await projects.copyTemplate(TOKEN3, params.template_project_id, empty_project_id);
				const user_id = await projects.assignSelfToProject(TOKEN2, hub_id, empty_project_id, params.admin_email);
				const template_topfolder_urn = await projects.getTopFolderURN(TOKEN2, hub_id, params.template_project_id);
				const empty_topfolder_urn = await projects.getTopFolderURN(TOKEN2, hub_id, empty_project_id);
				res.end(`Open Project: <a href="https://docs.b360.autodesk.com/projects/${empty_project_id}/${empty_topfolder_urn}/details">${params.name}</a>`);
				console.log('In the meantime, I"m copying the Files over... back soon');
				await fileUtils.copyFolderRecursively(TOKEN2, 
					params.template_project_id, template_topfolder_urn, 
					empty_project_id, empty_topfolder_urn
				);
			}

			// params : name, hub_id, template_project_id, user_email
			const params = url.parse(req.url, true).query;
			if (params.service_types) {
					console.log(params);
					try {
						await clone(TOKEN2, TOKEN3, params, res);
					}
					catch(err) {
						console.log(err);
					}
				return;
			}
			if (params.access_token) {
				console.log(`export TOKEN3=${params.access_token}`);
				TOKEN3=params.access_token;
			}
			res.writeHead(200, { 'content-type': 'text/html' });
			const indexHTML = await (await fetch( 'https://wallabyway.github.io/bim360-project-starter/index.html')).text();
			res.end(indexHTML);
		});
		server.listen(8080);
		return server;
	}
}

