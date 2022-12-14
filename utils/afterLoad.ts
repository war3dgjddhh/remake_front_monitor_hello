export function afterLoad(done: Function) {
  return async function (...args: any) {
    if (document.readyState === 'complete') {
      setTimeout(() => {
        done.apply(done, ...arguments);
      }, 0);
    } else {
      addEventListener('load', () =>
        setTimeout(() => {
          done.apply(done, ...arguments);
        }, 0)
      );
    }
  };
}
