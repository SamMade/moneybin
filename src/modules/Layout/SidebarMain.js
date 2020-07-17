import React from 'react';

import styles from './SidebarMain.module.css';

export default function SidebarMain({sidebar, children}) {
  return (
    <div id={styles['SidebarMain']}>
      <div id={styles['SidebarMain-menu--expanded']}>
        {sidebar}
        <span id={styles['SidebarMain-menu--hamburger']}></span>
      </div>
      <div>
        {children}
      </div>
    </div>
  )
}