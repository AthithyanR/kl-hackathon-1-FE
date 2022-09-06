import React, { useState } from 'react';
import {
  IconAperture,
  IconFingerprint,
  IconKey,
  IconSettings,
  IconArtboardOff,
  IconBabyCarriage,
} from '@tabler/icons';
import { NavLink } from '@mantine/core';
import { Link, useLocation } from 'react-router-dom';

function MainLink({ icon: Icon, link }) {
  const location = useLocation();

  return (
    <NavLink
      className="siderMenu"
      component={Link}
      to={link}
      active={location.pathname === link}
      icon={<Icon size={24} stroke={1.5} />}
    />
  );
}

const data = [
  {
    icon: IconAperture,
    color: 'blue',
    label: 'Dashboard',
    link: '/dashboard',
  },
  {
    icon: IconBabyCarriage,
    color: 'blue',
    label: 'Schedule Interview',
    link: '/schedule-interview',
  },
  {
    icon: IconArtboardOff,
    color: 'teal',
    label: 'Questions',
    link: '/questions',
  },
  {
    icon: IconKey,
    color: 'violet',
    label: 'Reports',
    link: '/reports',
  },
  {
    icon: IconFingerprint,
    color: 'grape',
    label: 'User',
    link: '/user',
  },
  {
    icon: IconSettings,
    color: 'grape',
    label: 'Settings',
    link: '/settings',
  },
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
