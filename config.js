
const config = {
	errorMessages: {
		WRONG_USERNAME_PASSWORD: 'Check your Username or/and password',
		OCCUPIED_NAME: 'That name is already occupied',
		EMPTY_FIELD: 'Fill out this field',
		SHORT_PASSWORD: 'Minimal 6 symbols',
		OCCUPIED_TASK_NAME: 'You already have such a task',
	},
	routes: {
		START_PAGE: '/',
		RULE_TIMER: '/timer',
		TIME_LOG: '/log',
		ANY_ROUTE: '/*',
	},
	headerTitles: {
		DEFAULT: 'Time Point',
		RULE_TIMER: 'Manage your time',
		TIME_LOG: 'Your time is here',
		NOT_FOUND: 'Sorry, Page not found:(',
	},
	urls: {
		LOGOUT: '/?logout=true',
	},
	keyCodes: {
		ENTER: 13,
	},
}

export default config;
