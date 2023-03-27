import { createAction } from '@reduxjs/toolkit';
import { PlayerActionTypes, ITrack } from '../../types';
//action creators - это просто функции которые возвращают action
// action - протсо обЪект

export const playTrack = createAction(PlayerActionTypes.PLAY);
export const pauseTrack = createAction(PlayerActionTypes.PAUSE);
export const startPrev = createAction(PlayerActionTypes.START_PREV);
export const startNext = createAction(PlayerActionTypes.START_NEXT);

export const setDuration = createAction<number>(PlayerActionTypes.SET_DURATION);
export const setActive = createAction<ITrack>(PlayerActionTypes.SET_ACTIVE);
export const setVolume = createAction<number>(PlayerActionTypes.SET_VOLUME);
export const setCurrentTime = createAction<number>(
	PlayerActionTypes.SET_CURRENT_TIME,
);
export const setCurrentPlaylist = createAction<ITrack[]>(
	PlayerActionTypes.SET_CURRENT_PLAYLIST,
);
export const addTrackInQueue = createAction<ITrack>(
	PlayerActionTypes.ADD_TRACK_IN_QUEUE,
);
