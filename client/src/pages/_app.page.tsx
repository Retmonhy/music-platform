import React, { createContext, useLayoutEffect } from 'react';
import { Provider } from 'react-redux';
import { AppProps } from 'next/app';
import { StorageKeys, useAction } from '@shared';
import store, { useAppDispatch, wrapper } from '@shared/store';
import { MainLayout } from '../widgets';
import { debouncedFetchPl } from './account/playlists.page';
import '@shared/styles/global.css';
import '@shared/styles/Global.scss';

export let audio: HTMLAudioElement | null = null;
export const setAudioInstance = (newAudio: HTMLAudioElement) => {
	audio = newAudio;
};
export const IsSsrMobileContext = createContext(false);
const WrappedApp: React.FC<AppProps> = ({ Component, ...pageProps }) => {
	// const { store, props } = wrapper.useWrappedStore(pageProps); //это строчка создавала дополнительный инстанс стора
	//так как WrappedApp вызывается при рендере кадой страницы, то наверное будет вызыватьсяэтот юзЭффект всегда
	const dispatch = useAppDispatch();
	const { _account } = useAction();
	useLayoutEffect(() => {
		if (localStorage && localStorage.getItem(StorageKeys.accessToken)) {
			dispatch(_account.checkAuth()).then(() => {
				debouncedFetchPl();
			});
		}
	}, []);
	return (
		//ts-ignore
		<IsSsrMobileContext.Provider value={pageProps.pageProps.isSsrMobile}>
			<Provider store={store}>
				<MainLayout>
					<Component {...pageProps} />
				</MainLayout>
			</Provider>
		</IsSsrMobileContext.Provider>
	);
};
export default wrapper.withRedux(WrappedApp);