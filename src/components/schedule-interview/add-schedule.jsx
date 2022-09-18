import React, { forwardRef, useState } from 'react';
import {
  Title, Grid, Modal, MultiSelect, LoadingOverlay, Box,
  CloseButton, Group, Button, Card, Text, Checkbox, Input, NumberInput,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { IconAt } from '@tabler/icons';
import { showNotification } from '@mantine/notifications';

import { queryConstants, questionTypes } from '../../shared/constant-values';
import baseApi from '../../shared/api';
import './index.scss';

const option = ({
  label,
  image,
  onRemove,
  classNames,
  ...others
}) => (
  <div {...others}>
    <Box
      sx={(theme) => ({
        display: 'flex',
        cursor: 'default',
        alignItems: 'center',
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[4]}`,
        paddingLeft: 10,
        borderRadius: 4,
      })}
    >
      <Box mr={10}>
        <img src={image} width="20" alt={label} />
      </Box>
      <Box sx={{ lineHeight: 1, fontSize: 12 }}>{label}</Box>
      <CloseButton
        onMouseDown={onRemove}
        variant="transparent"
        size={22}
        iconSize={14}
        tabIndex={-1}
      />
    </Box>
  </div>
);

const Item = forwardRef(({
  label, image, ...others
}, ref) => (
  <div ref={ref} {...others}>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box mr={10} />
      <img src={image} width="20" alt={label} />
      <div>{label}</div>
    </Box>
  </div>
));

function AddInterview(props) {
  const { opened, setOpened } = props;
  const [techGroup, setTechGroup] = useState([]);
  const [question, setQuestion] = useState([]);
  const [selectOption, setSelectOption] = useState({ mode: questionTypes[0] });
  const [quizParams, setQuizParams] = useState({ quizId: [] });

  const { data, isLoading, isError } = useQuery(
    [queryConstants.techTypes],
    () => baseApi.get('/techTypes'),
  );

  if (isLoading) {
    return <LoadingOverlay visible overlayBlur={2} />;
  }

  if (isError) {
    return <Title>Error occurred</Title>;
  }

  const getTechTypes = () => {
    const { data: techData } = data;
    if (techData) {
      const types = techData.map(({ id, imgUrl, name }) => ({
        id,
        value: id,
        label: name,
        image: imgUrl,
      }));
      return types;
    }
    return [];
  };

  const techTypes = getTechTypes();

  const fetchData = async (payload) => {
    const { mode, techType } = payload;
    const responseData = await baseApi.get('/questions', {
      params: {
        techTypeId: techType,
        questionType: mode,
      },
    });
    const { data: quiz } = responseData;
    setQuestion(quiz);
  };

  const onChange = (ids) => {
    const selectedTechType = techTypes.filter(({ id }) => ids.includes(id));
    setTechGroup(selectedTechType);
    setSelectOption({ ...selectOption, techType: selectedTechType[0].id });
    fetchData({ ...selectOption, techType: selectedTechType[0].id });
  };

  const setSingleValue = (key, value) => {
    setSelectOption({ ...selectOption, [key]: value });
    if (techGroup.length) fetchData({ ...selectOption, [key]: value });
  };

  const onCloseModal = () => {
    setOpened(false);
    setSelectOption({ mode: questionTypes[0] });
    setTechGroup([]);
    setQuestion([]);
  };

  const handleQuizParams = (key, value) => {
    setQuizParams({ ...quizParams, [key]: value });
  };

  const handleSubmit = () => {
    const {
      quizId, emailId, passThreshold, examDuration,
    } = quizParams;
    baseApi.post('/interviewSession', {
      passThreshold,
      candidateEmail: emailId,
      timeAllowedInMins: examDuration,
      questionIds: JSON.stringify(quizId),
    }).then(() => {
      setOpened(false);
      showNotification({
        title: '',
        message: 'Added Successfully',
      });
    }).catch(() => {
      showNotification({
        title: '',
        message: 'Something went to wrong',
      });
    });
  };

  const { mode, techType } = selectOption;
  const { quizId } = quizParams;

  return (
    <Modal
      title="Add Schedule"
      opened={opened}
      size="60%"
      onClose={() => onCloseModal()}
    >
      <Grid className="schedule-interview-model-content">
        <Grid.Col
          mt={10}
        >
          <MultiSelect
            data={techTypes}
            limit={20}
            valueComponent={option}
            itemComponent={Item}
            searchable
            size="md"
            onChange={(e) => onChange(e)}
            placeholder="Select Tech Type"
          />

        </Grid.Col>
        {techGroup.length ? (
          <Grid.Col
            mt={10}
            className="card"
          >
            <Group spacing="lg">
              {techGroup.map(({ label, id }) => (
                <Button
                  key={id}
                  className="option-btn"
                  style={{ backgroundColor: techType === id ? '#6f6af8' : '#ffffff', color: '#343a40' }}
                  onClick={() => setSingleValue('techType', id)}
                >
                  {label}
                </Button>
              ))}
            </Group>
          </Grid.Col>
        ) : ''}

        <Grid.Col
          className="card"
          mt={10}
        >
          <Group grow>
            {questionTypes.map((type) => (
              <Button
                key={type}
                className="option-btn"
                style={{ backgroundColor: mode === type ? '#6f6af8' : '#ffffff', color: '#343a40' }}
                onClick={() => setSingleValue('mode', type)}
              >
                {type}
              </Button>
            ))}
          </Group>
        </Grid.Col>
        {question.length ? (
          <>
            <Grid.Col
              className="question"
              mt={10}
            >
              <Checkbox.Group
                defaultValue={[...quizId]}
                orientation="vertical"
                spacing="xs"
                onChange={(e) => handleQuizParams('quizId', e)}
              >
                {question.map((quiz) => (
                  <Card
                    shadow="sm"
                    mb={10}
                    p={8}
                  >
                    <Checkbox
                      value={quiz.id}
                      label={(
                        <Text weight={500} size="md">
                          {quiz.question}
                        </Text>
                   )}
                    />
                    <Group>
                      <Text mt="xs" color="dimmed" size="sm">
                        {quiz.option1}
                      </Text>
                      <Text mt="xs" color="dimmed" size="sm">
                        {quiz.option2}
                      </Text>
                      <Text mt="xs" color="dimmed" size="sm">
                        {quiz.option3}
                      </Text>
                      <Text mt="xs" color="dimmed" size="sm">
                        {quiz.option4}
                      </Text>
                    </Group>
                    <Text weight={500}>
                      Ans:&nbsp;
                      {quiz.correctOption}
                    </Text>
                  </Card>
                ))}
              </Checkbox.Group>
            </Grid.Col>
            <Grid.Col
              mt={10}
              span={4}
            >
              <Input
                icon={<IconAt />}
                placeholder="Enter the email id"
                radius="md"
                onChange={(e) => handleQuizParams('emailId', e.target.value)}
              />
            </Grid.Col>
            <Grid.Col
              mt={10}
              span={4}
            >
              <NumberInput
                placeholder="Enter the pass threshold"
                radius="md"
                hideControls
                onChange={(e) => handleQuizParams('passThreshold', e)}
              />
            </Grid.Col>
            <Grid.Col
              mt={10}
              span={4}
            >
              <NumberInput
                placeholder="Enter the Allowed Duration(ms)"
                radius="md"
                hideControls
                onChange={(e) => handleQuizParams('examDuration', e)}
              />
            </Grid.Col>
            <Grid.Col
              mt={10}
              style={{ float: 'right' }}
            >
              <Button onClick={() => handleSubmit()}>
                Save

              </Button>
            </Grid.Col>
          </>
        ) : ''}
      </Grid>
    </Modal>
  );
}

export default AddInterview;
