/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
import React, { forwardRef, useState, useEffect } from 'react';
import {
  Title, Grid, Modal, MultiSelect, LoadingOverlay, Box,
  CloseButton, Group, Button, Card, Text, Checkbox, Input, NumberInput,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { IconAt } from '@tabler/icons';
import { showNotification } from '@mantine/notifications';

import { queryConstants, questionTypes } from '../../../shared/constant-values';
import baseApi from '../../../shared/api';
import './upsert.scss';
import { isEmpty } from '../../../shared/utils';

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

export default function AddInterview(props) {
  const { opened, setOpened } = props;
  const [techGroup, setTechGroup] = useState([]);
  const [question, setQuestion] = useState([]);
  const [selectOption, setSelectOption] = useState({ mode: questionTypes[0] });
  const [quizParams, setQuizParams] = useState({});
  const [isInvalidRandomCount, setIsInvalidRandomCount] = useState({});

  const { mode, techType } = selectOption;

  // console.log({
  //   selectOption, quizParams,
  // });

  const { data: techTypesQuery, isLoading, isError } = useQuery(
    [queryConstants.techTypes],
    () => baseApi.get('/techTypes'),
  );

  useEffect(() => {
    if (selectOption.techType) {
      fetchData();
    }
  }, [selectOption]);

  const techTypes = techTypesQuery?.data.map(({ id, imgUrl, name }) => ({
    id,
    value: id,
    label: name,
    image: imgUrl,
  })) || [];

  const fetchData = async () => {
    try {
      const responseData = await baseApi.get('/questions', {
        params: {
          techTypeId: techType,
          questionType: mode,
        },
      });
      const { data: quiz } = responseData;
      setQuestion(quiz);
    } catch (err) {
      console.log(`error while fetching data - ${err}`);
    }
  };

  const onChange = (ids) => {
    const validTechTypes = ids.length < techGroup.length
      ? techGroup.filter(({ id }) => ids.includes(id))
      : [...techGroup, techTypes.find(({ id }) => id === ids.at(-1))];

    if (selectOption.techType) {
      if (!ids.includes(selectOption.techType)) {
        const currentIdx = techGroup.findIndex((obj) => obj.id === selectOption.techType);
        const validNewIdx = currentIdx - 1 >= 0 ? currentIdx - 1 : currentIdx;
        setSelectOption({ ...selectOption, techType: validTechTypes[validNewIdx]?.id });
      }
    } else {
      setSelectOption({ ...selectOption, techType: validTechTypes[0]?.id });
    }

    setTechGroup(validTechTypes);

    Object.keys(quizParams).forEach((k) => !ids.includes(k) && delete quizParams[k]);
    setQuizParams(quizParams);

    if (!validTechTypes.length) {
      setQuestion([]);
      setQuizParams({});
    }
  };

  const setSingleValue = (key, value) => {
    if (selectOption[key] === value) return;
    setSelectOption({ ...selectOption, [key]: value });
  };

  const onCloseModal = () => {
    setOpened(false);
    setSelectOption({ mode: questionTypes[0] });
    setTechGroup([]);
    setQuestion([]);
  };

  const handleQuestionState = (e) => () => {
    if (!quizParams[selectOption.techType]) {
      quizParams[selectOption.techType] = {};
    }
    if (!quizParams[selectOption.techType][selectOption.mode]) {
      quizParams[selectOption.techType][selectOption.mode] = [];
    }

    if (!quizParams[selectOption.techType][selectOption.mode].includes(e)) {
      quizParams[selectOption.techType][selectOption.mode].push(e);
    } else if (quizParams[selectOption.techType][selectOption.mode].length === 1) {
      delete quizParams[selectOption.techType][selectOption.mode];
      if (isEmpty(quizParams[selectOption.techType])) {
        delete quizParams[selectOption.techType];
      }
    } else {
      quizParams[selectOption.techType][selectOption.mode] = quizParams[selectOption.techType][selectOption.mode]
        .filter((id) => id !== e);
    }
    setQuizParams({ ...quizParams });
  };

  const handleRandomization = (e) => {
    if (!quizParams[selectOption.techType]) {
      quizParams[selectOption.techType] = {};
    }
    if (!e.target.value) {
      quizParams[selectOption.techType][selectOption.mode] = [];
    } else {
      quizParams[selectOption.techType][selectOption.mode] = Number(e.target.value);
    }
    if (question.length < Number(e.target.value)) {
      setIsInvalidRandomCount({ ...isInvalidRandomCount, [techType]: mode });
    } else {
      delete isInvalidRandomCount[techType];
      setIsInvalidRandomCount({ ...isInvalidRandomCount });
    }
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

  if (isLoading) {
    return <LoadingOverlay visible overlayBlur={2} />;
  }

  if (isError) {
    return <Title>Error occurred</Title>;
  }

  return (
    <Modal
      title="Schedule Interview"
      opened={opened}
      size="80%"
      // fullScreen
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
        {!!techGroup.length && (
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
        )}
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
        {!!question.length && (
          <>
            <Input
              value={quizParams[selectOption.techType]?.[selectOption.mode]}
              type="number"
              placeholder="Choose random count"
              radius="md"
              onChange={handleRandomization}
              rightSection={
                <p>{question.length}</p>
              }
              disabled={(quizParams[selectOption.techType]?.[selectOption.mode] || []).length}
            />
            {isInvalidRandomCount[techType] === mode && 'invalid marks value'}
            <Grid.Col
              className="question"
              mt={10}
            >
              {question.map((q) => (
                <Card
                  shadow="sm"
                  mb={10}
                  p={20}
                  key={q.id}
                  onClick={handleQuestionState(q.id)}
                  style={
                    (typeof quizParams[selectOption.techType]?.[selectOption.mode] === 'number')
                      ? { pointerEvents: 'none' }
                      : {}
                  }
                >
                  <Checkbox
                    checked={
                      Array.isArray(quizParams[selectOption.techType]?.[selectOption.mode])
                      && quizParams[selectOption.techType][selectOption.mode].includes(q.id)
                  }
                    readOnly
                    label={(
                      <Text weight={500} size="md">
                        {q.question}
                        {' : '}
                        {q.marks}
                      </Text>
                   )}
                  />
                </Card>
              ))}
            </Grid.Col>
            <Grid.Col
              mt={10}
              span={4}
            >
              <Input
                icon={<IconAt />}
                placeholder="Enter the email id"
                radius="md"
                // onChange={(e) => handleQuizParams('emailId', e.target.value)}
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
                // onChange={(e) => handleQuizParams('passThreshold', e)}
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
                // onChange={(e) => handleQuizParams('examDuration', e)}
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
        )}
      </Grid>
    </Modal>
  );
}
