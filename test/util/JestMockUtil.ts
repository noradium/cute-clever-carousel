export namespace JestMockUtil {
  export function mockClear(target: any) {
    target.mockClear();
  }

  export function getCalls(target: any): any[][] {
    return target.mock.calls;
  }

  export function getInstances(target: any): any[] {
    return target.mock.instances;
  }

  export function mockReturnValueOnce(target: any, value: any) {
    target.mockReturnValueOnce(value);
  }
}
