import assert from 'node:assert/strict';
import test from 'node:test';

import { getAvatarUrl } from './utils';

test('generated avatars stay local and do not depend on DiceBear', () => {
  const generated = getAvatarUrl('Hoàng Minh Lê', 'bottts-neutral');

  assert.match(generated, /^data:image\/svg\+xml,/);
  assert.doesNotMatch(generated, /dicebear|https?:\/\//);
});

test('Google photo selection still preserves an explicitly supplied profile photo', () => {
  const photoUrl = 'https://lh3.googleusercontent.com/example';

  assert.equal(getAvatarUrl('Chat Chuan', 'google', photoUrl), photoUrl);
  assert.match(getAvatarUrl('Chat Chuan', 'google'), /^data:image\/svg\+xml,/);
});
