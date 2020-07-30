const { request } = require("@octokit/request");
const { Octokit } = require("@octokit/core");

const octokit = new Octokit({ auth: `test` });

const sanitize = function(repoName){
    return repoName.split(' ').join('_');
}

const createJavaRepoFromTemplate = createRepoFromTemplate(sanitizedRepoName, "Spring-Boot-Framework", "Spring-Boot-Application-Template");
const createTypescriptRepoFromTemplate = createRepoFromTemplate(sanitizedRepoName, "carsonfarmer", "ts-template");

const createRepoFromTemplate = async function(sanitizedRepoName, templateOwner, templateRepo){
    const response = await octokit.request("POST /repos/:template_owner/:template_repo/generate", {
        template_owner: templateOwner,
        template_repo: templateRepo, 
        name: sanitizedRepoName,
        mediaType: {
            previews: ["baptiste-preview"],
          },
    });

    console.log(`${response.data.length} repos found.`);
    console.log(`${response.data[0]}`);
}

const listRepos = async function(){
    const response = await octokit.request("GET /users/:username/repos", {
        username: "jlengrand",
        mediaType: {
            previews: ["baptiste"],
          },
    });

    console.log(`${response.data.length} repos found.`);
    console.log(`${response.data[0]}`);
}

const createFromTemplate = async function(repoName){
    const response = await createJavaRepoFromTemplate(sanitize(repoName));
    console.log(`${response}`);
}

// start();
createFromTemplate("a test repo");
