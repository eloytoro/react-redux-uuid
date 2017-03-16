import {
  NAME_KEY,
  UUID_KEY,
  REGISTER,
  UNREGISTER
} from './constants';

export const registerUUID = (name, uuid) => ({
  type: REGISTER,
  meta: {
    [UUID_KEY]: uuid,
    [NAME_KEY]: name
  }
});

export const unregisterUUID = (name, uuid) => ({
  type: UNREGISTER,
  meta: {
    [UUID_KEY]: uuid,
    [NAME_KEY]: name
  }
});
