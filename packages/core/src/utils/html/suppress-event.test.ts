import { suppressEvent } from './suppress-event';

describe('suppressEvent', () => {
  it('should call html event stop propagation function', () => {
    const event = new Event('click');

    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    const stopPropagationSpy = jest.spyOn(event, 'stopPropagation');

    suppressEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
    expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
  });
});
