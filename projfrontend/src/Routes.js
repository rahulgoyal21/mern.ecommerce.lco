import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
const HomeDynamicComponent = lazy(() => import('./core/Home'));
const SignupDynamicComponent = lazy(() => import('./user/Signup'));
const SigninDynamicComponent = lazy(() => import('./user/Signin'));
// import HomeDynamicComponent from './core/Home';
// import SignupDynamicComponent from './user/Signup';
// import SigninDynamicComponent from './user/Signin';

const Routes = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route path='/' exact component={HomeDynamicComponent} />
          <Route path='/signup' exact component={SignupDynamicComponent} />
          <Route path='/signin' exact component={SigninDynamicComponent} />
        </Switch>
      </Suspense>
    </Router>
  );
};

export default Routes;
