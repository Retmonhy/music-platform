import {
	fetchUserMusic,
	fetchUserPlaylists,
	removeTrackFromMyMusic,
	addTrackIntoMyMusic,
	changeRouteTo,
	checkAuth,
	logout,
	update,
} from './../ActionCreators/account';

import { AnyAction, createReducer, PayloadAction } from '@reduxjs/toolkit';
import { FulfilledAction, PendingAction, RejectedAction } from '.';
import {
	IMenuItem,
	AccountRoutes,
	IAuthorizationAction,
	AccountActionTypes,
	AccountState,
	ITrack,
	IPlaylist,
	IRefreshAction,
} from '../../types';

const menuList: IMenuItem[] = [
	{
		name: 'Личные данные',
		isSelected: false,
		href: AccountRoutes.Profile,
	},
	{
		name: 'Моя музыка',
		isSelected: false,
		href: AccountRoutes.Tracks,
	},
	{
		name: 'Мои плейлисты',
		isSelected: false,
		href: AccountRoutes.Playlists,
	},
	{
		name: 'Музыкантам',
		isSelected: false,
		href: AccountRoutes.Musition,
	},
];

function isPendingAction(action: AnyAction): action is PendingAction {
	return action.type.endsWith('/pending');
}
function isRejectedAction(action: AnyAction): action is RejectedAction {
	return action.type.endsWith('/rejected');
}
function isFulfilledAction(action: AnyAction): action is FulfilledAction {
	return action.type.endsWith('/fulfilled');
}
function isAuthorizationAction(action: IAuthorizationAction) {
	return action.type === `${AccountActionTypes.AUTHORIZATION}/fulfilled`;
}

const initialState: AccountState = {
	accessToken: null,
	refreshToken: null,
	user: null,
	isLoading: false,
	isAuth: false,
	routes: menuList,
	userTracks: [],
	userPlaylists: [],
	isHidrated: true,
};
export const accountReducer = createReducer(
	initialState as AccountState,
	builder => {
		builder
			.addCase(changeRouteTo, (state, action) => ({
				...state,
				routes: menuList.map(i =>
					i.href === action.payload ? { ...i, isSelected: true } : i,
				),
			}))

			.addCase(logout.fulfilled, () => initialState)
			.addCase(update.fulfilled, (state, action) => ({
				...state,
				user: action.payload,
			}))
			.addCase(
				fetchUserMusic.fulfilled,
				(state, action: PayloadAction<ITrack[]>) => {
					state.userTracks = action.payload;
				},
			)
			.addCase(addTrackIntoMyMusic.fulfilled, (state, action) => {
				if (state.isAuth && action.payload) {
					state.userTracks = [action.payload, ...state.userTracks];
					state.user.tracks = [...state.user.tracks, action.payload._id];
				}
				return state;
			})
			.addCase(removeTrackFromMyMusic.fulfilled, (state, action) => {
				state.userTracks = state.userTracks.filter(
					track => track._id !== action.payload,
				);
				state.user.tracks = state.user.tracks.filter(
					id => id !== action.payload,
				);
			})
			.addCase(
				fetchUserPlaylists.fulfilled,
				(state, action: PayloadAction<IPlaylist[]>) => {
					state.userPlaylists = action.payload;
				},
			)
			.addMatcher(isAuthorizationAction, (state, action: IRefreshAction) => {
				state.isAuth = true;
				state.user = action.payload.user;
				state.accessToken = action.payload.accessToken;
				state.refreshToken = action.payload.refreshToken;
			})
			//для всех промисов, которые в ожидании
			.addMatcher(isPendingAction, state => {
				state.isLoading = true;
			})
			//для всех промисов, которые разрешились успехом
			.addMatcher(isFulfilledAction, state => {
				state.isLoading = false;
			})
			//для всех промисов, которые выдают ошибку
			.addMatcher(isRejectedAction, state => {
				state.isLoading = false;
			})
			.addDefaultCase(store => store);
	},
);