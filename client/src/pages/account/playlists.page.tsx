import { AccountLayout, ContentBlock } from './components';
import React, { FC, useCallback, useEffect } from 'react';
import {
	IPlaylist,
	PlaylistMode,
	debounce,
	useAction,
	usePlaylist,
	useTypedSelector,
} from '@shared';
import { Box, Button, Grid, Typography } from '@mui/material';
import { PlaylistList } from '../../widgets';
import store, { useAppDispatch } from '@shared/store';
import { fetchUserPlaylists } from '@shared/store/ActionCreators/playlists';
import { PlaylistListSkeleton } from '@shared/ui/Skeletons';
import { Local } from '@shared/helper/localization';
import dynamic from 'next/dynamic';

const DynamicPlaylistModal = dynamic(
	() => import('../../widgets/PlaylistModal/PlaylistModal'),
	{
		loading: () => <p>Loading...</p>,
	},
);

interface IPlaylistProps {}

export const debouncedFetchPl = debounce(
	() => store.dispatch(fetchUserPlaylists()),
	500,
);

const AccountPlaylistsPage: FC<IPlaylistProps> = () => {
	//hooks
	const { userPlaylists, isUserPlaylistLoading, playlistsToDelete } =
		useTypedSelector(i => i.playlists);
	const { _playlist } = useAction();
	const dispatch = useAppDispatch();
	const deletePlaylistsOnUnmount = useCallback(() => {
		if (playlistsToDelete.length)
			dispatch(_playlist.deletePlaylists(playlistsToDelete));
	}, [playlistsToDelete]);

	useEffect(() => {
		debouncedFetchPl();
		return deletePlaylistsOnUnmount;
	}, []);

	const { close, isVisible, onSave, onUpload, control } = usePlaylist();
	return (
		<AccountLayout>
			<ContentBlock header={Local.Account.MyPlaylists}>
				{isUserPlaylistLoading ? (
					<PlaylistListSkeleton amount={10} />
				) : (
					<AccountPlaylistList playlists={userPlaylists} />
				)}
			</ContentBlock>
			{isVisible && (
				<DynamicPlaylistModal
					control={control}
					isVisible={isVisible}
					handlers={{
						onClose: close,
						onUpload,
						onSave,
					}}
				/>
			)}
		</AccountLayout>
	);
};
export default AccountPlaylistsPage;

interface IAccountPlaylistsProps {
	playlists: IPlaylist[];
}
export const AccountPlaylistList: FC<IAccountPlaylistsProps> = ({
	playlists,
}) => {
	const { open } = usePlaylist();
	const createPlaylist = () => {
		open(PlaylistMode.Create);
	};
	return playlists.length === 0 ? (
		<Grid container flexDirection='column' alignItems='center'>
			<Box mb={1}>
				<Typography variant='h6'>У вас нету ни одного плейлиста</Typography>
			</Box>
			<Button variant='contained' onClick={createPlaylist}>
				Создать плейлист
			</Button>
		</Grid>
	) : (
		<PlaylistList playlists={playlists} />
	);
};
