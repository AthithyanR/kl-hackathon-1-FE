/* eslint-disable prefer-destructuring */
import {
  Avatar, Button, LoadingOverlay, Tabs, Title,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import React, { useState, useMemo } from 'react';

import Countdown from 'react-countdown';

import Logo from '../../assets/Online-Assessment-Tool-kaaylabs.svg';
import baseApi from '../../shared/api';
import { queryConstants } from '../../shared/constant-values';

import './client.scss';

function Client() {
  const [endTime, setEndTime] = useState(null);
  const [activeTechTypeTab, setActiveTechTypeTab] = useState(null);
  const [questionTypeTabStatus, setQuestionTypeTabStatus] = useState({});
  const [questionStatus, setQuestionStatus] = useState({});

  // console.log({
  //   activeTechTypeTab,
  //   questionTypeTabStatus,
  //   questionStatus,
  // });

  const {
    data: techTypesQuery,
    isLoading: isLoadingTechTypes,
    isError: isErrorTechTypes,
  } = useQuery([queryConstants.techTypes], () => baseApi.get('/techTypes'));

  const fetchAssessmentSessionMeta = () => {
    const sessionKey = new URLSearchParams(window.location.search).get(
      'sessionKey',
    );
    return baseApi.get(
      `/assessmentSession/meta?sessionKey=${encodeURI(sessionKey)}`,
    );
  };

  const handleFetchAssessmentSessionSuccess = ({ data }) => {
    if (!data) return;
    try {
      const assumedStartTime = data.startTime
        ? new Date(data.startTime)
        : new Date();
      setEndTime(
        assumedStartTime.getTime() + data.timeAllowedInMins * 60 * 1000,
      );
      const allTechType = Object.keys(data.questionsMeta);
      const initialActiveTechType = allTechType[0];
      setActiveTechTypeTab(initialActiveTechType);
      setQuestionTypeTabStatus(
        allTechType.reduce((acc, cur) => {
          acc[cur] = Object.keys(data.questionsMeta[cur])[0];
          return acc;
        }, {}),
      );
      setQuestionStatus(
        allTechType.reduce((acc, cur) => {
          acc[cur] = 0;
          return acc;
        }, {}),
      );
    } catch (e) {
      console.log('error on handleFetchAssessmentSessionSuccess', e);
    }
  };

  const {
    data: assessmentSessionQuery,
    isLoading,
    isError,
  } = useQuery([queryConstants.assessmentSession], fetchAssessmentSessionMeta, {
    onSuccess: handleFetchAssessmentSessionSuccess,
    enabled: !!techTypesQuery,
  });

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

  const session = assessmentSessionQuery?.data;
  const techTypes = techTypesQuery?.data;

  const techTypeHash = useMemo(
    () => (techTypes || []).reduce((acc, cur) => {
      acc[cur.id] = cur.name;
      return acc;
    }, {}),
    [techTypes],
  );

  if (isLoading || isLoadingTechTypes) {
    return <LoadingOverlay visible overlayBlur={2} />;
  }

  if (isErrorTechTypes || !techTypes) {
    return <Title>Error Fetching Data</Title>;
  }

  if (isError || !session) {
    return <Title>Invalid Session</Title>;
  }

  const { questionsMeta } = session;

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
              <Tabs.Tab value={techTypeId}>{techTypeHash[techTypeId]}</Tabs.Tab>
            ))}
          </Tabs.List>

          {Object.keys(questionsMeta).map((techTypeId) => (
            <Tabs.Panel value={techTypeId}>
              <Tabs
                value={questionTypeTabStatus[techTypeId]}
                onTabChange={handleQuestionTypeTabChange}
              >
                <Tabs.List>
                  {Object.keys(questionsMeta[techTypeId]).map(
                    (questionType) => (
                      <Tabs.Tab value={questionType}>{questionType}</Tabs.Tab>
                    ),
                  )}
                </Tabs.List>

                {Object.keys(questionsMeta[techTypeId]).map((questionType) => (
                  <Tabs.Panel value={questionType}>
                    {Array(questionsMeta[techTypeId][questionType])
                      .fill()
                      .map((_, idx) => <Button style={{ backgroundColor: questionStatus[techTypeId] === idx ? 'black' : 'blue' }}>{idx + 1}</Button>)}
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
