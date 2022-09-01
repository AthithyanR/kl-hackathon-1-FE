import React, { useState } from 'react';
import {
  // IconBellRinging,
  // IconFingerprint,
  // IconKey,
  // IconSettings,
  IconQuestionMark,
  IconSchema,
} from '@tabler/icons';
import {
  ThemeIcon, UnstyledButton, Group, Text,
} from '@mantine/core';
import {
  Link,
} from 'react-router-dom';

function MainLink({
  icon: Icon, color, label, setActive, active, link,
}) {
  return (
    <UnstyledButton
      sx={(theme) => ({
        display: 'block',
        width: '100%',
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
        backgroundColor: link === active && '#438fdc',
        '&:hover': {
          backgroundColor:
          theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },
      })}
      onClick={() => setActive(link)}
    >
      <Link to={link}>
        <Group>
          <ThemeIcon color={color} variant="light">
            <Icon stroke={1.5} />
          </ThemeIcon>
          <Text size="sm">{label}</Text>
        </Group>
      </Link>

    </UnstyledButton>
  );
}

const data = [
  // {
  //   icon: IconBellRinging, color: 'blue', label: 'Dashboard', link: '/dashboard',
  // },
  {
    icon: IconSchema, color: 'blue', label: 'Schedule Interview', link: '/schedule-interview',
  },
  {
    icon: IconQuestionMark, color: 'teal', label: 'Questions', link: '/questions',
  },
  // {
  //   icon: IconKey, color: 'violet', label: 'Reports', link: '/reports',
  // },
  // {
  //   icon: IconFingerprint, color: 'grape', label: 'User', link: '/user',
  // },
  // {
  //   icon: IconSettings, color: 'grape', label: 'Settings', link: '/settings',
  // },
];

function MainLinks() {
  const [active, setActive] = useState('/schedule-interview');
  const links = data.map((item) => (
    <MainLink
      active={active}
      setActive={setActive}
      icon={item.icon}
      color={item.color}
      label={item.label}
      key={item.label}
      link={item.link}
    />
  ));
  return <div>{links}</div>;
}

export default MainLinks;
