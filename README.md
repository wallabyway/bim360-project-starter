# bim360-project-starter
Create a new Project in BIM360/ACC copied from a Project Template, using a command line tool called '`bim360cli`'.  It uses [Autodesk APIs](aps.autodesk.com) under the hood.

![parameters](https://user-images.githubusercontent.com/440241/207185831-01693ac2-bf54-4d65-a13d-987a82008c95.JPG)


## QUICK START GUIDE:  INSTALL, then RUN

### INSTALL

1. [Install NPM](https://nodejs.org/en/download) on your computer, and type this into a terminal:

```
npm i -g bim360-project-starter
```


2. Next, type in your Forge KEY & SECRET (see [references](#REFERENCES) below) and run a test (listhubs), like this:
```
export KEY=1234;
export TOKEN=1234;
bim360cli listhubs
```

You should see a list of hubs, similar to this:

| index | id | name | region |
| - | - | - | - |
| 0| 'a4f95080-84fe-4281-8d0a-bd8c885695e0'| Autodesk Forge Partner Development |   'US' |
|1| '489c5e7a-c6c0-4212-81f3-3529a621210b' |     'Developer Advocacy Support'  |  'US'  |


3. Now, login to BIM360 via a browser, to get a 3-legged token, by typing in this:
```
bim360cli login
```
4. A browser will launch.  Login to BIM 360 as account admin.

5. Once logged in, press CTRL-C in the terminal, and copy the export command into the terminal, like this:
```
export TOKEN3=1234
```

That's it for the setup, now let's run some commands...

### RUN

There are 3 steps:

1. `listprojects' - Find your Template ID
2. 'masterCreate` - Create Project
3. 'copyfilesAlt` - Copy Files from Template to New Project




<br>

### STEP 1 - listprojects

Use this to find your Template ID, by listing the projects, with command  `listprojects` `<hub id>`  
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

### STEP 2 - masterCreate

Now, create a new project, from a template.

#### EXAMPLE 1:

Here is the quickest example of creating a new Project called "myNewProject2", using default parameters:
```
bim360cli masterCreate a4f95080-84fe-4281-8d0a-bd8c885695e0 myNewProject2 b5135e2b-c255-4cd0-a160-79c73835775a admin-only@gmail.com
```


Here is the full command with parameters:
```
bim360cli masterCreate <hub_id> <project_name> <template_project_id> <user_email> -params (optional project settings)
```

This requires a few inputs...
- `<hub id>` - this is the same Hub_id as STEP 2
- `<project_name>` - the name of the new project
- `<template_project_id>` - a template ID, from STEP 2. This will be the project you want to clone
- `<user_email>` - Provide an email. This email / user, will be the project-admin for the new project
- `-params <json>` - (optional) overrides the default values for a new project.  


#### EXAMPLE 2 (with params):

Here is a full example of creating a new Project, with type "Design-Bid Commercial", located in Sydney, called 'myNewProject3' :
```
bim360cli masterCreate a4f95080-84fe-4281-8d0a-bd8c885695e0 myNewProject3 b5135e2b-c255-4cd0-a160-79c73835775a admin-only@gmail.com --params '{"service_types":"inSight","start_date":"2023-05-02","end_date":"2024-04-03","value":3000,"address_line_1":"2 Martin Place","city":"Sydney","state_or_province":"New South Wales","postal_code":"3124","country":"Australia","timezone":"Australia/Sydney","language":"en","currency":"AUD","construction_type":"New Construction","contract_type":"Design-Bid","project_type":"Commercial", "job_number":"123" }'
```

RESULT:

All folders and role permissions on the folders, will be copied from the template, to the new project.

You should see a link to open the new Project in a browser:

`open` [https://docs.b360.autodesk.com/projects/743cbb3e-9549-4223-a513-b059dbe2681e/folders/urn:adsk.wipprod:fs.folder:co.dlh-TZTOTSepUTxtSP09og/detail](https://docs.b360.autodesk.com/projects/743cbb3e-9549-4223-a513-b059dbe2681e/folders/urn:adsk.wipprod:fs.folder:co.dlh-TZTOTSepUTxtSP09og/detail)

![terminal-result](https://user-images.githubusercontent.com/440241/206986811-c992a95a-867a-497c-94a8-a80390444be1.JPG)


Also, you will see a prompt, to copy and run a `copyfilesAlt` command.  This is discussed in step 3 below.


<br><br>

### STEP 3 - Copy Files

This last step is optional.  Copy the 'copyfilesAlt' prompt into the terminal and run, like this:

```
bim360cli copyfilesAlt b5135e2b-c255-4cd0-a160-79c73835775a urn:adsk.wipprod:fs.folder:co.WkxDJJlnQAyHMkCeS7PRdw 7a18437c-2812-4a49-bbc5-32254a32f93b urn:adsk.wipprod:fs.folder:co.S7sIoldKRyaA6d8-uTSklw
```

This will copy files from the source Project, to the destination Project.
The prompt will return after it has finished copying.  It could take a few seconds, to a few minutes.

Use the browser link, to open the project and verify everything copied correctly.

That's it !
<br>
<hr>


# REFERENCES

1. How to get your [Forge Key and Secret](http://forge.autodesk.com/myapps/)
2. Following [this tutorial](https://forge-tutorials.autodesk.io/#create-an-account) to provision [access into your Hub](https://forge-tutorials.autodesk.io/#provision-access-in-other-products)


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
  copyfilesAlt <template_project_id> <template_topfolder_urn> <empty_project_id> <empty_topfolder_urn>
  createworksharing <folder_id>                                            create a new Revit cloud worksharing file in a folder
  help [command]                                                           display help for command                                                      display help for command
```


## PARAMETERS


All parameters come from [BIM 360 Project Parameters API](https://aps.autodesk.com/en/docs/bim360/v1/overview/parameters/)
and match the UI

![parameters](https://user-images.githubusercontent.com/440241/207185831-01693ac2-bf54-4d65-a13d-987a82008c95.JPG)

Params Details:
- [Project_type](https://aps.autodesk.com/en/docs/bim360/v1/overview/parameters/#project-type) : Commercial, Retail, etc
- [construction_type]() : New Construction, Renovation
- [contract_type]() : Design-Bid, IPD, etc
- [currency]() : USD, AUD, etc
- [timezone](https://aps.autodesk.com/en/docs/bim360/v1/overview/parameters/#timezone) : America/New_York, Australia/Sydney, Pacific/Auckland, etc
- [trade]() : Architecture, Earthwork, General Contractor, etc

If you don't specify option `-params`, then this default will be used:
```
{
	"service_types":"inSight", //doc_manager
	"start_date": "2023-05-02",
	"end_date": "2024-04-03",
	"project_type": "Wind Farm",
	"value": 3000,
	"address_line_1":"",
	"address_line_2":"",
	"city": "New York",
	"state_or_province": "New York",
	"postal_code": "10011",
	"country": "United States",
	"timezone": "America/New_York",
	"language": "en",
	"currency": "USD"
}
```


