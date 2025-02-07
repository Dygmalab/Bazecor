import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest';
import { delay } from "./delay";

describe('delayed execution', () => {
  let mock: Mock;

  beforeEach(() => {
    vi.useFakeTimers();

    mock = vi.fn(() => console.log('done'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  describe('should evaluate at the end of frame', () => {
    it('when supplied a negative time', async () => {
      delay(-10).then(mock);
      expect(mock).not.toHaveBeenCalled();

      await vi.advanceTimersToNextFrame();
      expect(mock).toHaveBeenCalled();
    });

    it('when supplied zero time', async () => {
      delay(0).then(mock);
      expect(mock).not.toHaveBeenCalled();

      await vi.advanceTimersToNextFrame();
      expect(mock).toHaveBeenCalled();
    });
  });

  it('should evaluate after 10ms', async () => {
    delay(10).then(mock);
    expect(mock).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(10);
    expect(mock).toHaveBeenCalled();
  });
});
