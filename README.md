# bim360-project-starter
Start a new Project in BIM360/ACC based on a Project Template, using Autodesk APIs.   

When you create a new project, specify the template project, and it will copy the template's folders, roles and folder permissions, into a new empty project.  Then use the 'copyFiles' command, to recursively copy all of the template's files (Revit/Navis/PDF/etc) into the new project.

### INSTALL
```
npm i -g bim360-project-starter
```


### SETUP

first login, and add your Key and Secret.
Note: Get your [Forge Key and Secret](http://forge.autodesk.com/myapps/) by following [this tutorial](https://forge-tutorials.autodesk.io/#create-an-account) and then give your Key permission to access your Hub [by provisioning it](https://forge-tutorials.autodesk.io/#provision-access-in-other-products)

```
export KEY=1234;
export TOKEN=1234;
bim360cli login
```

> A browser will appear, and you will use this to login with your admin account.

From the browser, copy the text, into the terminal to set the TOKEN3 environment variable, like this...

```
TOKEN3=1234;
```

Check everything is working, by listing all the hubs:

```
bim360cli listhubs
```


## RUN

Using one of the hubs listed, now List the projects and template project:

```
bim360cli listprojects <hub id>
```


Choose one of the template_id, and run this command to create a new project with the template.
You will need to provide a project name, an email of the project-admin that will be assigned to the project

```
bim360cli masterCreate <hub id> <project_name> <template_project_id> <user_email>
```

It will take about 30 seconds to complete the process.  The process includes copying folders, files, and role permissions on the folders.
This command will complete and provide a browser link.  
Click on this link to see the new project, in BIM 360.

<hr>

### LIST OF COMMANDS

```
bim360cli -h
```


```
Commands:
  login                                                                    Opens a browser where you login via BIM360/ACC.  This gets the 3-legged token needed by the create template API.
  listhubs                                                                 list all ACC/BIM 360 hubs and their IDs.
  listprojects <hub_id>                                                    list BIM 360 Projects and Template IDs.  Use this to pick your Template ID
  masterCreate <hub_id> <project_name> <template_project_id> <user_email>  creates a new project, and copies template IDs folders and files. assigns user_email as project-admin
  createproject <project_name>                                             create a new Project, returns a projectID
  copytemplate <new_project_id> <template_project_id>                      copy template folders/roles, into new Project
  importusers <g_spreadsheet_url>                                          import users from google spreadsheet, into a bim360 hub
  assignusers <project_id> <g_spreadsheet_url>                             Assign users to a project, from google spreadsheet
  copyfiles <srcFolderURL> <dstFolderURL>                                  copy files in root folder of template into destination project root folder
  createworksharing <folder_id>                                            create a new Revit cloud worksharing file in a folder
  help [command]                                                           display help for command
```



### CREATE EMPTY PROJECT SCHEMA

There will be an option to modify these values, during project creation.  Currently, it's just the project name and these defaults.

JSON example:
```
		{
			locale: "en",
			currency : "USD",
			name : "my project name",
			address_line_1 : "",
			address_line_2: "",
			city: "",
			postal_code: "",
			country: "US",
			job_number: "",
			business_unit_id: "",
			timezone: "America/New_York",
			language: "en",
			construction_type: "",
			contract_type: "",
			state_or_province: "",
			start_date: "",
			end_date: "",
			project_type: "Wind Farm",
			value: ""
		}
```
