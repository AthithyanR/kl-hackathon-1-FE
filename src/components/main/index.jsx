import React from 'react';
import {
  AppShell, Navbar, Avatar, ActionIcon,
} from '@mantine/core';
import { Outlet, useNavigate } from 'react-router-dom';
import { IconLogout } from '@tabler/icons';
// import { showNotification } from '@mantine/notifications';

import Links from './links';
import Logo from '../../assets/Online-Assessment-Tool-kaaylabs.svg';
import { flushLs } from '../../shared/utils';

function Home() {
  const navigate = useNavigate();
  const onLogout = () => {
    flushLs();
    navigate('/login', { replace: true });
  };
  const handleLogout = () => {
    // showNotification({
    //   title: '',
    //   message: 'Are you sure to logout?',
    // });
    onLogout();
  };
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
          <Navbar.Section className="logout-nav">
            <ActionIcon
              onClick={handleLogout}
              variant="filled"
              sx={{ backgroundColor: '#211c57' }}
              className="d-flex-all"
            >
              <IconLogout size={24} />
            </ActionIcon>
          </Navbar.Section>
        </Navbar>
    )}
    >
      <Outlet />
    </AppShell>
  );
}

export default Home;
