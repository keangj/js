const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

const assert = chai.assert;
const deepClone = require('../src/index');
describe('deepClone', () => {
  it('是一个函数', () => {
    assert.isFunction(deepClone);
  });
  it('拷贝基本类型', () => {
    const number = 123;
    const number2 = deepClone(number);
    assert(number === number2);
    const string = 'hello world';
    const string2 = deepClone(string);
    assert(string === string2);
    const boolean = false;
    const boolean2 = deepClone(boolean);
    assert(boolean === boolean2);
    const undefined1 = undefined;
    const undefined2 = deepClone(undefined1);
    assert(undefined1 === undefined2);
    const empty = null;
    const empty2 = deepClone(empty);
    assert(empty === empty2);
    const symbol = Symbol();
    const symbol2 = deepClone(symbol);
    assert(symbol === symbol2);
  });
  describe('引用类型', () => {
    it('拷贝对象', () => {
      const obj = {
        name: '对象',
        child: {
          name: '数组'
        } 
      }
      const obj2 = deepClone(obj);
      assert(obj !== obj2);
      assert(obj.child !== obj2.child);
      assert(obj.name === obj2.name);
      assert(obj.child.name === obj2.child.name);
    });
    it('拷贝数组对象', () => {
      const array = [[1, 2], [3, 4], [5, 6]];
      const array2 = deepClone(array);
      assert(array !== array2);
      assert(array[0] !== array2[0]);
      assert(array[1] !== array2[1]);
      assert(array[2] !== array2[2]);
      assert.deepEqual(array, array2);
    });
    it('拷贝函数', () => {
      const fn = function (x, y) {
        return x + y;
      };
      fn.a = { b: { c: 1 }};
      const fn2 = deepClone(fn);
      assert(fn !== fn2);
      assert(fn.a.b.c === fn2.a.b.c);
      assert(fn.a.b !== fn2.a.b);
      assert(fn.a !== fn2.a);
      assert(fn(1, 2) === fn2(1, 2));
    });
  });
});