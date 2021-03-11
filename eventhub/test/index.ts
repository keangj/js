import EventHub from '../src/index';

type TestCase = (message: string) => void;

const test1: TestCase = message => {
  const eventHub = new EventHub;
  console.assert(eventHub instanceof Object === true, 'eventHub 是个对象');
  console.log(message);
}

const test2: TestCase = message => {
  const eventHub = new EventHub;
  let called = false;
  eventHub.on('hi', data => {
    called = true
    console.assert(data === 'hello world')
  });
  
  eventHub.emit('hi', 'hello world')
  setTimeout(() => {
    console.assert(called === true)
    console.log(message);
  }, 1000);
}

const test3: TestCase = message => {
  const eventHub = new EventHub;
  let called = false;
  const fn = (data) => {
    called = true
  }
  eventHub.on('hi', fn);
  eventHub.off('hi', fn);
  eventHub.emit('hi');
  
  setTimeout(() => {
    console.assert(called === false);
    console.log(message);
  }, 1000);
}

test1('event 创建对象');
test2('on 后 使用 emit 可以触发 on 注册的函数');
test3('off 可以取消 on， 使 emit 无法触发');
