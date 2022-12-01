import fetch  from 'node-fetch';

const _header = (token) => { return {"Content-Type":"application/json", "Authorization": `Bearer ${token}`}};
const delay = ms => new Promise(res => setTimeout(res, ms));

export class projects {
	static async showHubs(token) {
		// USES 3-lEGGED
		//const url = `https://developer.api.autodesk.com/ea-api/v1/project_entitlements?service_categories=next_gen%2Cadmin&current_service_type=hq&include_services=false&include_containers=false&limit=400`;
		const url = `https://developer.api.autodesk.com/ea-api/v1/account_entitlements?service_categories=next_gen,classic,admin&include_services=true&limit=200&offset=0`;
		const data = await (await fetch(url, {headers: _header(token)} )).json();
		if (data.message) { console.table(data); process.exit(1)}
		return data.accounts.map( item => { return { id: item.account_id, name: item.account_display_name, region: item.region }});		
	}

	static async list(token, account_id) {
		// USES 2-lEGGED
		//const url = `https://developer.api.autodesk.com/bim360/admin/v1/accounts/${account_id}/projects?limit=500&sort[]=name+asc&filter[type]=-&filter[platform]=bim360`;
		const url = `https://developer.api.autodesk.com/hq/v1/accounts/${account_id}/projects`;
		const data = await (await fetch(url, {headers: _header(token)} )).json();
		return data.map( item => { return { id: item.id, name: item.name }});		
	}

	static async createEmpty(token, account_id, user_email, params) {
		// USES 2-lEGGED
		const url = `https://developer.api.autodesk.com/hq/v1/accounts/${account_id}/projects`
		const res = await fetch(url, { method: 'POST', body:JSON.stringify(params), headers: _header(token) });
		const project_id = (await res.json()).id;
		//wait project status = active: 
		// https://developer.api.autodesk.com/hq/v1/accounts/:account_id/projects/:project_id
		let status = "pending";
		while (status != "active") {
			await delay(2000);
			const res1 = await fetch(`https://developer.api.autodesk.com/hq/v1/accounts/${account_id}/projects/${project_id}`, { headers: _header(token) });
			status = (await res1.json());
			console.log(res1);
			console.log(`Waiting on new Project Status: ${status}`)
		};
		await delay(2000);
		const folder_id = await this.getTopFolderID(token, account_id, project_id)
		const company_id = await this.getCompanyIDFromProject(token, account_id, project_id);
		const user_id = await this.assignSelfToProject(token, account_id, company_id, user_email );
		return [project_id, folder_id];
	}

	static async assignSelfToProject(token, account_id, company_id, user_email) {
		const body = {
			"role": "project_admin",
			"service_type": "doc_manager",
			"company_id":company_id,
			"email":user_email
		};
		const res = await fetch(`https://developer.api.autodesk.com/hq/v1/accounts/${account_id}/projects/${project_id}/users`, { 
			method: 'POST', headers: { headers: _header(token) }, body: JSON.stringify(body) });
		const user = (await res.json());
		await delay(2000);
		return user.id;
	}

	static async getTopFolderID(token, account_id, project_id) {
		const res = await (await fetch(`https://developer.api.autodesk.com/project/v1/hubs/${account_id}/projects/${project_id}/topFolders&projectFilesOnly=true&excludeDeleted=true`, { headers: _header(token) })).json();
		debugger;
		return res.data[0].id;
	}

	static async getCompanyIDFromProject(token, account_id, project_id) {
		const res = await (await fetch(`https://developer.api.autodesk.com/hq/v1/accounts/${account_id}/projects/${project_id}/companies?limit=1&offset=0`, { headers: _header(token) })).json();
		debugger;
		return res[0].id;
	}

	

		

	static async copyTemplate(token, template_project_id, dst_project_id) {
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
		await delay(10000);
		return out;
	}

	static async addUserRoles(token, token2, account_id, project_id, g_spreadsheet_url) {

		const industryroles = await (await fetch(`https://developer.api.autodesk.com/hq/v2/accounts/${account_id}/projects/${project_id}/industry_roles`, {headers: _header(token)})).json();
		const role2idmap = Object.fromEntries(industryroles.map(e => [e.name, e.id]))
		console.table(role2idmap);		

		const roles = this.pivotJson(await (await fetch(g_spreadsheet_url)).json());
		roles.forEach(i => {
			i.industry_roles = [role2idmap[i.industry_roles]];
			i.services = {document_management: { access_level: "user" }};
		})
		console.table(roles);

		// Adds users (project admin and project user) to a project
		const url = `https://developer.api.autodesk.com/hq/v2/accounts/${account_id}/projects/${project_id}/users/import`;
		const res = await fetch(url, { method: 'POST', body:JSON.stringify(roles), headers: _header(token) });
		const json = await res.json();
		const email2accountid = Object.fromEntries(json.success_items.map(e => [e.email, e.account_id]));
		if (json.failure_items.length) json.failure_items = json.failure_items[0].errors[0]
		if (json.success_items.length) json.success_items = `${json.success_items[0].email}, etc... ${json.success_items.length} users added`
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

		const users = this.pivotJson(await (await fetch(g_spreadsheet_url)).json());

		// import list of users into BIM 360/ACC
		const url = `https://developer.api.autodesk.com/hq/v1/accounts/${account_id}/users/import`;
		const res = await fetch(url, { method: 'POST', body:JSON.stringify(users), headers: _header(token) });
		const json = await res.json();
		return json;		
	}

	static pivotJson(json) {
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
}

/*
		/*
		// Sometimes BIM360 is partially updated and roles are missing.  Kick the server, by triggering a patch to each user. 
		async function patchUserRole(user, email2accountid) {
			const user_id = email2accountid[user.email];
			const url = `https://developer.api.autodesk.com/hq/v2/accounts/${account_id}/projects/${project_id}/users/${user_id}`;
			const body = {industry_roles: user.industry_roles , "company_id": "69e416fe-5dad-46a2-ad29-221aa00452a0"};
			const res = await fetch(url, { method: 'PATCH', body:JSON.stringify(body), headers: _header(token) });
			const json = await res.json();
			console.log(json);
		}		
		roles.forEach( async user => await patchUserRole(user, email2accountid));

	static async addUsers_old(token, account_id, g_spreadsheet_url) {

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
*/
