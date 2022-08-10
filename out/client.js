import behaviorStore from './monitors/behaviorStore';
export class Client {
    constructor() {
        this.opt = { url: '' };
        this.plugins = [];
        this.sender = {};
        this.breadcrumbs = new behaviorStore({ maxBehaviorRecords: 100 });
    }
    registryPlugin(...plugins) {
        plugins.forEach((el) => {
            var _a;
            (_a = this.plugins) === null || _a === void 0 ? void 0 : _a.push(el);
        });
    }
    init() {
        var _a;
        (_a = this.plugins) === null || _a === void 0 ? void 0 : _a.forEach((el) => {
            var _a;
            (_a = el.beforeInit) === null || _a === void 0 ? void 0 : _a.call(el);
        });
    }
    start() {
        var _a;
        (_a = this.plugins) === null || _a === void 0 ? void 0 : _a.forEach((el) => {
            var _a;
            (_a = el.beforeStart) === null || _a === void 0 ? void 0 : _a.call(el);
        });
    }
    monitorning() {
        var _a;
        (_a = this.plugins) === null || _a === void 0 ? void 0 : _a.forEach((el) => {
            var _a;
            (_a = el.beforeMonitorning) === null || _a === void 0 ? void 0 : _a.call(el);
        });
    }
    buildData() {
        var _a;
        (_a = this.plugins) === null || _a === void 0 ? void 0 : _a.forEach((el) => {
            var _a;
            (_a = el.beforeBuildData) === null || _a === void 0 ? void 0 : _a.call(el);
        });
    }
    send(url, data) {
        var _a;
        (_a = this.plugins) === null || _a === void 0 ? void 0 : _a.forEach((el) => {
            var _a;
            (_a = el.beforeSend) === null || _a === void 0 ? void 0 : _a.call(el);
        });
    }
    destory() {
        var _a;
        (_a = this.plugins) === null || _a === void 0 ? void 0 : _a.forEach((el) => {
            var _a;
            (_a = el.beforeDestory) === null || _a === void 0 ? void 0 : _a.call(el);
        });
    }
}
/**
 * 如何实现生命周期
 * init
 * start
 *
 */
