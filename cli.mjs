#!/usr/bin/env node

import { program } from 'commander';
import { projects } from './api.mjs';
import {auth} from './auth.mjs';
import {fileUtils} from './fileUtils.mjs';

const { KEY, SECRET, TOKEN3, HUB_ID } = process.env;
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

if (!KEY && !SECRET) {
    console.warn('KEY and SECRET are missing.  Please run the command line, export KEY=1234; export SECRET=1234 and try again');
    process.exit(1);
}

const TOKEN2 = await auth.login_twolegged(KEY, SECRET);

if (process.argv[2]=="login") {
	const server = auth.startMiniServer(TOKEN2);
}

program
.command('login')
.description('Opens a browser where you login via BIM360/ACC.  This gets the 3-legged token needed by the create template API.')
.action(async () => {
	auth.launchBrowserForLogin();
});


program
  .command('listhubs')
  .description('list all ACC/BIM 360 hubs and their IDs.')
  .action(async () => {
    console.table(await projects.showHubs(TOKEN2));
	console.log('export HUB_ID= <pick one^^^>');
  });


program
  .command('listprojects <hub_id>')
  .description('list BIM 360 Projects and Template IDs.  Use this to pick your Template ID')
  .action(async (hub_id) => {
    console.table(await projects.list(TOKEN2, hub_id));
});

program
  .command('masterCreate <hub_id> <project_name> <template_project_id> <user_email>')
  .option('--params <string>', 'default json parameters', '{"service_types":"inSight","start_date":"2023-05-02","end_date":"2024-04-03","project_type":"Wind Farm","value":3000,"city":"New York","state_or_province":"New York","postal_code":"10011","country":"United States","timezone":"America/New_York","language":"en","currency":"USD"}')
  .description('creates a new project, and copies template IDs folders and files. assigns user_email as project-admin')
  .action(async (hub_id, project_name, template_project_id, user_email, options) => {
	let params = JSON.parse(options.params);
	params.name = project_name;
	console.log(params);
	const empty_project_id = await projects.createEmpty(TOKEN2, hub_id, params);
	await projects.copyTemplate(TOKEN3, template_project_id, empty_project_id);
	const user_id = await projects.assignSelfToProject(TOKEN2, hub_id, empty_project_id, user_email);
	const template_topfolder_urn = await projects.getTopFolderURN(TOKEN2, hub_id, template_project_id);
	// has template been fully copied over yet ?
	await delay(8000);
	console.log(`waiting for Docs to activate, before retrieving TopFolderURN )`);
	const empty_topfolder_urn = await projects.getTopFolderURN(TOKEN2, hub_id, empty_project_id);

	console.table({"click this link to open new Project":`https://docs.b360.autodesk.com/projects/${empty_project_id}/folders/${empty_topfolder_urn}/detail`});

	console.log(`now copy the files over with this command... (note: it's prone to failing, so it's now a seperate command)`);
	console.log(`bim360cli copyfilesAlt ${template_project_id} ${template_topfolder_urn} ${empty_project_id} ${empty_topfolder_urn}`);
});

program
  .command('copyfilesAlt <template_project_id> <template_topfolder_urn> <empty_project_id> <empty_topfolder_urn>')
  .description('copy files in root folder of template into destination project root folder')
  .action(async (template_project_id, template_topfolder_urn, empty_project_id, empty_topfolder_urn) => {
    console.log(`STARTED copying files`);
	await fileUtils.copyFolderRecursively(
		TOKEN2, template_project_id, template_topfolder_urn, empty_project_id, empty_topfolder_urn
  	);
	await delay(500);
    console.log(`Please wait...copying files`);
  });

program
  .command('createproject <project_name>')
  .description('create a new Project, returns a projectID')
  .action(async (project_name) => {
	defaults.name = project_name;
	const project_id = await projects.createEmpty(TOKEN2, HUB_ID, defaults);
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
 	const res = await projects.importUsersFromGoogleSheets(TOKEN2, HUB_ID, g_spreadsheet_url);
    console.table(res);
 });

 program
  .command('assignusers <project_id> <g_spreadsheet_url>')
  .description('Assign users to a project, from google spreadsheet')
  .action(async (project_id, g_spreadsheet_url) => {
 	const res = await projects.addUserRoles(TOKEN3, TOKEN2, HUB_ID, project_id, g_spreadsheet_url);
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


