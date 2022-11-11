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
  login                                             opens a BIM360/ACC login page in a browser where you login, and the refresh token is captured.
  createprojectfromtemplate                         create a new project from template
  list                                              list BIM 360 Project Templates.  You will create a new Project from one of these existing Project templates
  accounts                                          list all ACC/BIM 360 account IDs.  The new Project you will create, will go under this Account ID
  new <project_name>                                create a new Project, returns an ID
  template <template_project_id> <new_project_id>   create a new Project, from a template
  copyfiles <template_project_id> <new_project_id>  recursively copy files from template folder into destination folder
  worksharing <folder_id>                           create a new Revit cloud worksharing file in a folder
  help [command]                                    display help for command
```

### POSTMAN

See the attached postman collection, to inspect the 'newProjectFromTemplate'' API.



### LOGIN

If you don't use the TOKEN for login, then you can use 3-legged authentication, using the `login` command.

#### STEPS

1. set the following environments:
```
export APS_CLIENT=1234
export APS_SECRET=1234
export APS_REFRESH_TOKEN=empty
```

2. run the command:
```
bim360cli login
```

3. Open a browser at localhost:8000
4. Login with your BIM360/ACC admin account

5. Done.  Once logged in, you will notice the APS_REFRESH_TOKEN will be updated.
