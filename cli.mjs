#!/usr/bin/env node

import { program } from 'commander';
import { projects } from './api.mjs';
import {auth} from './auth.mjs';
import {fileUtils} from './fileUtils.mjs';

const { TOKEN2, TOKEN3, ACCOUNT_ID } = process.env;
const delay = ms => new Promise(res => setTimeout(res, ms));

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


if (process.argv[2]=="login") {
	const server = auth.startMiniServer();
} else if (!TOKEN2) {
    console.warn('TOKEN is missing.  Please login and set the TOKEN environment variable. ie. export TOKEN2=1234; export TOKEN3=1234');
    process.exit(1);
}

program
.command('login <key> <secret>')
.description('gets 2-legged with forge key/secret + get 3-legged access tokens via browser and BIM360/ACC login page')
.action(async (key, secret) => {
	auth.launchBrowserForLogin();
	const token = await auth.login_twolegged(key, secret);
	console.log(`2 legged login successful.  now add TOKEN2 to your environment, like this...`);
	console.log(`export TOKEN2=${token};`);
});


program
  .command('listaccounts')
  .description('list all ACC/BIM 360 account IDs.  The new Project you will create, will go under this Account ID')
  .action(async () => {
    console.table(await projects.showHubs(TOKEN3));
	console.log('export ACCOUNT_ID= <pick one^^^>');
  });


program
  .command('listprojects')
  .description('list BIM 360 Project Templates.  You will create a new Project from one of these existing Project templates')
  .action(async () => {
    console.table(await projects.list(TOKEN2, ACCOUNT_ID));
});

program
  .command('masterCreate <project_name> <template_project_id> <user_email>')
  .description('list BIM 360 Project Templates.  You will create a new Project from one of these existing Project templates')
  .action(async (project_name, template_project_id, user_email) => {
	defaults.name = project_name;
	const empty_project_id = await projects.createEmpty(TOKEN2, ACCOUNT_ID, defaults);
	await projects.copyTemplate(TOKEN3, template_project_id, empty_project_id);
	const user_id = await projects.assignSelfToProject(TOKEN2, ACCOUNT_ID, empty_project_id, user_email);
	const template_topfolder_urn = await projects.getTopFolderURN(TOKEN2, ACCOUNT_ID, template_project_id);
	// has template been fully copied over yet ?
	const empty_topfolder_urn = await projects.getTopFolderURN(TOKEN2, ACCOUNT_ID, empty_project_id);
	console.log('Copying Files...')
	await fileUtils.copyFolderRecursively(TOKEN2, 
		template_project_id, template_topfolder_urn, 
		empty_project_id, empty_topfolder_urn
  	);
	delay(10000);
	console.log("finished");
});

const defaults = {
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
};	


program
  .command('createproject <project_name>')
  .description('create a new Project, returns a projectID')
  .action(async (project_name) => {
	defaults.name = project_name;
	const project_id = await projects.createEmpty(TOKEN2, ACCOUNT_ID, defaults);
    console.log(`created project.  Project_ID is: ${project_id}`);
});


program
  .command('copytemplate <new_project_id> <template_project_id>')
  .description('copy template folders/roles, into new Project')
  .action(async (new_project_id, template_project_id) => {
 	const res = await projects.copyTemplate(TOKEN3, template_project_id, new_project_id);
    console.table(res);
 });

 program
  .command('importusers <g_spreadsheet_url>')
  .description('import users from google spreadsheet, into a bim360 hub')
  .action(async (g_spreadsheet_url) => {
 	const res = await projects.importUsersFromGoogleSheets(TOKEN2, ACCOUNT_ID, g_spreadsheet_url);
    console.table(res);
 });

 program
  .command('assignusers <project_id> <g_spreadsheet_url>')
  .description('Assign users to a project, from google spreadsheet')
  .action(async (project_id, g_spreadsheet_url) => {
 	const res = await projects.addUserRoles(TOKEN3, TOKEN2, ACCOUNT_ID, project_id, g_spreadsheet_url);
    console.table(res);
 });



program
  .command('copyfiles <srcFolderURL> <dstFolderURL>')
  .description('copy files in root folder of template into destination project root folder')
  .action(async (srcFolderURL, dstFolderURL) => {
	const res = await fileUtils.copyFiles(TOKEN2, srcFolderURL, dstFolderURL);
    console.table(res);
    console.log(`finished copying files`);
  });


program
  .command('createworksharing <folder_id>')
  .description('create a new Revit cloud worksharing file in a folder')
  .action((folder_id) => {
    console.log(`WIP - worksharing Revit file created into folderID ${folder_id}`);
  });

program.parse(process.argv);


