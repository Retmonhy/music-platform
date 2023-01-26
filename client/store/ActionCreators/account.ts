import { ILoginData, IUpdateData } from './../../shared/types/auth';
import { useDispatch } from 'react-redux';
import { AccountAction, AccountActionTypes } from './../../types/account';
import { Dispatch } from 'react';
import {
	api,
	AccountEndpoints,
	ILoginUserResponse,
	IUpdateProfileResponse,
} from '../../shared/api';
import { IRegistrationData } from '../../shared';

export const setIsLoading = (
	dispatch: Dispatch<AccountAction>,
	value: boolean,
) => {
	dispatch({
		type: AccountActionTypes.LOADING,
		payload: value,
	});
};

export const registration = async (payload: IRegistrationData) => {
	return async (dispatch: Dispatch<AccountAction>) => {
		try {
			setIsLoading(dispatch, true);
			const { data } = await api.post<ILoginUserResponse>(
				AccountEndpoints.REGISTRATION,
				payload,
			);
			localStorage.setItem('refreshToken', data.refreshToken);
			setIsLoading(dispatch, false);
			return dispatch({
				type: AccountActionTypes.AUTHORIZATION,
				payload: data,
			});
		} catch (error) {
			console.error('loginError: ', error);
			setIsLoading(dispatch, false);
		}
	};
};
export const login = async (payload: ILoginData) => {
	return async (dispatch: Dispatch<AccountAction>) => {
		try {
			setIsLoading(dispatch, true);
			const { data } = await api.post<ILoginUserResponse>(
				AccountEndpoints.LOGIN,
				payload,
				{},
			);
			localStorage.setItem('refreshToken', data.refreshToken);
			setIsLoading(dispatch, false);
			return dispatch({
				type: AccountActionTypes.AUTHORIZATION,
				payload: data,
			});
		} catch (error) {
			setIsLoading(dispatch, false);
			console.error('loginError: ', error);
		}
	};
};
export const logout = () => {
	return async (dispatch: Dispatch<AccountAction>) => {
		try {
			setIsLoading(dispatch, true);
			const { data } = await api.post(AccountEndpoints.LOGOUT);
			localStorage.removeItem('refreshToken');
			setIsLoading(dispatch, false);
			return dispatch({
				type: AccountActionTypes.LOGOUT,
			});
		} catch (error) {
			console.error('logoutError: ', error);
			setIsLoading(dispatch, false);
		}
	};
};
export const update = (userToken: string, payload: IUpdateData) => {
	return async (dispatch: Dispatch<AccountAction>) => {
		try {
			setIsLoading(dispatch, true);
			const { data } = await api.post<IUpdateProfileResponse>(
				AccountEndpoints.UPDATE,
				payload,
				{ params: { userToken } },
			);
			if (!data.isSuccess) return;
			console.log('apiInstance = ', data);
			dispatch({
				type: AccountActionTypes.UPDATE,
				payload: data.user,
			});
			setIsLoading(dispatch, false);
		} catch (error) {
			console.error('update Error: ', error);

			setIsLoading(dispatch, false);
		}
	};
};
