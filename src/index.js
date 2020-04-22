import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import * as serviceWorker from './serviceWorker';
import GlobalStyles from  "./global-styles";
import App from './components/App';
import { FluxProvider } from './components/FluxProvider';
import Dashboard from './components/Dashboard';

ReactDOM.render(
	<>
		<GlobalStyles/>
		<FluxProvider>
				<Router>
					<Route exact path="/" component={App}/>
					<Route exact path="/dashboard" component={Dashboard}/>
					<Route path="/market/:marketId?" component={App}/>
				</Router>
		</FluxProvider>
	</>
	, 
	document.getElementById('root')
);

serviceWorker.unregister();