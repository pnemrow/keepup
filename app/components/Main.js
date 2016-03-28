import React from 'react';
import mui from 'material-ui'
import {AppCanvas, AppBar} from 'material-ui'


const Main = ({children, history}) => {
  return (
    <div>
      <AppBar />
      <AppCanvas>
        {children}
      </AppCanvas>
    </div>
  )
}

export default Main