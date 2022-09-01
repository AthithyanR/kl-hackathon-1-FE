import React from 'react';
import {
  AppShell, Navbar, Header, Group,
} from '@mantine/core';
import {
  Outlet,
} from 'react-router-dom';
import Links from './links';
import User from './user';
import logo from '../../assets/test.png';
import './main.scss';

function Home() {
  return (
    <AppShell
      padding="md"
      fixed={false}
      navbar={(
        <Navbar width={{ base: 300 }} p="xs">
          <Navbar.Section grow mt="xs">
            <Links />
          </Navbar.Section>
          <Navbar.Section>
            <User />
          </Navbar.Section>
        </Navbar>
    )}
      header={(
        <Header height={60}>
          <Group sx={{ height: '100%' }} px={20} position="apart">
            <img src={logo} alt="test" width="230" />
          </Group>
        </Header>
    )}
      styles={(theme) => ({
        main: {
          backgroundColor:
          theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      })}
    >
      <Outlet />
    </AppShell>
  );
}

export default Home;
