import React from 'react';

export default function SidebarMain({sidebar, children}) {
  return (
    <div className="pure-g">
      <div className="pure-u-1-5">
        {sidebar}
      </div>
      <div className="pure-u-4-5">
        {children}
      </div>
    </div>
  )
}