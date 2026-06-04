import React from 'react';

function Loader({ size = 'md' }) {
  return (
    <div className={`loader-wrap loader-${size}`} role="status" aria-label="Loading">
      <div className="loader-ring">
        <div></div><div></div><div></div><div></div>
      </div>
    </div>
  );
}

export default Loader;
