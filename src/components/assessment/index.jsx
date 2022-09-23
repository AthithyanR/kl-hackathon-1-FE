/* eslint-disable react/no-array-index-key */
/* eslint-disable max-len */
/* eslint-disable prefer-destructuring */
import {
  Avatar, Button, LoadingOverlay, Tabs, Title,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import React, { useState, useMemo, useEffect } from 'react';

import Countdown from 'react-countdown';

import Logo from '../../assets/Online-Assessment-Tool-kaaylabs.svg';
import baseApi from '../../shared/api';
import { queryConstants } from '../../shared/constant-values';
import { generateQS, isEmpty } from '../../shared/utils';

import './client.scss';

function Client() {
  const [endTime, setEndTime] = useState(null);
  const [activeTechTypeTab, setActiveTechTypeTab] = useState(null);
  const [questionTypeTabStatus, setQuestionTypeTabStatus] = useState({});
  const [questionStatus, setQuestionStatus] = useState({});
  const [questionData, setQuestionData] = useState({});

  const {
    data: techTypesQuery,
    isLoading: isLoadingTechTypes,
    isError: isErrorTechTypes,
  } = useQuery([queryConstants.techTypes], () => baseApi.get('/techTypes'));

  const sessionKey = new URLSearchParams(window.location.search).get(
    'sessionKey',
  );

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
  } = useQuery([queryConstants.assessmentSession], fetchAssessmentSessionMeta, {
    onSuccess: handleFetchAssessmentSessionSuccess,
    enabled: !!techTypesQuery,
  });

  const fetchQuestionData = async () => {
    try {
      const queryParams = {
        sessionKey,
        techTypeId: activeTechTypeTab,
        questionType: questionTypeTabStatus[activeTechTypeTab],
        questionNumber:
          questionStatus[activeTechTypeTab][
            questionTypeTabStatus[activeTechTypeTab]
          ],
      };
      const questionResponse = await baseApi.get(
        `/assessmentSession/question${generateQS(queryParams)}`,
      );
      setQuestionData(questionResponse.data || {});
      // console.log(questionResponse, 'questionResponse');
    } catch (err) {
      console.log('error on fetchQuestionData', fetchQuestionData);
    }
  };

  useEffect(() => {
    if (
      activeTechTypeTab
      && !isEmpty(questionTypeTabStatus)
      && !isEmpty(questionStatus)
    ) {
      fetchQuestionData();
    }
  }, [activeTechTypeTab, questionTypeTabStatus, questionStatus]);

  const handleComplete = () => {
    console.log('completed');
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

  const session = assessmentSessionQuery?.data;
  const techTypes = techTypesQuery?.data;

  const techTypeHash = useMemo(
    () => (techTypes || []).reduce((acc, cur) => {
      acc[cur.id] = cur.name;
      return acc;
    }, {}),
    [techTypes],
  );

  // console.log(
  //   isLoading,
  //   isLoadingTechTypes,
  //   !activeTechTypeTab,
  //   isEmpty(questionTypeTabStatus),
  //   isEmpty(questionStatus),
  // );

  console.log(questionData);

  if (
    isLoading
    || isLoadingTechTypes
    || !activeTechTypeTab
    || isEmpty(questionTypeTabStatus)
    || isEmpty(questionStatus)
  ) {
    return <LoadingOverlay visible overlayBlur={2} />;
  }

  if (isErrorTechTypes || !techTypes) {
    return <Title>Error Fetching Data</Title>;
  }

  if (isError || !session) {
    return <Title>Invalid Session</Title>;
  }

  const { questionsMeta } = session;

  // console.log(questionStatus ,);

  return (
    <div className="container">
      <div className="header">
        <div className="logo-container">
          <Avatar radius={10} src={Logo} alt="Kaaylabs-MCQ" className="logo" />
        </div>
        <div className="right-content">
          <div>
            Remaining Time:
            {' '}
            <Countdown
              date={endTime}
              onComplete={handleComplete}
              zeroPadDays={1}
            />
          </div>
        </div>
      </div>
      <div className="body">
        <Tabs value={activeTechTypeTab} onTabChange={handleTechTypeTabChange}>
          <Tabs.List>
            {Object.keys(questionsMeta).map((techTypeId) => (
              <Tabs.Tab key={techTypeId} value={techTypeId}>
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
                  {Object.keys(questionsMeta[techTypeId]).map(
                    (questionType) => (
                      <Tabs.Tab key={questionType} value={questionType}>
                        {questionType}
                      </Tabs.Tab>
                    ),
                  )}
                </Tabs.List>

                {Object.keys(questionsMeta[techTypeId]).map((questionType) => (
                  <Tabs.Panel key={questionType} value={questionType}>
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
