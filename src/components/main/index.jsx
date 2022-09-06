import React from 'react';
import { AppShell, Navbar } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import Links from './links';
// import User from './user';

function Home() {
  return (
    <AppShell
      fixed={false}
      navbar={(
        <Navbar className="sider">
          <Navbar.Section>
            <Links />
          </Navbar.Section>
        </Navbar>
    )}
    >
      <Outlet />
    </AppShell>
  );
}

export default Home;
