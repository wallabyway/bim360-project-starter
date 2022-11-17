#!/usr/bin/env node

import { program } from 'commander';
import { api } from './api.mjs';

/*
Commands:
  login <key> <secret>                                 gets 2-legged access token, using forge key & forge secret
  listaccounts                                         list all ACC/BIM 360 account IDs.  The new Project you will create, will go under this Account ID
  listprojects                                         list BIM 360 Project Templates.  You will create a new Project from one of these existing Project templates
  createproject <project_name>                         create a new Project, returns a projectID
  copytemplate <template_project_id> <new_project_id>  copy template folders/roles, into new Project
  importusers <spreadsheet_id>                         import users from google spreadsheet, into bim360
  copyfiles <template_project_id> <new_project_id>     recursively copy files from template folder into destination folder
  createworksharing <folder_id>                        create a new Revit cloud worksharing file in a folder
  help [command]                                       display help for command
*/

const { TOKEN2, TOKEN3, ACCOUNT_ID } = process.env;
if (!TOKEN2 && (process.argv[2]!="login")) {
    console.warn('TOKEN is missing.  Please login and set the TOKEN environment variable. ie. export TOKEN2=1234; export TOKEN3=1234');
    process.exit(1);
}


program
.command('login <key> <secret>')
.description('gets 2-legged with forge key/secret + get 3-legged access tokens via browser and BIM360/ACC login page')
.action(async (key, secret) => {
  child_process.exec('open http://localhost:8080/');
  const token = await api.login(key, secret);
  console.log(`2 legged login successful.  now add TOKEN2 to your environment, like this...`);
  console.log(`export TOKEN2=${token};`);
});


program
  .command('listaccounts')
  .description('list all ACC/BIM 360 account IDs.  The new Project you will create, will go under this Account ID')
  .action(async () => {
    console.table(await api.listAccounts(TOKEN3));
	console.log('export ACCOUNT_ID= <pick one^^^>');
  });


program
  .command('listprojects')
  .description('list BIM 360 Project Templates.  You will create a new Project from one of these existing Project templates')
  .action(async () => {
    console.table(await api.listProjects(TOKEN2, ACCOUNT_ID));
});


program
  .command('createproject <project_name>')
  .description('create a new Project, returns a projectID')
  .action(async (project_name) => {
	const defaults = {
		"name": project_name,
		"service_types":"inSight", //doc_manager
		"start_date": "2023-05-02",
		"end_date": "2024-04-03",
		"project_type": "Wind Farm",
		"value": 3000,
		"city": "New York",
		"state_or_province": "New York",
		"postal_code": "10011",
		"country": "United States",
		"timezone": "America/New_York",
		"language": "en",
		"currency": "USD"
		/*
		"job_number": "0219-01",
		"address_line_1": "The Fifth Avenue",
		"address_line_2": "#301",
		"construction_type": "Wind Farm",
		"contract_type": "Design-Bid",
		*/
	};	
	const result = await api.postEmptyProject(TOKEN2, ACCOUNT_ID, defaults);
    console.table(result);
    console.log(`created project.  Project_ID is: ${result.id}`);
});


program
  .command('copytemplate <new_project_id> <template_project_id>')
  .description('copy template folders/roles, into new Project')
  .action(async (new_project_id, template_project_id) => {
 	const res = await api.patchTemplate(TOKEN3, template_project_id, new_project_id);
    console.table(res);
 });

 program
  .command('importusers <g_spreadsheet_url>')
  .description('import users from google spreadsheet, into a bim360 hub')
  .action(async (g_spreadsheet_url) => {
 	const res = await api.importUsersFromGoogleSheets(TOKEN2, ACCOUNT_ID, g_spreadsheet_url);
    console.table(res);
 });

 program
  .command('adduserstoproject <project_id> <g_spreadsheet_url>')
  .description('Adds users (project admin and project user) to a project, from google spreadsheet')
  .action(async (project_id, g_spreadsheet_url) => {
 	const res = await api.addUsersToProject(TOKEN2, ACCOUNT_ID, project_id, g_spreadsheet_url);
    console.table(res);
 });

 program
 .command('patchuserroles <g_spreadsheet_url>')
 .description('patch user roles, from google spreadsheet, into bim360')
 .action(async (g_spreadsheet_url) => {
	const res = await api.patchUserRoles(TOKEN2, ACCOUNT_ID, g_spreadsheet_url);
   console.table(res);
});



program
  .command('copyfiles <template_project_id> <new_project_id>')
  .description('recursively copy files from template folder into destination folder')
  .action((template_project_id, new_project_id) => {
    console.log(`recursively copied files from Template Folder ${template_project_id} to Project Folder ${new_project_id}... done`);
  });


program
  .command('createworksharing <folder_id>')
  .description('create a new Revit cloud worksharing file in a folder')
  .action((folder_id) => {
    console.log(`worksharing Revit file created into folderID ${folder_id}`);
  });

program.parse(process.argv);


// --------------------------------------
// activate a mini server, for login page
import http from 'http';
import fs from 'fs';
import url from 'url';
import child_process from 'child_process';

if (process.argv[2]=="login") {
	const server = http.createServer((req, res) => {
		const params = url.parse(req.url, true).query;
		if (params.access_token) {
			console.log(`export TOKEN3=${params.access_token}`);
			process.env['TOKEN3']=params.access_token;
			process.exit(1);
		}
		res.writeHead(200, { 'content-type': 'text/html' });
		fs.createReadStream('index.html').pipe(res);
	});
	server.listen(8080);
}
