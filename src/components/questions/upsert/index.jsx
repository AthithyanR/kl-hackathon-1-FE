/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import {
  Title, Grid, Modal, Textarea, LoadingOverlay, Group, Button, Card, Text, Checkbox, Input, NumberInput, TextInput,
} from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { showNotification } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import baseApi from '../../../shared/api';
import './upsert.scss';

export default function AddQuestion(props) {
  const {
    opened, setOpened, modelKey, techType, questionType, editObject, refetchData,
  } = props;
  const form = useForm({
    initialValues: modelKey === 'edit' ? {
      question: editObject?.question,
      option1: editObject?.option1,
      option2: editObject?.option2,
      option3: editObject?.option3,
      option4: editObject?.option4,
      correctoption: editObject?.correctOption,
    } : {
      question: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      correctoption: '',
    },
    validate: {
      question: (Value) => (Value.length > 0 ? null : 'Please Enter Question'),
      option1: (Value) => (Value.length > 0 ? null : 'Please Enter Options 1'),
      option2: (Value) => (Value.length > 0 ? null : 'Please Enter Options 2'),
      option3: (Value) => (Value.length > 0 ? null : 'Please Enter Options 3'),
      correctoption: (Value) => (Value.length > 0 ? null : 'Please Enter Currect Option'),
    },

  });

  const addMutation = useMutation(
    (payload) => baseApi.post('/questions', [{
      ...payload,
      techTypeId: techType,
      questionType,
    }]),
    {
      onSuccess: () => {
        form.reset();
        refetchData();
        showNotification({
          title: '',
          message: 'Add Successfully',
        });
      },
      onError: () => {
        showNotification({
          title: '',
          message: 'Unable to add new Question!',
        });
      },
    },
  );

  const updateMutation = useMutation(
    (payload) => baseApi.put('/questions', [{
      ...payload,
      id: editObject.id,
      techTypeId: editObject.techTypeId,
      questionType: editObject.questionType,
    }]),
    {
      onSuccess: () => {
        form.reset();
        refetchData();
        showNotification({
          title: '',
          message: 'Updated Successfully',
        });
      },
      onError: () => {
        showNotification({
          title: '',
          message: 'Unable to update the tech type!',
        });
      },
    },
  );

  const onCloseModal = () => {
    setOpened(false);
    form.reset();
  };

  return (
    <Modal
      title={`${modelKey === 'add' ? 'Add' : 'Edit'} Question`}
      opened={opened}
      size="80%"
      onClose={() => onCloseModal()}
      closeOnClickOutside={false}
    >
      <form
        onSubmit={form.onSubmit(modelKey === 'add' ? addMutation.mutate : updateMutation.mutate)}
      >
        <Grid className="schedule-interview-model-content">
          <Grid.Col
            mt={10}
          >
            <Card>
              <Textarea
                placeholder="Add Question"
                {...form.getInputProps('question')}
                style={{}}
              />
              <div style={{ width: '100%' }}>
                <div style={{
                  display: 'flex', marginTop: '2%', justifyContent: 'space-between', width: '100%',
                }}
                >
                  <div style={{ width: '48%' }}>
                    <TextInput
                      radius="sm"
                      placeholder="Option 1"
                      size="sm"
                      {...form.getInputProps('option1')}
                      withAsterisk
                    />
                  </div>
                  <div style={{ width: '48%' }}>
                    <TextInput
                      placeholder="Option 2"
                      radius="sm"
                      size="sm"
                      {...form.getInputProps('option2')}
                      withAsterisk
                    />
                  </div>
                </div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '2%',
                }}
                >
                  <div style={{ width: '48%' }}>
                    <TextInput
                      placeholder="Option 3"
                      radius="sm"
                      size="sm"
                      withAsterisk
                      {...form.getInputProps('option3')}
                    />
                  </div>
                  <div style={{ width: '48%' }}>
                    <TextInput
                      placeholder="Option 4"
                      radius="sm"
                      size="sm"
                      {...form.getInputProps('option4')}
                    />
                  </div>
                </div>
                <div style={{
                  display: 'flex', justifyContent: 'center', marginTop: '2%', width: '100%',
                }}
                >
                  <div style={{ width: '80%' }}>
                    <TextInput
                      placeholder="Correct Option"
                      radius="sm"
                      size="sm"
                      withAsterisk
                      {...form.getInputProps('correctoption')}
                    />
                  </div>
                </div>
              </div>
            </Card>
            <Grid.Col
              mt={10}
              style={{ float: 'right' }}
            >
              <Button
                mt="xl"
                type="submit"
                loading={addMutation.isLoading}
              >
                {modelKey === 'add' ? 'Save' : 'Update'}
              </Button>
            </Grid.Col>
          </Grid.Col>

        </Grid>
      </form>
    </Modal>
  );
}
