#!/usr/bin/env node

// const { Command } = require('commander'); // (normal include)
import { program } from 'commander';
import { api } from './api.mjs';

const { TOKEN, ACCOUNT_ID } = process.env;
if (!TOKEN) {
    console.warn('Please set the TOKEN & ACCOUNT_ID environment variables. ie. export TOKEN=1234; export ACCOUNT_ID=2323');
    process.exit(1);
}

program
  .command('list')
  .description('list BIM 360 Project Templates.  You will create a new Project from one of these existing Project templates')
  .action(async () => {
    console.table(await api.projects(TOKEN, ACCOUNT_ID));
  });

program
  .command('accounts')
  .description('list all ACC/BIM 360 account IDs.  The new Project you will create, will go under this Account ID')
  .action(async () => {
    console.table(await api.accounts(TOKEN));
  });

program
  .command('new <project_name>')
  .description('create a new Project, returns an ID')
  .action((project_name, options) => {
    console.log(`created project: ${project_name}`);
    console.table([{id:1234, name:project_name, region:"US"}])
  });

program
  .command('template <template_project_id> <new_project_id>')
  .description('create a new Project, from a template')
  .action((template_project_id, new_project_id) => {
    console.log(`copied Template ID ${template_project_id} to Project ID ${new_project_id} created`);
  });

program
  .command('copyfiles <template_project_id> <new_project_id>')
  .description('recursively copy files from template folder into destination folder')
  .action((template_project_id, new_project_id) => {
    console.log(`recursively copied files from Template Folder ${template_project_id} to Project Folder ${new_project_id}... done`);
  });

program
  .command('worksharing <folder_id>')
  .description('create a new Revit cloud worksharing file in a folder')
  .action((folder_id) => {
    console.log(`worksharing Revit file created into folderID ${folder_id}`);
  });

program.parse(process.argv);