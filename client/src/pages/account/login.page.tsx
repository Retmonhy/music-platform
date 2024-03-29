import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Card, Tab, Tabs } from '@mui/material';
import { useAction, useTypedSelector } from '@shared/hooks';
import { RegistrationForm, LoginForm } from './components';
import {
	AccountRoutes,
	H1,
	ILoginData,
	IRegistrationData,
	RegistrationModes,
	TabPanelProps,
} from '@shared';
import { useAppDispatch } from '@shared/store';
import { Local } from '@shared/helper/localization';

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role='tabpanel'
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Box>{children}</Box>
				</Box>
			)}
		</div>
	);
}
const AuthPage = () => {
	//hooks
	const { isAuth, isLoading } = useTypedSelector(i => i.account);
	const [mode, setMode] = useState<RegistrationModes>(RegistrationModes.REG);
	const router = useRouter();
	const dispatch = useAppDispatch();
	const { _account } = useAction();
	useEffect(() => {
		if (isAuth) {
			router.replace(AccountRoutes.Profile); // как-то долго отрабатывает
		}
	}, [isAuth]);
	//functions
	const handleChange = (
		event: React.SyntheticEvent,
		newValue: RegistrationModes,
	) => {
		setMode(newValue);
	};
	const registrationSubmit = async (payload: IRegistrationData) => {
		dispatch(_account.registration(payload));
	};
	const loginSubmit = async (payload: ILoginData) => {
		dispatch(_account.login(payload));
	};
	return (
		<Box maxWidth={600} margin='0 auto' pt={4}>
			<H1>{Local.Account.LoginPageTitle}</H1>
			<Card>
				<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
					<Tabs
						variant='fullWidth'
						value={mode}
						onChange={handleChange}
						aria-label='auth tabs'>
						<Tab
							className='auth-tab'
							label={Local.Account.Registration}
							value={RegistrationModes.REG}
						/>
						<Tab
							className='auth-tab'
							label={Local.Account.Login}
							value={RegistrationModes.LOGIN}
						/>
					</Tabs>
					<TabPanel value={mode} index={RegistrationModes.REG}>
						<RegistrationForm onSubmit={registrationSubmit} />
					</TabPanel>
					<TabPanel value={mode} index={RegistrationModes.LOGIN}>
						<LoginForm onSubmit={loginSubmit} />
					</TabPanel>
				</Box>
			</Card>
		</Box>
	);
};
export default AuthPage;
