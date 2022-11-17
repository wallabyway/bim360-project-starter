# bim360-project-starter
Start a new Project in BIM360/ACC based on a Project Template, using Autodesk APIs.   

When you create a new project, specify the template project, and it will copy the template's folders, roles and folder permissions, into a new empty project.  Then use the 'copyFiles' command, to recursively copy all of the template's files (Revit/Navis/PDF/etc) into the new project.

### INSTALL
```
npm i -g bim360-project-starter
```

and configure a token:

```
export TOKEN=1234
```


### RUN

then run the command line tool, like this:

```
bim360cli createprojectfromtemplate <template project ID> <new project name> <json of address1, add2, type, etc>
```

This will create a new project, based on the template project, and copies the folders, role permissions and files too.



### LIST OF COMMANDS

```
bim360cli -h
```


```
Commands:
  login <key> <secret>                                 gets 2-legged with forge key/secret + get 3-legged access tokens via browser and BIM360/ACC login page
  listaccounts                                         list all ACC/BIM 360 account IDs.  The new Project you will create, will go under this Account ID
  listprojects                                         list BIM 360 Project Templates.  You will create a new Project from one of these existing Project templates
  createproject <project_name>                         create a new Project, returns a projectID
  copytemplate <new_project_id> <template_project_id>  copy template folders/roles, into new Project
  importusers <g_spreadsheet_url>                      import users from google spreadsheet, into a bim360 hub
  adduserstoproject <project_id> <g_spreadsheet_url>   Adds users (project admin and project user) to a project, from google spreadsheet
  patchuserroles <g_spreadsheet_url>                   patch user roles, from google spreadsheet, into bim360
  copyfiles <template_project_id> <new_project_id>     recursively copy files from template folder into destination folder
  createworksharing <folder_id>                        create a new Revit cloud worksharing file in a folder
  help [command]                                       display help for command
```

### POSTMAN

See the attached postman collection, to inspect the 'newProjectFromTemplate'' API.



### LOGIN

If you don't use the TOKEN for login, then you can use 3-legged authentication, using the `login` command.

#### STEPS

2. run the command:
```
bim360cli login <KEY> <SECRET>
```

3. This will open a browser at localhost:8000
4. Login with your BIM360/ACC admin account
5. Done.  Once logged in, run the two `export TOKEN2=...;  export TOKEN3=...` in a shell


### CREATE EMPTY PROJECT

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
