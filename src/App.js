// import useState
import { useState, useEffect } from 'react';
// import react router dom.
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
// import custom components.
import Home from './components/Home';
import Login from './components/Login';
import Loading from './components/Loading';
import Chat from './components/Chat';
import PrivateRoute from './components/PrivateRoute';
// import global styling.
import './index.css';
// import Context
import Context from './Context';
// create App components.
function App() {
  // create loading state and share to other components.
  // loading state will be used to show / hide loading indicator.
  const [isLoading, setIsLoading] = useState(false);
  // user state contains authenticated user.
  const [user, setUser] = useState(null);
  // comet chat.
  const [cometChat, setCometChat] = useState(null);

  useEffect(() => {
    initAuthUser();
    initCometChat();
  }, []);

  /**
   * init auth user
   */
  const initAuthUser = () => { 
    const authenticatedUser = localStorage.getItem('auth');
    if (authenticatedUser) { 
      setUser(JSON.parse(authenticatedUser));
    }
  };

  /**
   * init comet chat.
   */
   const initCometChat = async () => {
    const { CometChat } = await import('@cometchat-pro/chat');
    const appID = `${process.env.REACT_APP_COMETCHAT_APP_ID}`;
    const region = `${process.env.REACT_APP_COMETCHAT_REGION}`;
    const appSetting = new CometChat.AppSettingsBuilder().subscribePresenceForAllUsers().setRegion(region).build();
    CometChat.init(appID, appSetting).then(
      () => {
        setCometChat(() => CometChat);
      },
      error => {
      }
    );
  }

  return (
    <Context.Provider value={{isLoading, setIsLoading, user, setUser, cometChat }}>
      <Router>
        <Switch>
          {/* Home Route */}
          <PrivateRoute exact path="/" component={Home} />
          <PrivateRoute exact path="/chat" component={Chat} />
          {/* End Home Route */}
          {/* Login Route */}
          <Route exact path="/login">
            <Login />
          </Route>
          {/* End Login Route */}
        </Switch>
      </Router>
      {isLoading && <Loading />}
    </Context.Provider>
  );
}

export default App;
