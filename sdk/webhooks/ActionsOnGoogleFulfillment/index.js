const {conversation} = require('@assistant/conversation');
const functions = require('firebase-functions');

const app = conversation({debug: true});

app.handle('start_scene_initial_prompt', (conv) => {
  console.log('Start scene: initial prompt');
  conv.overwrite = false;
  conv.scene.next.name = 'actions.scene.END_CONVERSATION';
  conv.add('Hello world from fulfillment');
});

app.handle('create_github_repository', (conv) => {
  console.log('Start scene: create_github_repository');
  conv.overwrite = false;
  conv.scene.next.name = 'actions.scene.END_CONVERSATION';
  conv.add('Hello world from ' +  conv.scene.slots.project_name_slot.value);
  console.log(conv.scene.slots.project_name_slot.value);
});

exports.ActionsOnGoogleFulfillment = functions.https.onRequest(app);
