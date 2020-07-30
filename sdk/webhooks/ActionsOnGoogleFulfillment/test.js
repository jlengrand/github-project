const { request } = require("@octokit/request");
const { Octokit } = require("@octokit/core");

const octokit = new Octokit({ auth: `test` });


const start = async function(){
    const response = await octokit.request("GET /users/:username/repos", {
        username: "jlengrand",
    });

    console.log(`${response.data.length} repos found.`);
    console.log(`${response.data[0]}`);
}

start();