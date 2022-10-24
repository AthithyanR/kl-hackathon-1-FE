/* eslint-disable no-restricted-syntax */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
import React, { useState, useEffect, useMemo } from 'react';
import {
  Title, Grid, Modal, Group, Button, Card, Text, Checkbox, Input, NumberInput,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { IconAt } from '@tabler/icons';
import { showNotification } from '@mantine/notifications';

import { queryConstants, questionTypes } from '../../../shared/constant-values';
import baseApi from '../../../shared/api';
import './upsert.scss';
import SelectTechType from './select-tech-type';
import CustomLoadingOverlay from '../../../shared/components/CustomLoadingOverlay';
import { checkEmail } from './helper';

const message = {
  candidateEmails: 'Please Enter Valid Email ID',
  questionState: 'Please Enter Random Count or Select Your Question',
  timeAllowedInMins: 'Please Enter Valid Duration',
};

export default function UpsertAssessment(props) {
  const { editOption, handleClose } = props;
  const [selectedTechIds, setSelectedTechIds] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectOption, setSelectOption] = useState({ questionType: questionTypes[0] });
  const [questionState, setQuestionState] = useState(new Map());
  const [assessmentParams, setAssessmentParams] = useState({
    candidateEmails: '',
    timeAllowedInMins: 60,
  });
  const [errors, setErrors] = useState(new Map());

  const { techType, questionType } = selectOption;

  const {
    data: techTypesQuery,
    isLoading,
    isError,
  } = useQuery([queryConstants.techTypes], () => baseApi.get('/techTypes'));

  const techTypes = useMemo(
    () => techTypesQuery?.data.map(({ id, imgUrl, name }) => ({
      id,
      value: id,
      label: name,
      image: imgUrl,
    })) || [],
    [techTypesQuery],
  );

  const selectedTechTypes = useMemo(
    () => techTypes.filter(({ id }) => selectedTechIds.includes(id)),
    [techType, selectedTechIds],
  );

  const currentConfigValue = useMemo(
    () => questionState.get(techType)?.get(questionType) || new Set(),
    [questionState, selectOption],
  );

  const isCurrentConfigRandomized = typeof currentConfigValue === 'number';

  const handleEditLoad = async () => {
    const { id, candidateEmail, timeAllowedInMins } = editOption;
    const { data: editMeta } = await baseApi.get(`/assessmentSession/${id}`);
    const techTypeIds = new Set();
    const newQuestionState = new Map();
    let ptr;
    for (const obj of editMeta) {
      techTypeIds.add(obj.techTypeId);

      ptr = newQuestionState;
      ptr.set(obj.techTypeId, ptr.get(obj.techTypeId) || new Map());
      ptr = ptr.get(obj.techTypeId);
      ptr.set(obj.questionType, ptr.get(obj.questionType) || new Set());
      ptr = ptr.get(obj.questionType);
      ptr.add(obj.questionId);
    }
    setQuestionState(newQuestionState);
    setAssessmentParams({
      candidateEmails: candidateEmail,
      timeAllowedInMins,
    });
    setSelectedTechIds([...techTypeIds]);
    setSelectOption((prev) => ({
      ...prev,
      techType: editMeta[0].techTypeId,
    }));
  };

  useEffect(() => {
    if (editOption) handleEditLoad();
  }, [editOption]);

  const fetchData = async () => {
    try {
      const response = await baseApi.get('/questions', {
        params: {
          techTypeId: techType,
          questionType,
        },
      });
      setQuestions(response.data);
    } catch (err) {
      showNotification({
        title: '',
        message: 'Something went to wrong',
      });
    }
  };

  useEffect(() => {
    if (techType) {
      fetchData();
    }
  }, [selectOption]);

  const checkError = () => {
    const errorMap = new Map();
    const [, emailError] = checkEmail(assessmentParams.candidateEmails);
    let hasError = false;
    [
      ['candidateEmails', emailError],
      ['timeAllowedInMins', !assessmentParams.timeAllowedInMins],
      ['questionState', !questionState.size],
    ].forEach(([key, value]) => {
      if (!hasError && value) {
        hasError = value;
      }
      errorMap.set(key, value);
    });
    setErrors(errorMap);
    return hasError;
  };

  useEffect(() => {
    if (errors.size) checkError();
  }, [assessmentParams, questionState]);

  const onTechTypeChange = (ids) => {
    if (techType) {
      if (!ids.includes(techType)) {
        const currentIdx = selectedTechIds.findIndex((id) => id === techType);
        const validNewIdx = currentIdx - 1 >= 0 ? currentIdx - 1 : currentIdx;
        setSelectOption({ ...selectOption, techType: ids[validNewIdx] });
      }
    } else {
      setSelectOption({ ...selectOption, techType: ids[0] });
    }

    for (const key of questionState.keys()) {
      if (!ids.includes(key)) {
        questionState.delete(key);
      }
    }
    setQuestionState(new Map(questionState));
    setSelectedTechIds(ids);
    if (!ids.length) {
      setQuestions([]);
    }
  };

  const setSingleValue = (key, value) => {
    if (selectOption[key] === value) return;
    setSelectOption({ ...selectOption, [key]: value });
  };

  const handleQuestionPicked = (pickedQuestionId) => {
    if (!questionState.has(techType)) {
      questionState.set(techType, new Map());
    }
    const queTypeState = questionState.get(techType);
    if (!queTypeState.has(questionType) || typeof queTypeState.get(questionType) === 'number') {
      queTypeState.set(questionType, new Set());
    }
    const queIdState = queTypeState.get(questionType);
    if (queIdState.has(pickedQuestionId)) {
      queIdState.delete(pickedQuestionId);
    } else {
      queIdState.add(pickedQuestionId);
    }

    // if id set is empty, remove questiontype
    if (!queIdState.size) {
      queTypeState.delete(questionType);
    }
    // if questionType is empty, remove techtype from map
    if (!queTypeState.size) {
      questionState.delete(techType);
    }
    setQuestionState(new Map(questionState));
  };

  const handleRandomization = (e) => {
    if (!questionState.has(techType)) {
      questionState.set(techType, new Map());
    }
    const queTypeState = questionState.get(techType);
    if (e) {
      queTypeState.set(questionType, Number(e));
    } else {
      queTypeState.delete(questionType);
    }

    // if questionType is empty, remove techtype from map
    if (!queTypeState.size) {
      questionState.delete(techType);
    }
    setQuestionState(new Map(questionState));
  };

  const handleAssessmentParams = (name, value) => {
    setAssessmentParams((prev) => ({ ...prev, [name]: value }));
  };

  const getPayload = () => {
    const questionIds = [];
    const randomQuestions = [];
    for (const techTypeId of questionState.keys()) {
      const techTypeMap = questionState.get(techTypeId);
      for (const questionTypeName of techTypeMap.keys()) {
        const questionData = techTypeMap.get(questionTypeName);
        if (typeof questionData === 'number') {
          randomQuestions.push({
            techTypeId,
            questionType: questionTypeName,
            count: questionData,
          });
        } else {
          questionIds.push(...questionData);
        }
      }
    }
    return [questionIds, randomQuestions];
  };

  const handleSubmit = async () => {
    const { timeAllowedInMins, candidateEmails } = assessmentParams;
    const [questionIds, randomQuestions] = getPayload();
    const payload = { timeAllowedInMins, questionIds, randomQuestions };
    if (editOption) {
      try {
        await baseApi.put('/assessmentSession', { ...editOption, ...payload });
        showNotification({
          title: '',
          message: 'Updated Successfully',
        });
        handleClose(1);
      } catch (_err) {
        showNotification({
          title: '',
          message: 'Something went wrong',
        });
      }
    } else {
      const [parsedEmails] = checkEmail(candidateEmails);
      try {
        await baseApi.post('/assessmentSession', { candidateEmails: parsedEmails, ...payload });
        showNotification({
          title: '',
          message: 'Added Successfully',
        });
        handleClose(1);
      } catch (_err) {
        showNotification({
          title: '',
          message: 'Something went wrong',
        });
      }
    }
  };

  const onSubmit = () => {
    if (!checkError()) {
      handleSubmit();
    }
  };

  if (isLoading) {
    return <CustomLoadingOverlay />;
  }

  if (isError) {
    return <Title>Error occurred</Title>;
  }

  return (
    <Modal
      title={`${editOption ? 'Edit' : 'Add'} Assessment Session`}
      opened
      size="80%"
      closeOnClickOutside={false}
      onClose={handleClose}
    >
      <Grid className="schedule-assessment-model-content">
        <SelectTechType
          techTypes={techTypes}
          selectedTechIds={selectedTechIds}
          techType
          onChange={onTechTypeChange}
        />
        {!!selectedTechTypes.length && (
          <Grid.Col
            mt={10}
            className="card"
          >
            <Group spacing="lg">
              {selectedTechTypes.map(({ label, id }) => (
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
              span={8}
            />
            <Grid.Col
              mt={10}
              span={4}
            >
              <NumberInput
                value={isCurrentConfigRandomized ? currentConfigValue : undefined}
                placeholder="Choose Random Count"
                radius="md"
                onChange={handleRandomization}
                max={questions.length}
                min={1}
                rightSection={(
                  <div>
                    <Text>{questions.length}</Text>
                  </div>
                )}
                disabled={!isCurrentConfigRandomized && currentConfigValue.size}
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
                  onClick={() => handleQuestionPicked(q.id)}
                  style={isCurrentConfigRandomized ? { pointerEvents: 'none' } : {}}
                >
                  <Grid>
                    <Grid.Col
                      span={11}
                    >
                      <Checkbox
                        checked={!isCurrentConfigRandomized && currentConfigValue.has(q.id)}
                        disabled={isCurrentConfigRandomized}
                        readOnly
                        label={(
                          <Text weight={500} onClick={() => handleQuestionPicked(q.id)} size="md">
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
                placeholder="Enter The Email Id"
                radius="md"
                value={assessmentParams.candidateEmails}
                disabled={editOption}
                onChange={(e) => handleAssessmentParams('candidateEmails', e.target.value)}
                required
                helper
              />
              {
                errors.get('candidateEmails') && <Text color="red">{message.candidateEmails}</Text>
              }
            </Grid.Col>
            <Grid.Col
              mt={10}
              span={4}
            >
              <NumberInput
                placeholder="Enter the Allowed Duration"
                radius="md"
                value={assessmentParams.timeAllowedInMins}
                hideControls
                onChange={(e) => handleAssessmentParams('timeAllowedInMins', e)}
                required
                he
              />
              {
                errors.get('timeAllowedInMins') && <Text color="red">{message.timeAllowedInMins}</Text>
              }
            </Grid.Col>
            <Grid.Col
              mt={10}
              span={11}
            >
              <Text
                size="md"
                style={{ float: 'right' }}
                mt={10}
                color="red"
              >
                {
                errors.get('questionState') && <Text color="red">{message.questionState}</Text>
              }
              </Text>
            </Grid.Col>
            <Grid.Col
              mt={10}
              span={1}
              style={{ float: 'right' }}
            >
              <Button type="submit" size="md" onClick={onSubmit}>
                {editOption ? 'Update' : 'Save'}
              </Button>
            </Grid.Col>
          </>
        )}
      </Grid>
    </Modal>
  );
}
