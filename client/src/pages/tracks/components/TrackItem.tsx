import { memo, MouseEvent, useState, createContext } from 'react';
//interface

import styles from '../../../shared/styles/TrackItem.module.scss';
//hooks
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import {
	useAction,
	usePlayerControl,
	useTypedSelector,
} from '../../../shared/hooks';
//components
import { TrackImage } from './TrackImage';
import { ActionMenu } from './ActionMenu';
import { DeleteTrack } from './DeleteTrack';
import { AddTrack } from './AddTrack';
import { TrackTime } from './TrackTime';
import { MusicInfo } from '../../../shared';
import { ITrack, PlayerState } from '../../../shared/types';
import { ActionRow } from './ActionRow';
import { Box } from '@material-ui/core';
import { NextThunkDispatch } from '../../../shared/store';

interface TrackItemProps {
	track: ITrack;
	playerState?: PlayerState;
}
interface ITrackContext {
	track: ITrack;
}
export const TrackContext = createContext<ITrackContext>(null);
export const TrackItem: React.FC<TrackItemProps> = memo(
	({ track, playerState }) => {
		const [isHovered, setHovered] = useState<boolean>(false);
		const { user, accessToken } = useTypedSelector(i => i.account);
		//проверка делаеется уровнем выше,  plaerState не будет передаваться неактивному
		const isActive = playerState ? true : false;
		const router = useRouter();
		const { _player, _track, _account } = useAction();

		const { playControl } = usePlayerControl();
		const dispatch = useDispatch() as NextThunkDispatch;

		const play = (event: MouseEvent<HTMLDivElement>) => {
			event.stopPropagation();
			if (!isActive) {
				dispatch(_player.setActive(track));
				return;
			}
			playControl();
		};
		const navigateToTrackPage = (e: MouseEvent<HTMLSpanElement>) => {
			e.stopPropagation();
			router.push('/tracks/' + track._id);
		};
		const handleDeleteTrack = (e: MouseEvent<HTMLDivElement>) => {
			e.stopPropagation();
			dispatch(_account.removeTrackFromMyMusic(track._id));
		};
		const handleAddTrack = (e: MouseEvent<HTMLDivElement>) => {
			e.stopPropagation();
			dispatch(_account.addTrackIntoMyMusic(track._id));
		};
		const handleHoverOn = () => setHovered(true);
		const handleHoverOff = () => setHovered(false);
		return (
			<TrackContext.Provider value={{ track: track }}>
				<Box
					className={styles.track}
					onMouseEnter={handleHoverOn}
					onMouseLeave={handleHoverOff}
					onClick={play}>
					<TrackImage
						source={track.picture}
						alt={track.text}
						isHover={isHovered}
					/>
					<MusicInfo
						className={styles.trackInfo}
						title={track.name}
						description={track.artist}
						titleClick={navigateToTrackPage}
					/>
					<Box className={styles.trackTime}>
						{isHovered ? (
							<ActionRow
								isExistInUserMusic={user?.tracks.some(i => i === track._id)}
								handlers={{
									addHandler: handleAddTrack,
									deleteHandler: handleDeleteTrack,
								}}
							/>
						) : (
							<TrackTime
								isActive={isActive}
								currentTime={playerState?.currentTime}
								duration={track.duration}
							/>
						)}
					</Box>
				</Box>
			</TrackContext.Provider>
		);
	},
);
