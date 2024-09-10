import DigestClient from 'digest-fetch';
//console.log(`api key: ${process.env.API_PUBLIC_KEY}`);
//console.log(process.env);
const apiPublicKey = process.env.API_PUBLIC_KEY;
const apiPrivateKey = process.env.API_PRIVATE_KEY
const client = new DigestClient(apiPublicKey, apiPrivateKey, { algorithm: 'MD5' });

async function main() {
    console.log('Main');

    const url = 'https://cloud.mongodb.com/api/atlas/v2/groups';
    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/vnd.atlas.2023-01-01+json");
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    const resp = await client.fetch(url, requestOptions);
    const data = await resp.json();
    //console.log(data);
    for (const project of data.results) {
        //console.log('project name: ' + project.name);
        await getAccessList(project.id, project.name);
    }
}

async function getAccessList(projectId, projectName) {
    const url = `https://cloud.mongodb.com/api/atlas/v2/groups/${projectId}/accessList`;
    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/vnd.atlas.2023-01-01+json");
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    const resp = await client.fetch(url, requestOptions);
    const data = await resp.json();
    //console.log(`access list size: ${data.results.length}`);
    if (data.results.length > 0) {
        console.log(`Project: ${projectName} has ${data.results.length} IP Access entries`);
    }
}

console.log('Starting function');
main();
console.log('Done');