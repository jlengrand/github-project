const {conversation} = require('@assistant/conversation');
const functions = require('firebase-functions');
const { Octokit } = require("@octokit/core");

const app = conversation({debug: true});
const octokit = new Octokit({ auth: `test` });

function sanitize(repoName){
    return repoName.split(' ').join('_');
}

async function createRepoFromTemplate(sanitizedRepoName, templateOwner, templateRepo){
    const res = await octokit.request("POST /repos/:template_owner/:template_repo/generate", {
        template_owner: templateOwner,
        template_repo: templateRepo, 
        name: sanitizedRepoName,
        mediaType: {
            previews: ["baptiste-preview"],
          },
    });
    console.log('res2');
    console.log(res);
}

async function listRepos(){
    const response = await octokit.request("GET /users/:username/repos", {
        username: "jlengrand",
        mediaType: {
            previews: ["baptiste"],
          },
    });

    return response;
}

async function createFromTemplate(repoName, repoType){
  let response;
  if (repoType === 'java' ){
    response = await createRepoFromTemplate(sanitize(repoName), "Spring-Boot-Framework", "Spring-Boot-Application-Template");
  }
  else if (repoType === 'typescript') {
    response = await createRepoFromTemplate(sanitize(repoName), "carsonfarmer", "ts-template");
  }
  return response;
}


app.handle('start_scene_initial_prompt', (conv) => {
  console.log('Start scene: initial prompt');
  conv.overwrite = false;
  conv.scene.next.name = 'actions.scene.END_CONVERSATION';
  conv.add('triggered start_scene_initial_prompt');
});

app.handle('create_github_repository', (conv) => {
  return createFromTemplate(conv.scene.slots.project_name_slot.value, conv.scene.slots.project_type_slot.value).then(response =>{
    console.log('Start scene: create_github_repository');
    conv.overwrite = false;
    conv.scene.next.name = 'actions.scene.END_CONVERSATION';
  
    // conv.add('Alright, creating a ' + conv.scene.slots.project_type_slot.value + ' repository with name ' + sanitize(conv.scene.slots.project_name_slot.value));
  
    conv.add('Repository is created!');
    console.log(response);

  }).catch(error => {
    console.log('Start scene: create_github_repository');
    conv.overwrite = false;
    conv.scene.next.name = 'actions.scene.END_CONVERSATION';
  
    // conv.add('Alright, creating a ' + conv.scene.slots.project_type_slot.value + ' repository with name ' + sanitize(conv.scene.slots.project_name_slot.value));
  
    conv.add('Error while creating your repository, sorry. Maybe try again?');
    console.log('error');
    console.log(error);

  })
});

exports.ActionsOnGoogleFulfillment = functions.https.onRequest(app);

