import React, { useState } from 'react';
import {
  IconBuildingSkyscraper,
  IconZoomQuestion,
  IconAugmentedReality,
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
    icon: IconBuildingSkyscraper,
    // color: 'blue',
    label: 'Assessment',
    link: '/assessment',
  },
  {
    icon: IconZoomQuestion,
    // color: 'teal',
    label: 'Questions',
    link: '/questions',
  },
  {
    icon: IconAugmentedReality,
    // color: 'grape',
    label: 'Tech Types',
    link: '/tech-types',
  },
];

function MainLinks() {
  const [active, setActive] = useState('/interview');
  const links = data.map((item) => (
    <MainLink
      active={active}
      setActive={setActive}
      icon={item.icon}
      // color={item.color}
      label={item.label}
      key={item.label}
      link={item.link}
    />
  ));
  return <div>{links}</div>;
}

export default MainLinks;
