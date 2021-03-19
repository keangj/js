class Promise2 {
  callbacks = [];
  state = 'pending';
  resolve (value) {
    if (this.state !== 'pending') return;
    this.state = 'fulfilled';
    setTimeout(()=> {
      this.callbacks.forEach(handle => {
        if (typeof handle[0] === 'function') {
          handle[0].call(undefined, value);
        }
      })
    })
  }
  reject (reason) {
    if (this.state !== 'pending') return;
    this.state = 'rejected'
    setTimeout(()=> {
      this.callbacks.forEach(handle => {
        if (typeof handle[1] === 'function') {
          handle[1].call(undefined, reason);
        }
      })
    })
  }
  
  constructor (executor) {
    if (typeof executor !== 'function') {
      throw new Error('必须接受一个函数')
    }
    executor(this.resolve.bind(this), this.reject.bind(this));
  }
  then (onfulfilled?, onrejected?) {
    const handle = [];
    if (typeof onfulfilled === 'function') {
      handle[0] = onfulfilled;
    }
    if (typeof onrejected === 'function') {
      handle[1] = onrejected;
    }
    this.callbacks.push(handle);
  }
}
// new Promise(()=>{}).then()
export default Promise2;