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
      {image && (
      <Box mr={10}>
        <img src={image} width="20" alt={label} />
      </Box>
      )}
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
      {image && <img src={image} width="20" alt={label} />}
      <div>{label}</div>
    </Box>
  </div>
));

export default function AddInterview(props) {
  const { opened, setOpened } = props;
  const [selectedTechGroup, setSelectedTechGroup] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectOption, setSelectOption] = useState({ questionType: questionTypes[0] });
  const [questionSelection, setQuesionSelection] = useState({});
  const [invalidRandomCount, setInvalidRandomCount] = useState({});
  const [interviewParams, setInterviewParams] = useState({ durationInMins: 60 });
  const [emailError, setEmailError] = useState(false);

  const { questionType, techType } = selectOption;

  // console.log({
  //   selectOption, questionSelection,
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
          questionType,
        },
      });
      const { data: quiz } = responseData;
      setQuestions(quiz);
    } catch (err) {
      console.log(`error while fetching data - ${err}`);
    }
  };

  const onChange = (ids) => {
    const validTechTypes = ids.length < selectedTechGroup.length
      ? selectedTechGroup.filter(({ id }) => ids.includes(id))
      : [...selectedTechGroup, techTypes.find(({ id }) => id === ids.at(-1))];

    if (selectOption.techType) {
      if (!ids.includes(selectOption.techType)) {
        const currentIdx = selectedTechGroup.findIndex((obj) => obj.id === selectOption.techType);
        const validNewIdx = currentIdx - 1 >= 0 ? currentIdx - 1 : currentIdx;
        setSelectOption({ ...selectOption, techType: validTechTypes[validNewIdx]?.id });
      }
    } else {
      setSelectOption({ ...selectOption, techType: validTechTypes[0]?.id });
    }

    setSelectedTechGroup(validTechTypes);

    Object.keys(questionSelection).forEach((k) => !ids.includes(k) && delete questionSelection[k]);
    setQuesionSelection(questionSelection);

    if (!validTechTypes.length) {
      setQuestions([]);
      setQuesionSelection({});
    }
  };

  const setSingleValue = (key, value) => {
    if (selectOption[key] === value) return;
    setSelectOption({ ...selectOption, [key]: value });
  };

  const onCloseModal = () => {
    setOpened(false);
    setSelectOption({ questionType: questionTypes[0] });
    setSelectedTechGroup([]);
    setQuestions([]);
    setInvalidRandomCount({});
    setInvalidRandomCount({});
  };

  const handleQuestionState = (e) => () => {
    if (!questionSelection[selectOption.techType]) {
      questionSelection[selectOption.techType] = {};
    }
    if (!questionSelection[selectOption.techType][selectOption.questionType]) {
      questionSelection[selectOption.techType][selectOption.questionType] = [];
    }

    if (!questionSelection[selectOption.techType][selectOption.questionType].includes(e)) {
      questionSelection[selectOption.techType][selectOption.questionType].push(e);
    } else if (questionSelection[selectOption.techType][selectOption.questionType].length === 1) {
      delete questionSelection[selectOption.techType][selectOption.questionType];
      if (isEmpty(questionSelection[selectOption.techType])) {
        delete questionSelection[selectOption.techType];
      }
    } else {
      questionSelection[selectOption.techType][selectOption.questionType] = questionSelection[selectOption.techType][selectOption.questionType]
        .filter((id) => id !== e);
    }
    setQuesionSelection({ ...questionSelection });
  };

  const handleRandomization = (e) => {
    if (!questionSelection[selectOption.techType]) {
      questionSelection[selectOption.techType] = {};
    }
    if (!e.target.value) {
      questionSelection[selectOption.techType][selectOption.questionType] = [];
    } else {
      questionSelection[selectOption.techType][selectOption.questionType] = Number(e.target.value);
    }
    if (questions.length < Number(e.target.value)) {
      setInvalidRandomCount({ ...invalidRandomCount, [techType]: questionType });
    } else {
      delete invalidRandomCount[techType];
      setInvalidRandomCount({ ...invalidRandomCount });
    }
  };

  const doSubmit = async () => {
    baseApi.post('/interviewSession', {
      questionSelection,
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

  const handleSubmit = () => {
    doSubmit();
  };

  if (isLoading) {
    return <LoadingOverlay visible overlayBlur={2} loaderProps={{ color: 'violet', size: 'xl', variant: 'dots' }} />;
  }

  if (isError) {
    return <Title>Error occurred</Title>;
  }

  const checkEmail = (e) => {
    const { value } = e.target;
    const splitEmail = value.split(',');
    splitEmail.forEach((i) => {
      const email = i.trim();
      // eslint-disable-next-line no-useless-escape
      const regEx = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
      setEmailError(!regEx.test(email));
    });
    setInterviewParams((prev) => ({ ...prev, emailId: value }));
  };

  return (
    <Modal
      title="Schedule Assessment"
      opened={opened}
      size="80%"
      // fullScreen
      onClose={() => onCloseModal()}
    >
      <Grid className="schedule-assessment-model-content">
        <Grid.Col
          mt={10}
        >
          <MultiSelect
            data={techTypes}
            limit={20}
            valueComponent={option}
            itemComponent={Item}
            searchable
            transition="pop"
            transitionDuration={350}
            size="md"
            onChange={(e) => onChange(e)}
            placeholder="Select Tech Type"
          />

        </Grid.Col>
        {!!selectedTechGroup.length && (
          <Grid.Col
            mt={10}
            className="card"
          >
            <Group spacing="lg">
              {selectedTechGroup.map(({ label, id }) => (
                <Button
                  key={id}
                  className="option-btn"
                  style={{ backgroundColor: techType === id ? '#6f6af8' : '#ffffff', color: '#eee' }}
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
                style={{ backgroundColor: questionType === type ? '#6f6af8' : '#ffffff', color: '#343a40' }}
                onClick={() => setSingleValue('questionType', type)}
              >
                {type}
              </Button>
            ))}
          </Group>
        </Grid.Col>
        {!!questions.length && (
          <>
            <Input
              value={questionSelection[selectOption.techType]?.[selectOption.questionType]}
              type="number"
              placeholder="Choose random count"
              radius="md"
              onChange={handleRandomization}
              rightSection={
                <p>{questions.length}</p>
              }
              disabled={(questionSelection[selectOption.techType]?.[selectOption.questionType] || []).length}
            />
            {invalidRandomCount[techType] === questionType && 'invalid marks value'}
            <Grid.Col
              className="question"
              mt={10}
            >
              {questions.map((q) => (
                <Card
                  shadow="sm"
                  mb={10}
                  p={20}
                  key={q.id}
                  onClick={handleQuestionState(q.id)}
                  style={
                    (typeof questionSelection[selectOption.techType]?.[selectOption.questionType] === 'number')
                      ? { pointerEvents: 'none' }
                      : {}
                  }
                >
                  <Grid>
                    <Grid.Col
                      span={11}
                    >
                      <Checkbox
                        checked={
                      Array.isArray(questionSelection[selectOption.techType]?.[selectOption.questionType])
                      && questionSelection[selectOption.techType][selectOption.questionType].includes(q.id)
                  }
                        readOnly
                        label={(
                          <Text weight={500} size="md">
                            <pre>
                              {q.question}
                            </pre>
                          </Text>
                   )}
                      />
                    </Grid.Col>
                    <Grid.Col
                      span={1}
                    >
                      {q.marks}
                    </Grid.Col>
                  </Grid>
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
                value={interviewParams.emailId}
                onChange={(e) => checkEmail(e)}
                invalid={emailError}
              />
            </Grid.Col>
            <Grid.Col
              mt={10}
              span={4}
            >
              <NumberInput
                placeholder="Enter the Allowed Duration"
                radius="md"
                value={interviewParams.durationInMins}
                hideControls
                onChange={(e) => setInterviewParams((prev) => ({ ...prev, durationInMins: e }))}
              />
            </Grid.Col>
            <Grid.Col
              mt={10}
              className="button-save"
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
