/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import {
  Title, Grid, Modal, Textarea, LoadingOverlay, Group, Button, Card, Text, Checkbox, Input, NumberInput, TextInput,
} from '@mantine/core';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { showNotification } from '@mantine/notifications';
import { useForm } from '@mantine/form';
import { queryConstants } from '../../../shared/constant-values';
import baseApi from '../../../shared/api';
import './upsert.scss';

export default function AddQuestion(props) {
  const {
    opened, setOpened, modelKey, editObject,
  } = props;
  const [editId, setEditId] = useState(null);
  const [addQuest, setAddQuest] = useState('');
  let init = {
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correctoption: '',
  };
  useEffect(() => {
    if (modelKey === 'edit') {
      init = {
        questionType: editObject.questionType,
        question: editObject.question,
        option1: editObject.option1,
        option2: editObject.option2,
        option3: editObject.option3,
        option4: editObject.option4,
        correctOption: editObject.option,
      };
    }
  });
  const queryClient = useQueryClient();
  const form = useForm({
    initialValues: init,
    validate: {
      question: (Value) => (Value.length > 0 ? null : 'Please Enter Question'),
      option1: (Value) => (Value.length > 0 ? null : 'Please Enter Options'),
      option2: (Value) => (Value.length > 0 ? null : 'Please Enter Options'),
      option3: (Value) => (Value.length > 0 ? null : 'Please Enter Options'),
      correctoption: (Value) => (Value.length > 0 ? null : 'Please Enter Currect Option'),
    },

  });

  const addMutation = useMutation(
    (payload) => baseApi.post('/questions', [payload]),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([queryConstants.questions]);
        form.reset();
        setOpened(false);
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
    (payload) => baseApi.put('/questions', [payload]),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([queryConstants.questions]);
        form.reset();
        setOpened(false);
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
      title="Add Question"
      opened={opened}
      size="80%"
      // fullScreen
      onClose={() => onCloseModal()}
      closeOnClickOutside={false}
    >
      <form
        onSubmit={form.onSubmit(
          editId ? updateMutation.mutate : addMutation.mutate,
        )}
      >
        <Grid>
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
                      addQuest={setAddQuest}
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
                Add
              </Button>
            </Grid.Col>
          </Grid.Col>

        </Grid>
      </form>
    </Modal>
  );
}
