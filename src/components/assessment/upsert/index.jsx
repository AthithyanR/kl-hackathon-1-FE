/* eslint-disable no-nested-ternary */
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

const message = {
  emails: 'Please enter valid email id',
  randomCount: 'Please enter random count or select your question',
  durationInMins: 'Please Enter valid duration',
};

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
  const [selectedTechGroup, setSelectedTechGroup] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectOption, setSelectOption] = useState({ questionType: questionTypes[0] });
  const [questionSelection, setQuesionSelection] = useState({});
  const [interviewParams, setInterviewParams] = useState({ emails: [], randomCount: undefined, durationInMins: 60 });
  const [emailError, setEmailError] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

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
    setInterviewParams({ emails: [], randomCount: undefined, durationInMins: 60 });
    setQuesionSelection({});
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
    setInterviewParams((prev) => ({
      ...prev,
      randomCount: isEmpty(questionSelection) ? undefined : questionSelection[selectOption?.techType][selectOption?.questionType],
    }));
  };

  useEffect(() => {
    if (isErrorMessage) {
      const { isErrorMesg, currentErrorMessage } = checkError(interviewParams);
      setIsErrorMessage(isErrorMesg);
      setErrorMessage(currentErrorMessage);
    }
  }, [interviewParams]);

  const checkError = (params) => {
    const error = [];
    Object.entries(params).forEach(([key, value]) => {
      if ([undefined, null, ''].includes(value)) {
        error.push(key);
      } else if (key === 'emails' && value.length === 0) {
        error.push(key);
      }
    });
    const currentError = error[0];
    const isErrorMesg = error.length >= 1;
    const currentErrorMessage = message[currentError];
    return { isErrorMesg, currentErrorMessage };
  };

  const handleRandomization = (e) => {
    if (!questionSelection[selectOption.techType]) {
      questionSelection[selectOption.techType] = {};
    }
    if (!e) {
      questionSelection[selectOption.techType][selectOption.questionType] = [];
    } else {
      questionSelection[selectOption.techType][selectOption.questionType] = Number(e);
    }
    setInterviewParams((prev) => ({ ...prev, randomCount: e }));
  };

  const doSubmit = async () => {
    const { emails: candidateEmails, durationInMins: timeAllowedInMins } = interviewParams;
    const quizData = {};
    if (!isEmpty(questionSelection)) {
      Object.entries(questionSelection).forEach(([techTypeKey, techTypeValue]) => {
        if (!quizData[techTypeKey]) {
          quizData[techTypeKey] = {};
          Object.entries(techTypeValue).forEach(([quizTypeKey, quizTypeValue]) => {
            if (!quizData[techTypeKey][quizTypeKey]) {
              quizData[techTypeKey][quizTypeKey] = {};
              quizData[techTypeKey][quizTypeKey] = Array.isArray(quizTypeValue) ? quizTypeValue.reduce((a, id) => ({ ...a, [id]: false }), {}) : quizTypeValue;
            }
          });
        }
      });
    }
    baseApi.post('/assessmentSession', {
      candidateEmails,
      timeAllowedInMins,
      questionData: JSON.stringify(quizData),
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
    const { isErrorMesg, currentErrorMessage } = checkError(interviewParams);
    if (!isErrorMesg) {
      if (!emailError) {
        doSubmit();
      }
    } else {
      setIsErrorMessage(isErrorMesg);
      setErrorMessage(currentErrorMessage);
    }
  };

  if (isLoading) {
    return <LoadingOverlay visible overlayBlur={2} />;
  }

  if (isError) {
    return <Title>Error occurred</Title>;
  }

  const checkEmail = (e) => {
    const { value } = e.target;
    // eslint-disable-next-line no-useless-escape
    const regEx = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    const result = value.replace(/\s/g, '').split(/,|;/);
    const emails = [];
    result.forEach((i) => {
      const em = i.trim();
      if (!regEx.test(em) || em.length === 0) {
        setEmailError(true);
      } else {
        emails.push(i);
        setEmailError(false);
      }
    });
    setInterviewParams((prev) => ({ ...prev, emailId: value, emails }));
  };

  return (
    <Modal
      title="Schedule Assessment"
      opened={opened}
      size="80%"
      // fullScreen
      closeOnClickOutside={false}
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
            <NumberInput
              value={questionSelection[selectOption.techType]?.[selectOption.questionType]}
              placeholder="Choose random count"
              radius="md"
              onChange={handleRandomization}
              max={questions.length}
              min={1}
              rightSection={
                <Text>{questions.length}</Text>
              }
              disabled={(questionSelection[selectOption.techType]?.[selectOption.questionType] || []).length}
            />
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
                          <Text weight={500} onClick={handleQuestionState(q.id)} size="md">
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
                onChange={(e) => setInterviewParams((prev) => ({ ...prev, emailId: e.target.value }))}
                onBlur={(e) => checkEmail(e)}
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
              span={4}
            />
            <Grid.Col
              mt={10}
              span={1}
              style={{ float: 'right' }}
            >
              <Button onClick={() => handleSubmit()}>
                Save
              </Button>
            </Grid.Col>
            <Grid.Col
              mt={10}
              span={11}
              style={{ float: 'right' }}
            >
              <Text size="md" mt={5} color="red">{isErrorMessage ? errorMessage : emailError ? message.emails : ''}</Text>
            </Grid.Col>
          </>
        )}
      </Grid>
    </Modal>
  );
}
