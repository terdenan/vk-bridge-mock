import vkConnect, { callReceiveOnlyMethod, receiveOnlyMethods, ioMethods } from '../src';
import { ReceiveMethodName, VKConnectEvent, RequestIdProp } from '@vkontakte/vk-connect';

const dropRequestId = <A extends RequestIdProp>(data: A) => {
  const { request_id, ...out } = data;

  return out;
};

describe('Simple send', () => {
  ioMethods.forEach(methodName => {
    test(
      methodName,
      () =>
        new Promise(resolve => {
          const handler = (event: VKConnectEvent<ReceiveMethodName>) => {
            expect(event.detail.type).toBe(methodName + 'Result');
            expect(dropRequestId(event.detail.data)).toMatchSnapshot(methodName);

            resolve(vkConnect.unsubscribe(handler));
          };

          vkConnect.subscribe(handler);
          vkConnect.send(methodName as any);
        })
    );
  });
});

describe('Send promise', () => {
  ioMethods.forEach(methodName => {
    test(methodName, async () => {
      const mockData = await vkConnect.sendPromise(methodName as any);

      expect(dropRequestId(mockData)).toMatchSnapshot(methodName);
    });
  });
});

describe('Receive only events', () => {
  receiveOnlyMethods.forEach(methodName => {
    test(
      methodName,
      () =>
        new Promise(resolve => {
          const handler = (event: VKConnectEvent<ReceiveMethodName>) => {
            expect(event.detail.type).toBe(methodName);
            expect(dropRequestId(event.detail.data)).toMatchSnapshot(methodName);

            resolve(vkConnect.unsubscribe(handler));
          };

          vkConnect.subscribe(handler);
          callReceiveOnlyMethod(methodName as any);
        })
    );
  });
});
