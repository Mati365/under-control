import { error } from './error';
import { flattenMessagesList } from './flatten-messages-list';

describe('flattenMessagesList', () => {
  it('returns flatten messages list', () => {
    const errors = [error('Error 1'), error('Error 2')];

    expect(flattenMessagesList(errors)).toMatchObject(['Error 1', 'Error 2']);
  });
});
