export class Queue {
    constructor(size) {
        this.hh = 0;
        this.tt = 0;
        this.data = [];
        this.size = size;
    }
    isEmpty() {
        return this.hh === this.tt;
    }
    isFull() {
        return this.tt != this.hh && this.tt % this.size === this.hh % this.size;
    }
    length() {
        return this.tt - this.hh;
    }
    push(o) {
        if (this.isFull())
            return;
        this.data[this.tt % this.size] = o;
        this.tt++;
    }
    /**
     * @returns 队头元素
     */
    front() {
        if (this.isEmpty())
            return;
        return this.data[this.hh];
    }
    /**
     * 删除队头元素
     * @returns
     */
    pop() {
        if (this.isEmpty())
            return;
        this.hh++;
    }
}
