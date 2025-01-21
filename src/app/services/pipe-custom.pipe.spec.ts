import { PipeCustomPipe } from './pipe-custom.pipe';

describe('PipeCustomPipe', () => {
  it('create an instance', () => {
    const pipe = new PipeCustomPipe();
    expect(pipe).toBeTruthy();
  });
});
