import fetch  from 'node-fetch';
import { exit } from 'process';
import * as stream from 'stream';

const _header = (token) => { return {"Content-Type":"application/json", "Authorization": `Bearer ${token}`}};

export class api {
	static async login(key, secret) {
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

	static async listAccounts(token) {
		// USES 3-lEGGED
		//const url = `https://developer.api.autodesk.com/ea-api/v1/project_entitlements?service_categories=next_gen%2Cadmin&current_service_type=hq&include_services=false&include_containers=false&limit=400`;
		const url = `https://developer.api.autodesk.com/ea-api/v1/account_entitlements?service_categories=next_gen,classic,admin&include_services=true&limit=200&offset=0`;
		const data = await (await fetch(url, {headers: _header(token)} )).json();
		if (data.message) { console.table(data); exit(1)}
		return data.accounts.map( item => { return { id: item.account_id, name: item.account_display_name, region: item.region }});		
	}

	static async listProjects(token, account_id) {
		// USES 2-lEGGED
		//const url = `https://developer.api.autodesk.com/bim360/admin/v1/accounts/${account_id}/projects?limit=500&sort[]=name+asc&filter[type]=-&filter[platform]=bim360`;
		const url = `https://developer.api.autodesk.com/hq/v1/accounts/${account_id}/projects`;
		const data = await (await fetch(url, {headers: _header(token)} )).json();
		return data.map( item => { return { id: item.id, name: item.name }});		
	}


	static async postEmptyProject(token, account_id, params) {
		// USES 2-lEGGED
		const url = `https://developer.api.autodesk.com/hq/v1/accounts/${account_id}/projects`
		const res = await fetch(url, { method: 'POST', body:JSON.stringify(params), headers: _header(token) });
		const json = await res.json();
		return json;
	}

	static async patchTemplate(token, template_project_id, dst_project_id) {
		// USES 3-lEGGED
		const body = {
		    "services": [
		        { "serviceName": "projectAdministration" },
		        { "serviceName": "documentManagement" },
		        { "serviceName": "insight" }
		    ],
		    "template": { "projectId": `${template_project_id}` }
		};
		const hdr = _header(token);
		hdr["X-ADS-Region"]="US";
		const url = `https://developer.api.autodesk.com/bim360/admin/v1/projects/${dst_project_id}`;
		const res = await fetch(url, { method: 'PATCH', headers: hdr, body: JSON.stringify(body) });
		if (res.status != 202) 
			console.log(res.status,res.statusText);
		const out = await res.json();
		return out;
	}

	static async patchUserRoles(token, account_id, g_spreadsheet_url) {

		// Fetch User roles from Google spreadsheet
		// example spreadsheet:
		//  API: https://sheets.googleapis.com/v4/spreadsheets/1yxfWCfmhq-j_MC06iAoKsxNBummpjsleC6a9Ad5M6aM/values/roles?key=AIzaSyB-P6t82sJcClwhyCRhDNsiMdBTNH0BCyo
		const json = await (await fetch(g_spreadsheet_url)).json();
		json.values.slice(1).forEach( async i => await patchUser(i, i.user_id) );
		
		// import list of users into BIM 360/ACC
		async function patchUser(user_id) {
			const url = `https://developer.api.autodesk.com/hq/v2/accounts/${account_id}/users/${user_id}`;
			const res = await fetch(url, { method: 'POST', body:JSON.stringify(bimuserjson), headers: _header(token) });
			return await res.json();
		}
	}

	static async addUsersToProject(token, account_id, project_id, g_spreadsheet_url) {

		const bimuserjson = await (await fetch(g_spreadsheet_url)).json();

		// Adds users (project admin and project user) to a project
		const url = `https://developer.api.autodesk.com/hq/v2/accounts/${account_id}/projects/${project_id}/users/import`;
		const res = await fetch(url, { method: 'POST', body:JSON.stringify(bimuserjson), headers: _header(token) });
		const json = await res.json();
		return json;

	} 

	static async importUsersFromGoogleSheets(token, account_id, g_spreadsheet_url) {
		// Fetch User list from Google spreadsheet
		// example spreadsheet:
		//  Docs: https://docs.google.com/spreadsheets/d/1yxfWCfmhq-j_MC06iAoKsxNBummpjsleC6a9Ad5M6aM/edit?usp=sharing
		//  API: https://sheets.googleapis.com/v4/spreadsheets/1yxfWCfmhq-j_MC06iAoKsxNBummpjsleC6a9Ad5M6aM/values/users?key=AIzaSyB-P6t82sJcClwhyCRhDNsiMdBTNH0BCyo
		//  HowTo: setup google sheet: https://medium.com/unly-org/how-to-consume-any-json-api-using-google-sheets-and-keep-it-up-to-date-automagically-fb6e94521abd
		/*
		const g_key = 'AIzaSyB-P6t82sJcClwhyCRhDNsiMdBTNH0BCyo';
		const g_spreadsheet = '1yxfWCfmhq-j_MC06iAoKsxNBummpjsleC6a9Ad5M6aM';
		const g_tabname = 'users';
		const g_spreadsheet_url = `https://sheets.googleapis.com/v4/spreadsheets/${g_spreadsheet}/values/${g_tabname}?key=${g_key}`
		*/

		const userjson = await (await fetch(g_spreadsheet_url)).json();
		const bimuserjson = pivotJson(userjson);

		// import list of users into BIM 360/ACC
		const url = `https://developer.api.autodesk.com/hq/v1/accounts/${account_id}/users/import`;
		const res = await fetch(url, { method: 'POST', body:JSON.stringify(bimuserjson), headers: _header(token) });
		const json = await res.json();
		return json;

		function pivotJson(json) {
			let keys = json.values[0];
			let valueArray = json.values.slice(1);
			var oObj = [];
			valueArray.forEach( row => {
				var iObj = {};
				keys.forEach( (column,i) => iObj[column] = row[i])
				oObj.push(iObj);
			})
			return oObj;
		}

		function pivotJson2(json) {
			let keys = json.values[0];
			let valueArray = json.values.slice(1);
			var oObj = [];
			valueArray.forEach( row => {
				var iObj = [];
				keys.forEach( (column,i) => {
					let obj = {}
					obj[column] = row[i];
					iObj.push(obj);
				})
				oObj.push(iObj);
			})
			return oObj;
		}
		
	}
	
	static async copyfile(token, src, dst) {
		// https://github.com/node-fetch/node-fetch/blob/4d944365dfeff3ab0cb8b978c1e6fa9e3b640e2e/test/test.js#L679-L696
		const resp = await fetch(src, header(token));
		body = resp.body.pipe(new stream.PassThrough());
		await fetch(dst, { method: 'PUT' , body })
	}
}
