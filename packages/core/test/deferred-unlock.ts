import { Nullable } from '../src/types/nullable';

export class DeferredUnlock<T = void> {
  public readonly promise: Promise<Nullable<T>>;

  constructor(public value: Nullable<T> = null, public resolved = false) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    this.promise = new Promise<Nullable<T>>((resolve, reject) => {
      this.resolve = (resolvedValue = value) => {
        self.resolved = true;
        return resolve(resolvedValue);
      };

      this.reject = reject;
    });
  }

  /* eslint-disable @typescript-eslint/no-unused-vars, n/handle-callback-err */
  resolve(value?: Nullable<T>): void {
    // This is intentional
  }

  reject(err?: unknown): void {}
  /* eslint-enable @typescript-eslint/no-unused-vars, n/handle-callback-err */
}
