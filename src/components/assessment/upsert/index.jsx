/* eslint-disable no-nested-ternary */
/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import {
  Title, Grid, Modal, LoadingOverlay, Group, Button, Card, Text, Checkbox, Input, NumberInput,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { IconAt } from '@tabler/icons';
import { showNotification } from '@mantine/notifications';

import { queryConstants, questionTypes } from '../../../shared/constant-values';
import baseApi from '../../../shared/api';
import './upsert.scss';
import { isEmpty } from '../../../shared/utils';
import SelectTechType from './select-tech-type';

const message = {
  candidateEmails: 'Please Enter Valid Email ID',
  randomCount: 'Please Enter Random Count or Select Your Question',
  timeAllowedInMins: 'Please Enter Valid Duration',
};

export default function AddInterview(props) {
  const { opened, setOpened } = props;
  const [selectedTechGroup, setSelectedTechGroup] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectOption, setSelectOption] = useState({ questionType: questionTypes[0] });
  const [questionSelection, setQuesionSelection] = useState({});
  const [interviewParams, setInterviewParams] = useState({ randomCount: null, candidateEmails: [], timeAllowedInMins: 60 });
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
    setInterviewParams({ candidateEmails: [], randomCount: null, timeAllowedInMins: 60 });
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
      randomCount: isEmpty(questionSelection) ? null : questionSelection[selectOption?.techType][selectOption?.questionType],
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
      if ([null, ''].includes(value)) {
        error.push(key);
      } else if (key === 'candidateEmails' && value.length === 0) {
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

  const doSubmit = () => {
    const { candidateEmails, timeAllowedInMins } = interviewParams;
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
    const candidateEmails = [];
    result.forEach((i) => {
      const em = i.trim();
      if (!regEx.test(em) || em.length === 0) {
        setEmailError(true);
      } else {
        candidateEmails.push(i);
        setEmailError(false);
      }
    });
    setInterviewParams((prev) => ({ ...prev, emailId: value, candidateEmails }));
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
        <SelectTechType techTypes={techTypes} onChange={onChange} />
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
            <Grid.Col
              mt={10}
              span={4}
            >
              <NumberInput
                value={questionSelection[selectOption.techType]?.[selectOption.questionType]}
                placeholder="Choose Random Count"
                radius="md"
                onChange={handleRandomization}
                max={questions.length}
                min={1}
                rightSection={
                  <Text>{questions.length}</Text>
              }
                disabled={(questionSelection[selectOption.techType]?.[selectOption.questionType] || []).length}
              />
            </Grid.Col>
            <Grid.Col
              mt={10}
              span={4}
            >
              <Input
                icon={<IconAt />}
                placeholder="Enter The Email Id"
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
                value={interviewParams.timeAllowedInMins}
                hideControls
                onChange={(e) => setInterviewParams((prev) => ({ ...prev, timeAllowedInMins: e }))}
              />
            </Grid.Col>
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
              span={11}
            >
              <Text size="md" style={{ float: 'right' }} mt={10} color="red">{isErrorMessage ? errorMessage : emailError ? message.candidateEmails : ''}</Text>
            </Grid.Col>
            <Grid.Col
              mt={10}
              span={1}
              style={{ float: 'right' }}
            >
              <Button size="md" onClick={() => handleSubmit()}>
                Save
              </Button>
            </Grid.Col>
          </>
        )}
      </Grid>
    </Modal>
  );
}
