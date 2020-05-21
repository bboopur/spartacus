
import { GigyaAuthActions } from '../actions/index';
import { UserToken } from '@spartacus/core';
import * as fromUserToken from './gigya-user-token.reducer';

const testToken: UserToken = {
  access_token: 'xxx',
  token_type: 'bearer',
  refresh_token: 'xxx',
  expires_in: 1000,
  scope: ['xxx'],
  userId: 'xxx',
};

describe('UserToken reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromUserToken;
      const action = {} as GigyaAuthActions.GigyaUserTokenAction;
      const state = fromUserToken.reducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('LOAD_USER_TOKEN_SUCCESS action', () => {
    it('should store a user token', () => {
      const { initialState } = fromUserToken;

      const action = new GigyaAuthActions.LoadUserTokenSuccess(testToken);
      const state = fromUserToken.reducer(initialState, action);

      expect(state).toEqual(testToken);
    });
  });

  describe('LOAD_USER_TOKEN_FAIL action', () => {
    it('should store a default state', () => {
      const { initialState } = fromUserToken;

      const action = new GigyaAuthActions.LoadUserTokenFail(testToken);
      const state = fromUserToken.reducer(initialState, action);

      expect(state).toEqual(initialState);
    });
  });
});