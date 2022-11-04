import fetch  from 'node-fetch';
import * as stream from 'stream';

const header = (token) => { return { headers: {"Authorization": `Bearer ${token}`}}};


export class api {

	static async accounts(token) {
		const url = `https://developer.api.autodesk.com/ea-api/v1/account_entitlements?service_categories=next_gen,classic,admin&include_services=true&limit=200&offset=0`;
		const data = await (await fetch(url, header(token) )).json();
		return data.accounts.map( item => { return { id: item.account_id, name: item.account_display_name, region: item.region }});		
		return data.accounts;
	}

	static async projects(token, account_id = "a4f95080-84fe-4281-8d0a-bd8c885695e0") {
		//return foods;
		/*
		url:  `https://admin.b360.autodesk.com/accounts/${account_id}/project_names.json?locale=en`
		url2: https://developer.api.autodesk.com/bim360/admin/v1/accounts/${account_id}/projects?limit=100&sort[]=name+asc&filter[type]=-&filter[platform]=bim360&filter[status]=active&filter[serviceName]=documentManagement 
		url3: https://developer.api.autodesk.com/hq/v1/accounts/${account_id}/projects
		url4: https://developer.api.autodesk.com/ea-api/v1/project_entitlements?service_categories=next_gen%2Cadmin&current_service_type=hq&include_services=false&include_containers=false&limit=200
		*/
		const url = `https://developer.api.autodesk.com/bim360/admin/v1/accounts/${account_id}/projects?limit=500&sort[]=name+asc&filter[type]=-&filter[platform]=bim360&filter[status]=active&filter[serviceName]=documentManagement`;
		const data = await (await fetch(url, header(token) )).json();
		return data.results.map( item => { return { id: item.id, name: item.name }});		
	}

	static async template(token, src_project_id, dst_project_id) {
		const body = {
		    "services": [
		        { "serviceName": "projectAdministration" },
		        { "serviceName": "documentManagement" },
		        { "serviceName": "insight" }
		    ],
		    "template": { "projectId": `${src_project_id}` }
		};

		const url = `https://developer.api.autodesk.com/bim360/admin/v1/projects/${dst_project_id}`;
		await fetch(dst, { method: 'PATCH', body: JSON.stringify(body) });
		return id;
	}


	static async copyfile(token, src, dst) {
		// https://github.com/node-fetch/node-fetch/blob/4d944365dfeff3ab0cb8b978c1e6fa9e3b640e2e/test/test.js#L679-L696
		const resp = await fetch(src, header(token));
		body = resp.body.pipe(new stream.PassThrough());
		await fetch(dst, { method: 'PUT' , body })
	}
}
