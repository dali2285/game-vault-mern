import React from 'react';

function Message({ type = 'error', children }) {
  return (
    <div className={`message ${type}`} role="alert">
      {children}
    </div>
  );
}

export default Message;
