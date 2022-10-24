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
  const [correctoption, setCorrectoption] = useState(editObject?.correctOption || '');
  const [correctoptionError, setCorrectoptionError] = useState(false);

  const form = useForm({
    initialValues: {
      question: editObject?.question,
      option1: editObject?.option1,
      option2: editObject?.option2,
      option3: editObject?.option3,
      option4: editObject?.option4,
      marks: editObject?.marks,
    },
    validate: {
      marks: (value) => (Number(value) > 0 && Number(value) <= 10 ? null : 'Please Enter valid marks (1 to 10)'),
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
      ...editObject,
      ...payload,
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

  const handleCorrectOptionChange = (e) => {
    setCorrectoptionError(false);
    setCorrectoption(e.target.name);
  };

  const handleSubmit = (values) => {
    if (!correctoption || correctoption === 'option4') {
      return setCorrectoptionError(true);
    }
    const payload = { ...values, marks: Number(values.marks), correctoption };
    return (modelKey === 'add' ? addMutation : updateMutation).mutate(payload);
  };

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
        onSubmit={form.onSubmit(handleSubmit)}
      >
        <Grid>
          <Grid.Col
            mt={10}
          >
            <Card>
              <Textarea
                placeholder="Question"
                {...form.getInputProps('question')}
                minRows={8}
                required
              />
              <div style={{ width: '100%' }}>
                <div style={{
                  display: 'flex', marginTop: '2%', justifyContent: 'space-between', width: '100%',
                }}
                >
                  <div style={{
                    width: '48%', display: 'flex', justifyContent: 'center', alignItems: 'center',
                  }}
                  >
                    <Checkbox checked={correctoption === 'option1'} name="option1" onClick={handleCorrectOptionChange} mr={10} />
                    <Textarea
                      radius="sm"
                      placeholder="Option 1"
                      size="sm"
                      {...form.getInputProps('option1')}
                      withAsterisk
                      style={{ width: '100%' }}
                      minRows={4}
                      required
                    />
                  </div>
                  <div style={{
                    width: '48%', display: 'flex', justifyContent: 'center', alignItems: 'center',
                  }}
                  >
                    <Checkbox checked={correctoption === 'option2'} name="option2" onClick={handleCorrectOptionChange} mr={10} />
                    <Textarea
                      placeholder="Option 2"
                      radius="sm"
                      size="sm"
                      {...form.getInputProps('option2')}
                      withAsterisk
                      style={{ width: '100%' }}
                      minRows={4}
                      required
                    />
                  </div>
                </div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '2%',
                }}
                >
                  <div style={{
                    width: '48%', display: 'flex', justifyContent: 'center', alignItems: 'center',
                  }}
                  >
                    <Checkbox checked={correctoption === 'option3'} name="option3" onClick={handleCorrectOptionChange} mr={10} />
                    <Textarea
                      placeholder="Option 3"
                      radius="sm"
                      size="sm"
                      withAsterisk
                      {...form.getInputProps('option3')}
                      style={{ width: '100%' }}
                      minRows={4}
                      required
                    />
                  </div>
                  <div style={{
                    width: '48%', display: 'flex', justifyContent: 'center', alignItems: 'center',
                  }}
                  >
                    <Checkbox checked={correctoption === 'option4'} name="option4" onClick={handleCorrectOptionChange} mr={10} />
                    <Textarea
                      placeholder="Option 4"
                      radius="sm"
                      size="sm"
                      {...form.getInputProps('option4')}
                      style={{ width: '100%' }}
                      minRows={4}
                    />
                  </div>
                </div>
                <div style={{
                  display: 'flex', justifyContent: 'center', marginTop: '2%', width: '100%',
                }}
                >
                  <div style={{ width: '20%' }}>
                    <TextInput
                      placeholder="marks"
                      radius="sm"
                      size="sm"
                      withAsterisk
                      {...form.getInputProps('marks')}
                      required
                    />
                  </div>
                </div>
              </div>
            </Card>
            <Grid.Col
              mt={10}
              style={{
                float: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
              }}
            >
              {correctoptionError && <Text color="red">Please select the correct option</Text>}
              <Button
                mt="xl"
                type="submit"
                loading={addMutation.isLoading}
                style={{ marginTop: 0 }}
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
