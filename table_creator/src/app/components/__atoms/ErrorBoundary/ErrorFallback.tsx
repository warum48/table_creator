// ErrorFallback.jsx
import React from 'react';

const ErrorFallback = ({ error }: { error: Error }) => {
  return (
    <div role="alert" className="text-xs opacity-50">
      <p>Something went wrong:</p>
      {error.message}
    </div>
  );
};

export default ErrorFallback;
