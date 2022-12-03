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
bim360cli login FORGE_KEY FORGE_SECRET
```

> A browser will appear, and you will use this to login with your admin account.

Set the environment by copying and pasting the token:

```
TOKEN2=1234;
TOKEN3=1234;
```

Check everything is working, by running this command:

```
bim360cli listaccounts
```


## RUN

List the projects, and find your template project:

```
bim360cli listprojects
```


Using the template_id, run this command:

```
bim360cli masterCreate <project_name> <template_project_id> <user_email>
```

choose a project name, and the email of the project-admin you want to assign to the project initially.

This will create a new project, and duplicate your template project.  It will copy folders, files, and role permissions on the folders.


<hr>

### LIST OF COMMANDS

```
bim360cli -h
```


```
Commands:
  login <key> <secret>                                            gets 2-legged with forge key/secret + get 3-legged access tokens via browser and BIM360/ACC login page
  listaccounts                                                    list all ACC/BIM 360 account IDs.  The new Project you will create, will go under this Account ID
  listprojects                                                    list BIM 360 Project Templates.  You will create a new Project from one of these existing Project
                                                                  templates
  masterCreate <project_name> <template_project_id> <user_email>  creates a new project, and copies template IDs folders and files. assigns user_email as project-admin
  createproject <project_name>                                    create a new Project, returns a projectID
  copytemplate <new_project_id> <template_project_id>             copy template folders/roles, into new Project
  importusers <g_spreadsheet_url>                                 import users from google spreadsheet, into a bim360 hub
  assignusers <project_id> <g_spreadsheet_url>                    Assign users to a project, from google spreadsheet
  copyfiles <srcFolderURL> <dstFolderURL>                         copy files in root folder of template into destination project root folder
  createworksharing <folder_id>                                   create a new Revit cloud worksharing file in a folder
  help [command]                                                  display help for command
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
