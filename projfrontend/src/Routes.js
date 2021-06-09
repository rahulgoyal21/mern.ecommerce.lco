import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
const HomeDynamicComponent = lazy(() => import('./core/Home'));

const Routes = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route path='/' exact component={HomeDynamicComponent} />
        </Switch>
      </Suspense>
    </Router>
  );
};

export default Routes;
