export function afterLoad(done) {
    return async function (...args) {
        if (document.readyState === 'complete') {
            setTimeout(() => {
                done.apply(done, ...arguments);
            }, 0);
        }
        else {
            addEventListener('load', () => setTimeout(() => {
                done.apply(done, ...arguments);
            }, 0));
        }
    };
}
