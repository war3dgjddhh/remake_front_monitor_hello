import { routeRecord } from "./monitors/monitorPV";

export interface behaviorRecordsOptions {
  maxBehaviorRecords: number;
}
export type httpRecord = {
  method: string;
  url: string | URL;
  body: Document | XMLHttpRequestBodyInit | null | undefined | ReadableStream;
  requestTime: number;
  responseTime: number;
  status: number;
  statusText: string;
  response?: any;
  timestamp: number;
}

export type behaviorStack = routeRecord | httpRecord

// 暂存用户的行为记录追踪
export default class behaviorStore {
  // 数组形式的 stack
  private state: Array<behaviorStack>;

  // 记录的最大数量
  private maxBehaviorRecords: number;

  // 外部传入 options 初始化，
  constructor(options: behaviorRecordsOptions) {
    const { maxBehaviorRecords } = options;
    this.maxBehaviorRecords = maxBehaviorRecords;
    this.state = [];
  }

  // 从底部插入一个元素，且不超过 maxBehaviorRecords 限制数量
  push(value: behaviorStack) {
    if (this.length() === this.maxBehaviorRecords) {
      this.shift();
    }
    this.state.push(value);
  }

  // 从顶部删除一个元素，返回删除的元素
  shift() {
    return this.state.shift();
  }

  length() {
    return this.state.length;
  }

  get() {
    return this.state;
  }

  clear() {
    this.state = [];
  }
}
