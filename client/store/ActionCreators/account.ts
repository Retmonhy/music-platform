import { ILoginData, IUpdateData } from '../../shared/types/auth';
import { AccountActionTypes } from '../../types/account';
import { AccountService, IRegistrationData, StorageKeys } from '../../shared';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { ITrack } from '../../types';

interface IArgUpdate {
	payload: IUpdateData;
	accessToken: string;
}
interface IAddTrack {
	id: string;
	accessToken: string;
}
export const loading = createAction<boolean>(AccountActionTypes.LOADING);
export const changeRouteTo = createAction<string>(
	AccountActionTypes.CHANGE_ROUTE,
);
export const login = createAsyncThunk(
	AccountActionTypes.AUTHORIZATION,
	async (payload: ILoginData, ta) => {
		try {
			const { data } = await AccountService.login(payload);
			if (data) {
				localStorage.setItem(StorageKeys.accessToken, data.accessToken);
			}
			return data;
		} catch (error) {
			console.error('login ERROR: ', error);
			return ta.rejectWithValue(error.response.data);
		}
	},
);
export const registration = createAsyncThunk(
	AccountActionTypes.AUTHORIZATION,
	async (payload: IRegistrationData, ta) => {
		try {
			const { data } = await AccountService.registration(payload);
			if (data) {
				localStorage.setItem(StorageKeys.accessToken, data.accessToken);
			}
			return data;
		} catch (error) {
			console.error('registration ERROR: ', error);
			return ta.rejectWithValue(error.response.data);
		}
	},
);
export const logout = createAsyncThunk(
	AccountActionTypes.LOGOUT,
	async (_, ta) => {
		try {
			return await AccountService.logout();
		} catch (error) {
			console.error('logout ERROR: ', error);
			return ta.rejectWithValue(error.response.data);
		}
	},
);
export const update = createAsyncThunk(
	AccountActionTypes.UPDATE,
	async ({ accessToken, payload }: IArgUpdate, ta) => {
		try {
			const { data } = await AccountService.updateProfile({
				payload,
				accessToken,
			});
			if (data.user) {
				return data.user;
			}
		} catch (error) {
			console.error('update ERROR: ', error);
			return ta.rejectWithValue(error.response.data);
		}
	},
);
export const checkAuth = createAsyncThunk(
	AccountActionTypes.AUTHORIZATION,
	async (_, ta) => {
		try {
			const { data } = await AccountService.checkAuth();
			if (data.accessToken) {
				localStorage.setItem(StorageKeys.accessToken, data.accessToken);
			}
			return data;
		} catch (error) {
			console.error('update ERROR: ', error);
			return ta.rejectWithValue(error.response.data);
		}
	},
);
export const addTrackIntoMyMusic = createAsyncThunk(
	AccountActionTypes.ADD_TRACK,
	async (trackId: string, ta) => {
		try {
			const { data } = await AccountService.addTrack({ id: trackId });
			if (data.isSuccess) {
				return data.track;
			} else {
				return null;
			}
		} catch (error) {
			console.error('update ERROR: ', error);
			return ta.rejectWithValue(error.response.data);
		}
	},
);
export const fetchUserMusic = createAsyncThunk(
	AccountActionTypes.FETCH_USER_MUSIC,
	async (_, ta) => {
		try {
			const { data } = await AccountService.fetchUserMusic();
			if (data) {
				return data;
			}
		} catch (error) {
			console.error('fetchUserMusic ERROR: ', error);
			return ta.rejectWithValue(error.response.data);
		}
	},
);
