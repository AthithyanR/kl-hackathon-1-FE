import React from 'react';
import { AppShell, Navbar, Avatar } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import Links from './links';
import Logo from '../../assets/Online-Assessment-Tool-kaaylabs.svg';

function Home() {
  return (
    <AppShell
      fixed={false}
      navbar={(
        <Navbar className="sider">
          <Navbar.Section>
            <Avatar
              src={Logo}
              alt="Kaaylabs-MCQ"
            />
          </Navbar.Section>
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
