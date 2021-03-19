import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
chai.use(sinonChai);

import Promise from '../src/promise';

const assert = chai.assert;

describe('Promise', () => {
  it('是一个类', () => {
    assert.isFunction(Promise);
    assert.isObject(Promise.prototype);
  })
  it('new Promise() 必须接受一个函数，否则就报错', () => {
    assert.throw(() => {
      // @ts-ignore
      new Promise()
    })
    assert.throw(() => {
      // @ts-ignore
      new Promise(1)
    })
    assert.throw(() => {
      // @ts-ignore
      new Promise(false)
    })
  })
  it('new Promise(fn) 会生成一个对象，对象有 then 方法', () => {
    const promise = new Promise(() => {});
    assert.isFunction(promise.then);
  })
  it('new Promise(fn) 中的 fn 会立即执行', () => {
    let fn = sinon.fake();
    new Promise(fn)
    setTimeout(() => {
      assert(fn.called);
    })
  })
  it('new Promise(fn) 中的 fn 执行的时候接受 resolve 和 reject 两个函数', (done) => {
    new Promise((resolve, reject) => {
      assert.isFunction(resolve);
      assert.isFunction(reject);
      done();
    })
  })
  it('Promise.then(success) 中的 success 会在 resolve 被调用的时候执行', (done) => {
    let success = sinon.fake();
    const promise = new Promise((resolve, reject) => {
      assert.isFalse(success.called);
      resolve()
      setTimeout(() => {
        assert.isTrue(success.called);
        done();
      })
    })
    promise.then(success)
  })
  it('Promise.then(null, fail) 中的 fail 会在 reject 被调用的时候执行', (done) => {
    let fail = sinon.fake();
    const promise = new Promise((resolve, reject) => {
      assert.isFalse(fail.called);
      reject()
      setTimeout(() => {
        assert.isTrue(fail.called);
        done();
      })
    })
    promise.then(null, fail)
  })
  it('2.2.1 onfulfilled 和 onrejected 都是可选的参数', () => {
    const promise = new Promise((resolve, reject) => {
      resolve();
    })
    promise.then(false, null)
  })
  it('2.2.2 onfulfilled 是函数', (done) => {
    let succeed = sinon.fake();
    const promise = new Promise((resolve, reject) => {
      assert.isFalse(succeed.called);
      resolve(666);
      resolve(777);
      setTimeout(() => {
        assert(promise.state === 'fulfilled');
        assert.isTrue(succeed.called);
        assert.isTrue(succeed.calledOnce);
        assert(succeed.calledWith(666));
        done();
      })
    })
    promise.then(succeed);
  })
  it('2.2.3 onrejected 是函数', (done) => {
    let fail = sinon.fake();
    const promise = new Promise((resolve, reject) => {
      assert.isFalse(fail.called);
      reject(666);
      reject(777);
      setTimeout(() => {
        assert(promise.state === 'rejected');
        assert.isTrue(fail.called);
        assert.isTrue(fail.calledOnce);
        assert(fail.calledWith(666));
        done();
      })
    })
    promise.then(null, fail);
  })
  it('2.2.4 在代码执行完成之前，不得调用 then 的 onfulfilled', (done) => {
    let succeed = sinon.fake();
    const promise = new Promise((resolve, reject) => {
      resolve();
    })
    promise.then(succeed);
    assert.isFalse(succeed.called);
    setTimeout(() => {
      assert.isTrue(succeed.called);
      done();
    })
  })
  it('2.2.4 在代码执行完成之前，不得调用 then 的 onrejected', (done) => {
    let fail = sinon.fake();
    const promise = new Promise((resolve, reject) => {
      reject();
    })
    promise.then(null, fail);
    assert.isFalse(fail.called);
    setTimeout(() => {
      assert.isTrue(fail.called);
      done();
    })
  })
  it('2.2.5 ', (done) => {
    const promise = new Promise((resolve, reject) => {
      resolve();
    })
    promise.then(function () {
      'use strict'
      assert(this === undefined);
      done();
    });
  })
  it('2.2.6 ', (done) => {
    const callbacks = [sinon.fake(), sinon.fake(), sinon.fake()];
    const promise = new Promise((resolve, reject) => {
      resolve();
    })
    promise.then(callbacks[0]);
    promise.then(callbacks[1]);
    promise.then(callbacks[2]);
    setTimeout(() => {
      assert(callbacks[0].called);
      assert(callbacks[1].called);
      assert(callbacks[2].called);
      assert(callbacks[1].calledAfter(callbacks[0]));
      assert(callbacks[2].calledAfter(callbacks[1]));
      done();
    })
  })
  it('2.2.6 ', (done) => {
    const callbacks = [sinon.fake(), sinon.fake(), sinon.fake()];
    const promise = new Promise((resolve, reject) => {
      reject();
    })
    promise.then(null, callbacks[0]);
    promise.then(null, callbacks[1]);
    promise.then(null, callbacks[2]);
    setTimeout(() => {
      assert(callbacks[0].called);
      assert(callbacks[1].called);
      assert(callbacks[2].called);
      assert(callbacks[1].calledAfter(callbacks[0]));
      assert(callbacks[2].calledAfter(callbacks[1]));
      done();
    })
  })
})
