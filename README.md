# bim360-project-starter
Create a new Project in BIM360/ACC copied from a Project Template, using a command line tool called '`bim360cli`'.  It uses [Autodesk APIs](aps.autodesk.com) under the hood.

Open a Terminal, and follow the steps below:

### INSTALL
```
npm i -g bim360-project-starter
```


# SETUP

Authenticate both 2-legged and 3-legged tokens.

1. Start by getting your [Forge Key and Secret](http://forge.autodesk.com/myapps/)
2. Following [this tutorial](https://forge-tutorials.autodesk.io/#create-an-account) to provision [access into your Hub](https://forge-tutorials.autodesk.io/#provision-access-in-other-products)

2. Add KEY & SECRET into your environment and run `login`, like so:

```
export KEY=1234;
export TOKEN=1234;
bim360cli login
```
3. A browser will launch.  Login to BIM 360 as account admin.

4. Once logged in, copy the TOKEN3 text, into the terminal and set TOKEN3 environment variable, like this...

```
export TOKEN3=1234;
```

Check everything is working, by running step 1 below...

<br><br>

# GET STARTED

There are 4 steps:

1. `listhubs' - Find your Hub ID
2. `listprojects' - Find your Template ID
3. 'masterCreate` - Create Project
4. Verify

<br>

### STEP 1 - GET HUB

Run the command...

```
> bim360cli listhubs
```

You should see a list of hubs, similar to this:

| index | id | name | region |
| - | - | - | - |
| 0| 'a4f95080-84fe-4281-8d0a-bd8c885695e0'| Autodesk Forge Partner Development |   'US' |
|1| '489c5e7a-c6c0-4212-81f3-3529a621210b' |     'Developer Advocacy Support'  |  'US'  |


<br>

### STEP 2 - GET TEMPLATE ID

Find your Template ID, by listing the projects, with command  `listprojects` `<hub id>`  
Use the HUB ID, from the previous step, like this:

```
> bim360cli listprojects a4f95080-84fe-4281-8d0a-bd8c885695e0
```
Which gives a list of projects, like this:

| (index) |                   id                   |             name             |
|-|-|-|
|    0    | '743cbb3e-9549-4223-a513-b059dbe2681e' |       'nonadsk-craz1'        |
|    1    | '55b9a76f-ff85-4831-8bee-e2cedc10b967' |   'xiaodong-new -project'    |
|    2    | 'b5135e2b-c255-4cd0-a160-79c73835775a' |      'crazyNewProject'       |
|    3    | '03342a00-a231-49fc-8e21-4603d2f4da7d' |    'Michael_Test_Project'    |


<br><br>

### STEP 3 - CREATE

Now, the important bit. Create a new project.

Here is the main command:
```
bim360cli <hub_id> <project_name> <template_project_id> <user_email>
```

This requires a few inputs...
- `<hub id>` - this is the same Hub_id as STEP 2
- `<project_name>` - the name of the new project
- `<template_project_id>` - a template ID, from STEP 2. This will be the project you want to clone
- `<user_email>` - Provide an email. This email / user, will be the project-admin for the new project

Example:
```
bim360cli masterCreate a4f95080-84fe-4281-8d0a-bd8c885695e0 myNewProject b5135e2b-c255-4cd0-a160-79c73835775a the-boss@gmail.com
```

RESULT:


`open` [https://docs.b360.autodesk.com/projects/743cbb3e-9549-4223-a513-b059dbe2681e/folders/urn:adsk.wipprod:fs.folder:co.dlh-TZTOTSepUTxtSP09og/detail](https://docs.b360.autodesk.com/projects/743cbb3e-9549-4223-a513-b059dbe2681e/folders/urn:adsk.wipprod:fs.folder:co.dlh-TZTOTSepUTxtSP09og/detail)


It will take about 30 seconds to complete the process.  
All folders, files, and role permissions on the folders, will be copied from the template, to the new project.

Once finished, a new browser link will appear.
Click on this link, to open the new project in BIM 360.


<br> 

### STEP 4: VERIFY
 

Click on this link, to open the new project in BIM 360 and verify the project was successfully created and cloned.

All Done !

<br>
<hr>

# LIST OF COMMANDS

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
  help [command]                                                           display help for command                                                      display help for command
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
