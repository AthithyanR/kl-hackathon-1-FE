import { LoadingOverlay, Title } from '@mantine/core';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import baseApi from '../../shared/api';
import { queryConstants, questionTypes } from '../../shared/constant-values';
import { generateQS } from '../../shared/utils';

function Questions() {
  const queryClient = useQueryClient();
  const [techType, setTechType] = useState(null);
  const [questionType, setQuestionType] = useState(questionTypes[0]);

  const {
    data: techTypesResp,
    isLoading: isLoadingTechTypes,
    isError: isErrorTechTypes,
  } = useQuery(
    [queryConstants.techTypes],
    () => baseApi.get('/techTypes'),
    {
      onSuccess: (data) => {
        setTechType(data.data[0]?.name);
      },
    },
  );

  const {
    data: questionsResp,
    isLoading: isLoadingQuestions,
    isError: isErrorQuestions,
  } = useQuery(
    [queryConstants.techTypes],
    () => baseApi.get(`/questions${generateQS({ techType, questionType })}`),
    {
      enabled: !!(techTypesResp?.data && questionType),
    },
  );

  if (isLoadingTechTypes) {
    return <LoadingOverlay visible overlayBlur={2} />;
  }

  if (isErrorTechTypes) {
    return <Title>Error occurred</Title>;
  }

  const techTypes = techTypesResp.data || [];

  return (
    <>{JSON.stringify(techTypes)}</>
  );
}

export default Questions;
