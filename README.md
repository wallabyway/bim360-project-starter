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
bim360cli -h
```



### LIST OF COMMANDS

```
Commands:
  login                                             opens a BIM360/ACC login page in a browser where you login, and the refresh token is captured.
  list                                              list BIM 360 Project Templates.  You will create a new Project from one of these existing Project templates
  accounts                                          list all ACC/BIM 360 account IDs.  The new Project you will create, will go under this Account ID
  new <project_name>                                create a new Project, returns an ID
  template <template_project_id> <new_project_id>   create a new Project, from a template
  copyfiles <template_project_id> <new_project_id>  recursively copy files from template folder into destination folder
  worksharing <folder_id>                           create a new Revit cloud worksharing file in a folder
  help [command]                                    display help for command
```
