import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { Provider } from "react-redux";
import store from "src/store";
import AuthLayout from "src/components/AuthLayout";
import SignIn from "src/components/SignIn/SignIn";
import MainLayout from "src/components/MainLayout";
import Home from "src/components/Home";
import SendTokens from "src/components/SendTokens";
import SetRequest from "src/components/airequest/SetRequest";
import "antd/dist/antd.css";
import Pin from "src/components/Pin";

const App = ({}) => {
    let persistor = persistStore(store);
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Router>
                    <Switch>
                        <Route path="/signin">
                            <AuthLayout>
                                <SignIn />
                            </AuthLayout>
                        </Route>
                        <Route path="/send-tokens">
                            <MainLayout>
                                <SendTokens />
                            </MainLayout>
                        </Route>
                        <Route path="/pin">
                            <MainLayout>
                                <Pin />
                            </MainLayout>
                        </Route>
                        <Route path="/ai_request/set">
                            <MainLayout>
                                <SetRequest />
                            </MainLayout>
                        </Route>
                        <Route path="/">
                            <MainLayout>
                                <Home />
                            </MainLayout>
                        </Route>
                    </Switch>
                </Router>
            </PersistGate>
        </Provider>
    );
};

export default App;
