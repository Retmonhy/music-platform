import { IComment, ITrack, IUser } from '../../types';

export interface ICommentResponse {
	isSuccess: boolean;
	comment: IComment;
}
export interface ICreateTrackResponse {
	isSuccess: boolean;
	track: ITrack;
}
export interface IDeleteTrackResponse {
	isSuccess: boolean;
	trackId: string;
}
export interface ILoginUserResponse {
	accessToken: string;
	refreshToken: string;
	user: IUser;
}
export interface IUpdateProfileResponse {
	isSuccess: boolean;
	user: IUser;
}
