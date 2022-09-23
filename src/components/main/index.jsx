import React from 'react';
import {
  AppShell, Navbar, Avatar, ActionIcon, Header, Grid,
} from '@mantine/core';
import { Outlet, useNavigate } from 'react-router-dom';
import { IconLogout } from '@tabler/icons';
import Links from './links';
import Logo from '../../assets/Kaaylabs.png';
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
      header={(
        <Header height={54}>
          <Grid justify="space-between" align="Center">
            <Grid.Col span={1}>
              <Avatar src={Logo} alt="Kaaylabs-MCQ" style={{ marginLeft: '1em', marginTop: '3px' }} />
            </Grid.Col>
            <Grid.Col span={1}>
              <ActionIcon onClick={handleLogout} style={{ margin: 'auto', marginRight: '1em', color: '#5F55D2' }}>
                <IconLogout size={26} />
              </ActionIcon>
            </Grid.Col>
          </Grid>

        </Header>
      )}
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
