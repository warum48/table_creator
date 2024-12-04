import React, { Component, Suspense } from 'react';
import ErrorFallback from './ErrorFallback';
import ErrorBoundary from './ErrorBoundary';

//@ts-ignore
const SuspenseWrapper = ({ component: Component, fallback = <div>Loading...</div> }) => { //Component
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={fallback}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
};

export default SuspenseWrapper;


// SuspenseComponent.jsx

/*
import React, { Suspense } from 'react';
import ErrorBoundary from './ErrorBoundary';
//import ErrorFallback from './ErrorFallback';
import fetchData from './fetchData'; // Simulate a fetch call
import ErrorFallback from './ErrorFallback';
//import ErrorFallback from './ErrorFallback';

const Resource = React.lazy(() => import('./Resource')); // Assume Resource is a component that fetches data

const SuspenseComponent = () => {
  return (
    <div>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<div>Loading...</div>}>
          <Resource />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default SuspenseComponent;*/
