import React from 'react';

const Main = ({children, history}) => {
  return (
    <div className="main-container">
      <div className="container">
        {children}
      </div>
    </div>
  )
}

export default Main