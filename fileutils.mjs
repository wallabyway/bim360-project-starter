import fetch from 'node-fetch';

// class fileUtils
// recursively copy one folder on bim360 to another, based on 'upload files to BIM360 using Doc Mangement API (new, direct to S3 signed URLs)'
// https://forge.autodesk.com/en/docs/bim360/v1/tutorials/document-management/upload-document-s3/
export class fileUtils {

	// IN: 2legged-token, srcFolderURL, dstFolderURL = URL containing BIM360 Hub/Project/Folder
	// OUT: none
	// Purpose: copy files in root folder of BIM 360 Project, into a destination BIM 360 Folder. Works with ACC too.
	static async copyFiles(token, srcFolderURL, dstFolderURL) {
		try {
			const [sproject_id, sfolder_id] = this.parseURL(srcFolderURL);
			const [dproject_id, dfolder_id] = this.parseURL(dstFolderURL);
			await this.copyFolderRecursively(token, sproject_id, sfolder_id, dproject_id, dfolder_id);	
		}
		catch(err) {
			console.log(err);
		}
	}

	static parseURL(url_) {
		const params = url_.split('/');
		return [ `${params[4]}`, params[6] ];
	}

	// PURPOSE: recursively copy ACC/BIM360 files and folders, from source folder to destination folder.
	// PRE-CONDITIONS: All Destination Folders must already exist, due to "Create New Project from Template"
	// INPUTS: 2-legged token, source project_id & folder_id, destination project_id & folder_id
	static async copyFolderRecursively(token, sproject_id, sfolder_id, dproject_id, dfolder_id) {
    try {
      const [sdir, sfolders] = await this.fetchFolderContents(token, sproject_id, sfolder_id);
		const [ddir, dfolders] = await this.fetchFolderContents(token, dproject_id, dfolder_id);
		sfolders.forEach( (fold_id, index) => 
			this.copyFolderRecursively(token, sproject_id, fold_id, dproject_id, dfolders[index])
		);
		console.log(`copying folder: ${sfolder_id} to ${dfolder_id}`);
		for (const file of sdir) {
			const filename = file.attributes.name;
			
			console.log(`copying file: ${filename}`);
			const file_id = await this.createEmptyFile(filename, dproject_id, dfolder_id, token);
			const src_URL = this.createSrcURL(file.relationships.storage.data.id);
			const [dst_signedURL, uploadkey] = await this.createDstSignedURL(file_id, token);
			await this.copyFile(src_URL, dst_signedURL, token);
			await this.finishSignedURL(file_id, uploadkey, token);
			await this.createVersion(filename, dproject_id, dfolder_id, file_id, token);
		};
		console.log(`finished copying folder: ${sfolder_id}`);
  } catch(err) {console.log(err)}
}

	static async fetchFolderContents(token, project_id, folder_urn) {
		const url = `https://developer.api.autodesk.com/data/v1/projects/b.${project_id}/folders/${folder_urn}/contents`;
		const json = await ( await fetch(url, { headers: { Authorization: `Bearer ${token}` } }) ).json();
		if (json.errors) throw(json.errors[0])
		return [json.included,json.data.filter( i => {return i.type=="folders"}).map(i => {return i.id})];
	}


	// IN: src = plain URL pointing to source file, which requires bearer TOKEN for access. 
	//     dst = a signedURL pointing to the destination file, which is an 'empty' file resource
	static async copyFile(src, dst, token) {
		const resp = await fetch(src, { headers: { Authorization: `Bearer ${token}` } });
		const res = await resp.blob();
		const resp2 = await fetch(dst, { method:"PUT", body: res });
		return resp2.status;
	}
/* 	static async copyFileStream(src, dst, token) {
		const resp = await fetch(src, { headers: { Authorization: `Bearer ${token}` } });
		const res = resp.body.pipe(fs.createWriteStream(dst));
		return res.status;
	}
*/


	// create an empty file resource on Forge OSS
	// OUT: file_id
	static async createEmptyFile(filename, project_id, folder_id, token) {
        const res = await fetch( `https://developer.api.autodesk.com/data/v1/projects/b.${project_id}/storage`, 
        {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/vnd.api+json',
                Accept : 'application/vnd.api+json',
                Authorization: `Bearer ${token}`
            },
            body: `{
                "jsonapi": { "version": "1.0" },
                "data": {
                  "type": "objects",
                  "attributes": {
                    "name": "${filename}"
                  },
                  "relationships": {
                    "target": {
                      "data": { "type": "folders", "id": "${folder_id}" }
                    }
                  }
                }
          }`
        });
        const obj = await res.json();
		return obj.data.id;
    }


	static createSrcURL(item_id) {
		const url = `https://developer.api.autodesk.com/oss/v2/buckets/wip.dm.prod/objects/${item_id.split('/')[1]}`;
		return url;
    }

	static async createDstSignedURL(urn, token) {
		const bucketAndObject = urn.split(':')[3].split("/");
      const resp = await fetch( `https://developer.api.autodesk.com/oss/v2/buckets/${bucketAndObject[0]}/objects/${bucketAndObject[1]}/signeds3upload`, { headers: { Authorization: `Bearer ${token}` }});
      const res = await resp.json();
        return [res.urls[0],res.uploadKey];
    }

	static async finishSignedURL(urn, uploadkey, token) {
		const bucketAndObject = urn.split(':')[3].split("/");
        const res = await fetch( 
			`https://developer.api.autodesk.com/oss/v2/buckets/${bucketAndObject[0]}/objects/${bucketAndObject[1]}/signeds3upload`,  { 
				method: "POST",
				headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
				body: JSON.stringify({"uploadKey": uploadkey })
			}
		);
		const resp = await res.json();
        return resp;
		
	}

	static async getStorageId(project_id, item_id, token) {
		console.log(item_id)
        const res = await (await fetch( `https://developer.api.autodesk.com/data/v1/projects/b.${project_id}/items/${item_id}/tip `, { headers: { Authorization: `Bearer ${token}` }})).json();
        return res;//.included[0].storage.data.id;
    }

    static async createVersion( filename, project, folder, file_id, token ) {
        const res = await fetch( `https://developer.api.autodesk.com/data/v1/projects/b.${project}/items`, 
        {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: `{
                "jsonapi": { "version": "1.0" },
                "data": {
                  "type": "items",
                  "attributes": {
                    "displayName": "${filename}",
                    "extension": {
                      "type": "items:autodesk.bim360:File",
                      "version": "1.0"
                    }
                  },
                  "relationships": {
                    "tip": {
                      "data": {
                        "type": "versions", "id": "1"
                      }
                    },
                    "parent": {
                      "data": {
                        "type": "folders",
                        "id": "${folder}"
                      }
                    }
                  }
                },
                "included": [
                  {
                    "type": "versions",
                    "id": "1",
                    "attributes": {
                      "name": "${filename}",
                      "extension": {
                        "type": "versions:autodesk.bim360:File",
                        "version": "1.0"
                      }
                    },
                    "relationships": {
                      "storage": {
                        "data": {
                          "type": "objects",
                          "id": "${file_id}"
                        }
                      }
                    }
                  }
                ]
              }`
        });
		const resp = await res.json();
		if (resp.errors)
			console.table(resp.errors[0]);
        return resp;
    }	
}
