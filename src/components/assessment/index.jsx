/* eslint-disable react/no-array-index-key */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable prefer-destructuring */
import {
  Avatar, Button, Card, Checkbox, Tabs, Text, Title, Grid,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import React, { useState, useMemo, useEffect } from 'react';

import Countdown from 'react-countdown';
import { useNavigate } from 'react-router-dom';

import Logo from '../../assets/Online-Assessment-Tool-kaaylabs.svg';
import baseApi from '../../shared/api';
import CustomLoadingOverlay from '../../shared/components/CustomLoadingOverlay';
import { queryConstants, QUESTIONS_CACHE, questionTypes } from '../../shared/constant-values';
import {
  customLog,
  generateQS, getFromLs, isEmpty, orderArrayBySample, setToLs,
} from '../../shared/utils';

import './client.scss';

function Client() {
  const navigate = useNavigate();

  const [endTime, setEndTime] = useState(null);
  const [activeTechTypeTab, setActiveTechTypeTab] = useState(null);
  const [questionTypeTabStatus, setQuestionTypeTabStatus] = useState({});
  const [questionStatus, setQuestionStatus] = useState({});
  const [questionData, setQuestionData] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);

  const {
    data: techTypesQuery,
    isLoading: isLoadingTechTypes,
    isError: isErrorTechTypes,
  } = useQuery([queryConstants.techTypes], () => baseApi.get('/techTypes'));

  const {
    id: questionId, question, option1, option2, option3, option4,
  } = questionData;

  const searchParams = new URLSearchParams(window.location.search);
  const sessionKey = searchParams.get('sessionKey');
  const isCompleted = searchParams.get('isCompleted');

  const fetchAssessmentSessionMeta = () => baseApi.get(`/assessmentSession/meta?sessionKey=${encodeURI(sessionKey)}`);

  const handleFetchAssessmentSessionSuccess = ({ data }) => {
    if (!data) return;
    const { startTime, questionsMeta, timeAllowedInMins } = data;
    const assumedStartTime = startTime ? new Date(startTime) : new Date();
    setEndTime(assumedStartTime.getTime() + timeAllowedInMins * 60 * 1000);
    const allTechType = Object.keys(questionsMeta);
    const initialActiveTechType = allTechType[0];
    const initialQuestionTypeTabStatus = {};
    const initialQuestionStatus = {};

    allTechType.forEach((techTypeId) => {
      const questionTypeKeys = Object.keys(questionsMeta[techTypeId]);
      initialQuestionTypeTabStatus[techTypeId] = questionTypeKeys[0];
      initialQuestionStatus[techTypeId] = {};
      questionTypeKeys.forEach((questionType) => {
        initialQuestionStatus[techTypeId][questionType] = 1;
      });
    });

    setActiveTechTypeTab(initialActiveTechType);
    setQuestionTypeTabStatus(initialQuestionTypeTabStatus);
    setQuestionStatus(initialQuestionStatus);
  };

  const {
    data: assessmentSessionQuery,
    isLoading,
    isError,
    isFetched,
  } = useQuery([queryConstants.assessmentSession], fetchAssessmentSessionMeta, {
    onSuccess: handleFetchAssessmentSessionSuccess,
    enabled: !!techTypesQuery,
  });

  const getSessionBasedParams = () => ({
    sessionKey,
    techTypeId: activeTechTypeTab,
    questionType: questionTypeTabStatus[activeTechTypeTab],
    questionNumber:
      questionStatus[activeTechTypeTab][
        questionTypeTabStatus[activeTechTypeTab]
      ],
  });

  const fetchQuestionData = async () => {
    try {
      const queryParams = getSessionBasedParams();
      const questionResponse = await baseApi.get(
        `/assessmentSession/question${generateQS(queryParams)}`,
      );
      const questionsCache = getFromLs(QUESTIONS_CACHE) || {};
      setQuestionData(questionResponse.data || {});
      setSelectedOption(questionsCache[`${activeTechTypeTab}//${questionResponse.data.id}`] || null);
    } catch (err) {
      customLog('error on fetchQuestionData', err);
    }
  };

  useEffect(() => {
    if (
      activeTechTypeTab
      && !isEmpty(questionTypeTabStatus)
      && !isEmpty(questionStatus)
    ) {
      setQuestionData({});
      setSelectedOption(null);
      fetchQuestionData();
    }
  }, [activeTechTypeTab, questionTypeTabStatus, questionStatus]);

  const handleComplete = async () => {
    try {
      await baseApi.put(`/assessmentSession/complete${generateQS({ sessionKey })}`);
      const { pathname } = window.location;
      navigate(`${pathname}${generateQS({ sessionKey, isCompleted: 'true' })}`);
      navigate(0);
    } catch (err) {
      customLog('error on handleOptionSelect', err);
    }
  };

  const handleTechTypeTabChange = (newActiveTab) => {
    setActiveTechTypeTab(newActiveTab);
  };

  const handleQuestionTypeTabChange = (newActiveTab) => {
    questionTypeTabStatus[activeTechTypeTab] = newActiveTab;
    setQuestionTypeTabStatus({ ...questionTypeTabStatus });
  };

  const handleActiveQuestionChange = (newActiveQuestion) => {
    questionStatus[activeTechTypeTab][
      questionTypeTabStatus[activeTechTypeTab]
    ] = newActiveQuestion;
    setQuestionStatus({ ...questionStatus });
  };

  const handleOptionSelect = async (option) => {
    if (option === selectedOption) return;
    const questionsCache = getFromLs(QUESTIONS_CACHE) || {};
    questionsCache[`${activeTechTypeTab}//${questionId}`] = option;
    setToLs(QUESTIONS_CACHE, questionsCache);
    setSelectedOption(option);

    try {
      const payload = {
        ...getSessionBasedParams(),
        chosenOption: option,
      };
      await baseApi.post('/assessmentSession/evaluateAnswer', payload);
    } catch (err) {
      customLog('error on handleOptionSelect', err);
    }
  };

  const session = assessmentSessionQuery?.data;
  const techTypes = techTypesQuery?.data;

  const techTypeHash = useMemo(
    () => (techTypes || []).reduce((acc, cur) => {
      acc[cur.id] = cur.name;
      return acc;
    }, {}),
    [techTypes],
  );

  if (isCompleted) {
    return (
      <div className="error-title-container">
        <Title>Submitted Successfully</Title>
      </div>
    );
  }

  const loadingState = (isLoading
    || isLoadingTechTypes
    || !activeTechTypeTab
    || isEmpty(questionTypeTabStatus)
    || isEmpty(questionStatus)) && !(isFetched && !session);

  if (loadingState) {
    return <CustomLoadingOverlay />;
  }

  if (isErrorTechTypes || !techTypes) {
    return (
      <div className="error-title-container">
        <Title>Error Fetching Data</Title>
      </div>
    );
  }

  if (isError || !session) {
    return (
      <div className="error-title-container">
        <Title>Invalid Session</Title>
      </div>
    );
  }

  const { questionsMeta } = session;

  return (
    <div className="container">
      <div className="header">
        <div className="logo-container">
          <Avatar radius={10} src={Logo} alt="Kaaylabs-MCQ" className="logo" />
        </div>
        <div className="right-content">
          <div className="time-field">
            Time Remaining:
            {' '}
            <Countdown
              date={endTime}
              onComplete={handleComplete}
              zeroPadDays={1}
            />
          </div>
          <Button onClick={handleComplete}>
            Submit
          </Button>
        </div>
      </div>
      <div className="assessment-body">
        <Tabs value={activeTechTypeTab} onTabChange={handleTechTypeTabChange}>
          <Tabs.List>
            {Object.keys(questionsMeta).map((techTypeId) => (
              <Tabs.Tab
                key={techTypeId}
                value={techTypeId}
              >
                {techTypeHash[techTypeId]}
              </Tabs.Tab>
            ))}
          </Tabs.List>

          {Object.keys(questionsMeta).map((techTypeId) => (
            <Tabs.Panel key={techTypeId} value={techTypeId}>
              <Tabs
                value={questionTypeTabStatus[techTypeId]}
                onTabChange={handleQuestionTypeTabChange}
              >
                <Tabs.List>
                  {orderArrayBySample(Object.keys(questionsMeta[techTypeId]), questionTypes).map(
                    (questionType) => (
                      <Tabs.Tab
                        key={questionType}
                        value={questionType}
                        // className={questionsMeta[techTypeId] === questionType && 'active-tab'}
                      >
                        {questionType}
                      </Tabs.Tab>
                    ),
                  )}
                </Tabs.List>

                {Object.keys(questionsMeta[techTypeId]).map((questionType) => (
                  <Tabs.Panel
                    key={questionType}
                    value={questionType}
                    style={{ margin: '1em', alignItems: 'center', textAlign: 'center' }}
                  >
                    {Array(questionsMeta[techTypeId][questionType])
                      .fill()
                      .map((_, idx) => (
                        <Button
                          key={idx}
                          className={
                            questionStatus[techTypeId][questionType] === idx + 1
                              ? 'active-question'
                              : 'inactive-question'
                          }
                          onClick={() => handleActiveQuestionChange(idx + 1)}
                        >
                          {idx + 1}
                        </Button>
                      ))}
                    <Card
                      shadow="md"
                      mb={10}
                      p={20}
                      radius="md"
                      withBorder
                      style={{ margin: '1em' }}
                    >
                      <Text weight={500} size="md" style={{ padding: '1em', marginBottom: '0.5em' }}>
                        {question}
                      </Text>
                      <Grid justify="space-around">
                        <Grid.Col
                          span={5}
                          style={{
                            display: 'inherit', alignItems: 'center', background: '#fff', width: '50%', marginBottom: '0.5em', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 30px 60px -12px, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px',
                          }}
                        >
                          <Checkbox
                            checked={selectedOption === 'option 1'}
                            onChange={() => handleOptionSelect('option 1')}
                            mr={10}
                          />
                          {option1}
                        </Grid.Col>
                        <Grid.Col
                          span={5}
                          style={{
                            display: 'inherit', alignItems: 'center', background: '#fff', width: '50%', marginBottom: '0.5em', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 30px 60px -12px, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px',
                          }}
                        >
                          <Checkbox
                            checked={selectedOption === 'option 2'}
                            onChange={() => handleOptionSelect('option 2')}
                            mr={10}
                          />
                          {option2}
                        </Grid.Col>
                        <Grid.Col
                          span={5}
                          style={{
                            display: 'inherit', alignItems: 'center', background: '#fff', width: '50%', marginBottom: '0.5em', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 30px 60px -12px, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px',
                          }}
                        >
                          <Checkbox
                            checked={selectedOption === 'option 3'}
                            onChange={() => handleOptionSelect('option 3')}
                            mr={10}
                          />
                          {option3}
                        </Grid.Col>
                        <Grid.Col
                          span={5}
                          style={{
                            display: 'inherit', alignItems: 'center', background: '#fff', width: '50%', marginBottom: '0.5em', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 30px 60px -12px, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px',
                          }}
                        >
                          <Checkbox
                            checked={selectedOption === 'option 4'}
                            onChange={() => handleOptionSelect('option 4')}
                            mr={10}
                          />
                          {option4}
                        </Grid.Col>
                      </Grid>
                    </Card>
                  </Tabs.Panel>
                ))}
              </Tabs>
            </Tabs.Panel>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

export default Client;
