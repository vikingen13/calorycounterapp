import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'caloryAppCounterImages',
  access: (allow) => ({
    'dishPictures/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write'])
    ]
  })
});

