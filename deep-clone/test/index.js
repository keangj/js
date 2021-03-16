const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

const assert = chai.assert;
const DeepCloner = require('../src/index');
describe('DeepCloner', () => {
  it('是一个类', () => {
    assert.isFunction(DeepCloner);
  });
  it('拷贝基本类型', () => {
    const number = 123;
    const number2 = new DeepCloner().deepClone(number);
    assert(number === number2);
    const string = 'hello world';
    const string2 = new DeepCloner().deepClone(string);
    assert(string === string2);
    const boolean = false;
    const boolean2 = new DeepCloner().deepClone(boolean);
    assert(boolean === boolean2);
    const undefined1 = undefined;
    const undefined2 = new DeepCloner().deepClone(undefined1);
    assert(undefined1 === undefined2);
    const empty = null;
    const empty2 = new DeepCloner().deepClone(empty);
    assert(empty === empty2);
    const symbol = Symbol();
    const symbol2 = new DeepCloner().deepClone(symbol);
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
      const obj2 = new DeepCloner().deepClone(obj);
      assert(obj !== obj2);
      assert(obj.child !== obj2.child);
      assert(obj.name === obj2.name);
      assert(obj.child.name === obj2.child.name);
    });
    it('拷贝数组对象', () => {
      const array = [[1, 2], [3, 4], [5, 6]];
      const array2 = new DeepCloner().deepClone(array);
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
      fn.a = { b: { c: 'hi' }};
      const fn2 = new DeepCloner().deepClone(fn);
      assert(fn !== fn2);
      assert(fn.a.b.c === fn2.a.b.c);
      assert(fn.a.b !== fn2.a.b);
      assert(fn.a !== fn2.a);
      assert(fn(1, 2) === fn2(1, 2));
    });
    it('拷贝环', () => {
      const obj = { a: 'hi' };
      obj.self = obj;
      const obj2 = new DeepCloner().deepClone(obj);
      assert(obj !== obj2);
      assert(obj.a === obj2.a);
      assert(obj.self !== obj2.self);
    })
    it('拷贝正则表达式', () => {
      const regExp = new RegExp('hi\\d+', 'gi');
      regExp.a = { b: { c: 'hi' }};
      const regExp2 = new DeepCloner().deepClone(regExp);
      assert(regExp.source === regExp2.source);
      assert(regExp.flags === regExp2.flags);
      assert(regExp !== regExp2);
      assert(regExp.a.b.c === regExp2.a.b.c);
      assert(regExp.a.b !== regExp2.a.b);
      assert(regExp.a !== regExp2.a);
    })
    it('拷贝日期', () => {
      const date = new Date();
      date.a = { b: { c: 'hi' } };
      const date2 = new DeepCloner().deepClone(date);
      assert(date !== date2);
      assert(date.getTime() === date2.getTime());
      assert(date.a.b.c === date2.a.b.c);
      assert(date.a.b !== date2.a.b);
      assert(date.a !== date2.a);
    })
    it('不拷贝原型属性', () => {
      const obj = Object.create({ name: 'hi' });
      obj.a = { b: { c: 'hi' } };
      const obj2 = new DeepCloner().deepClone(obj);
      assert(obj !== obj2);
      assert.isFalse('name' in obj2);
      assert(obj.a.b.c === obj2.a.b.c);
      assert(obj.a.b !== obj2.a.b);
      assert(obj.a !== obj2.a);
    })
  });
});