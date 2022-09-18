/* eslint-disable consistent-return */
/* eslint-disable max-len */
/* eslint-disable import/no-named-as-default */
/* eslint-disable object-curly-newline */
/* eslint-disable no-shadow */
/* eslint-disable no-nested-ternary */
import { forwardRef, React, useState } from 'react';
import {
  MultiSelect, Paper, Button, TextInput, NativeSelect, createStyles, Progress,
  Avatar, Group, Text, SegmentedControl, Tabs, Accordion,
} from '@mantine/core';
import { useInterval } from '@mantine/hooks';
import { useForm } from '@mantine/form';

const time = [
  { value: 'hours', label: 'Hours' },
  { value: 'day', label: 'Day' },
];
const useStyles = createStyles((theme) => ({
  button: {
    position: 'relative',
    transition: 'background-color 150ms ease',
  },

  progress: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    left: -1,
    top: -1,
    height: 'auto',
    backgroundColor: 'transparent',
    zIndex: 0,
  },

  label: {
    position: 'relative',
    zIndex: 1,
  },
  root: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    borderRadius: theme.radius.sm,
  },

  item: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    border: '1px solid transparent',
    position: 'relative',
    zIndex: 0,
    transition: 'transform 150ms ease',

    '&[data-active]': {
      transform: 'scale(1.03)',
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
      boxShadow: theme.shadows.md,
      borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2],
      borderRadius: theme.radius.md,
      zIndex: 1,
    },
  },

  chevron: {
    '&[data-rotate]': {
      transform: 'rotate(-90deg)',
    },
  },
}));

const searchData = [
  {
    image: 'https://img.icons8.com/clouds/256/000000/futurama-bender.png',
    label: 'Angular',
    value: 'Angular',
    description: 'Fascinated with cooking',
  },

  {
    image: 'https://img.icons8.com/clouds/256/000000/futurama-mom.png',
    label: 'Python',
    value: 'Python',
    description: 'One of the richest people on Earth',
  },
  {
    image: 'https://img.icons8.com/clouds/256/000000/futurama-mom.png',
    label: 'Node JS',
    value: 'Node JS',
    description: 'One of the richest people on Earth',
  },
  {
    image: 'https://img.icons8.com/clouds/256/000000/futurama-mom.png',
    label: 'JavaScript',
    value: 'JavaScript',
    description: 'One of the richest people on Earth',
  },
  {
    image: 'https://img.icons8.com/clouds/256/000000/futurama-mom.png',
    label: 'HTML',
    value: 'HTML',
    description: 'One of the richest people on Earth',
  },
  {
    image: 'https://img.icons8.com/clouds/256/000000/futurama-mom.png',
    label: 'DataBase',
    value: 'DataBase',
    description: 'One of the richest people on Earth',
  },
  {
    image: 'https://img.icons8.com/clouds/256/000000/futurama-mom.png',
    label: 'React',
    value: 'React',
    description: 'One of the richest people on Earth',
  },
  {
    image: 'https://img.icons8.com/clouds/256/000000/futurama-mom.png',
    label: 'Java',
    value: 'Java',
    description: 'One of the richest people on Earth',
  },
  {
    image: 'https://img.icons8.com/clouds/256/000000/futurama-mom.png',
    label: 'Spring Boot',
    value: 'Spring Boot',
    description: 'One of the richest people on Earth',
  },
  {
    image: 'https://img.icons8.com/clouds/256/000000/futurama-mom.png',
    label: 'CSS',
    value: 'CSS',
    description: 'One of the richest people on Earth',
  },
  {
    image: 'https://img.icons8.com/clouds/256/000000/futurama-mom.png',
    label: 'Golang',
    value: 'Golang',
    description: 'One of the richest people on Earth',
  },
];

const SelectItem = forwardRef(
  ({ image, label, ...others }, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar src={image} />

        <div>
          <Text>{label}</Text>
        </div>
      </Group>
    </div>
  ),
);

function Demo() {
  const select = (
    <NativeSelect
      data={time}
      styles={{
        input: {
          fontWeight: 500,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        },
      }}
    />
  );

  const data = useForm({
    initialValues: {
      email: '',
      passthreshold: '',
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      passthreshold: (val) => (val.length === 0 ? 'please Enter pass-threshold' : null),
    },
  });

  const { classes, theme } = useStyles();
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const interval = useInterval(
    () => setProgress((current) => {
      if (current < 100) {
        return current + 1;
      }

      interval.stop();
      setLoaded(true);
      return 0;
    }),
    20,
  );

  return (
    <Paper shadow="md" p="md" withBorder>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <MultiSelect
          label="Select Tech-Type"
          placeholder="Select Language"
          itemComponent={SelectItem}
          data={searchData}
          searchable
          nothingFound="Nobody here"
          maxDropdownHeight={400}
          filter={(value, selected, item) => !selected
          && (item.label.toLowerCase().includes(value.toLowerCase().trim())
            || item.description.toLowerCase().includes(value.toLowerCase().trim()))}
          style={{ textAlign: 'center', width: '80%' }}
        />
      </div>
      <Paper
        sx={(theme) => ({
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
          textAlign: 'center',
          padding: theme.spacing.xl,
          borderRadius: theme.radius.md,
          // cursor: 'pointer',

          '&:hover': {
            backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
          },
        })}
        style={{ marginTop: '5%' }}
      >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Paper sx={(theme) => ({ padding: theme.spacing.xl })} style={{ width: '100%' }}>
            <SegmentedControl
              transitionDuration={500}
              transitionTimingFunction="linear"
              data={searchData}
            />
            <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '2%', width: '100%' }}>
              <div style={{ width: '70%' }}>
                <Accordion
                  sx={{ maxWidth: 420 }}
                  mx="auto"
                  variant="filled"
                  classNames={classes}
                  className={classes.root}
                >
                  <Accordion.Item value="manually">
                    <Accordion.Control>Pick Manually</Accordion.Control>
                    <Accordion.Panel>
                      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <Tabs color="indigo" variant="pills" radius="lg">
                          <Tabs.List position="apart">
                            <Tabs.Tab value="Easy">Easy</Tabs.Tab>
                            <Tabs.Tab value="Medium">Medium</Tabs.Tab>
                            <Tabs.Tab value="Hard">Hard</Tabs.Tab>
                          </Tabs.List>

                          <Tabs.Panel value="gallery" pt="xs">
                            Gallery tab content
                          </Tabs.Panel>

                          <Tabs.Panel value="messages" pt="xs">
                            Messages tab content
                          </Tabs.Panel>

                          <Tabs.Panel value="settings" pt="xs">
                            Settings tab content
                          </Tabs.Panel>
                        </Tabs>
                      </div>
                      <div>
                        <Paper>
                          hello
                        </Paper>
                      </div>
                      <div style={{ marginTop: '3%' }}>
                        <Button
                          sx={(theme) => ({
                            backgroundColor: theme.colors.dark[theme.colorScheme === 'dark' ? 9 : 6],
                            color: '#fff',
                            '&:hover': {
                              backgroundColor: theme.colors.dark[theme.colorScheme === 'dark' ? 9 : 6],
                            },
                          })}
                        >
                          Submit

                        </Button>
                      </div>
                    </Accordion.Panel>
                  </Accordion.Item>
                </Accordion>
              </div>
              <div style={{ width: '30%' }}>
                <Accordion
                  sx={{ maxWidth: 420 }}
                  mx="auto"
                  variant="filled"
                  classNames={classes}
                  className={classes.root}
                >
                  <Accordion.Item value="Randomly">
                    <Accordion.Control>Pick Randomly</Accordion.Control>
                    <Accordion.Panel>
                      <div style={{ width: '100%' }}>
                        <div>
                          <TextInput
                            style={{ width: '100%' }}
                            required
                            type="number"
                            placeholder="Please Enter Marks"
                            label="Total Marks"
                          />
                        </div>
                        <div style={{ marginTop: '3%' }}>
                          <Button
                          // leftIcon={<GithubIcon size={16} />}
                            sx={(theme) => ({
                              backgroundColor: theme.colors.dark[theme.colorScheme === 'dark' ? 9 : 6],
                              color: '#fff',
                              '&:hover': {
                                backgroundColor: theme.colors.dark[theme.colorScheme === 'dark' ? 9 : 6],
                              },
                            })}
                          >
                            Pick Randomly

                          </Button>
                        </div>
                      </div>
                    </Accordion.Panel>
                  </Accordion.Item>
                </Accordion>
              </div>
            </div>
          </Paper>
        </div>
      </Paper>
      <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '2%', width: '100%' }}>
        <TextInput
          style={{ width: '20%' }}
          required
          label="Email"
          placeholder="Please Enter Applicant Email"
          value={data.values.email}
          onChange={(event) => data.setFieldValue('email', event.currentTarget.value)}
          error={data.errors.email && 'Invalid email'}
        />
        <TextInput
          style={{ width: '20%' }}
          required
          label="Pass Threshold"
          type="number"
          placeholder="out of"
          value={data.values.passthreshold}
          onChange={(event) => data.setFieldValue('passthreshold', event.currentTarget.value)}
          error={data.errors.passthreshold && 'Invalid value'}
        />
        <TextInput
          style={{ width: '25%' }}
          required
          type="number"
          placeholder="Please Enter Duration "
          label="Duration"
          rightSection={select}
          rightSectionWidth={83}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5%' }}>
        <Button
          style={{ display: 'flex', width: '40%', justifyContent: 'center' }}
          fullWidth
          className={classes.button}
          onClick={() => (loaded ? setLoaded(false) : !interval.active && interval.start())}
          color={loaded ? 'teal' : theme.primaryColor}
        >
          <div className={classes.label}>
            {progress !== 0 ? 'Submiting' : loaded ? 'Submited' : 'Submit'}
          </div>
          {progress !== 0 && (
          <Progress
            value={progress}
            className={classes.progress}
            color={theme.fn.rgba(theme.colors[theme.primaryColor][2], 0.35)}
            radius="sm"
          />
          )}
        </Button>
      </div>
    </Paper>
  );
}
export default Demo;
