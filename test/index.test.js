import * as lib from '../src';

describe('index', () => {
  it('exports all the functionality', () => {
    expect(typeof lib.createUUIDReducer).toBe('function');
    expect(typeof lib.connectUUID).toBe('function');
    expect(typeof lib.registerUUID).toBe('function');
    expect(typeof lib.unregisterUUID).toBe('function');
    expect(typeof lib.createUUID).toBe('function');
    expect(typeof lib.wrapActionCreators).toBe('function');
    expect(typeof lib.getUUIDState).toBe('function');
    expect(typeof lib.getRegisteredUUIDs).toBe('function');
  })
});
