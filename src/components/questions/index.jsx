/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import React, { forwardRef, useState, useEffect } from 'react';
import {
  ActionIcon,
  Grid,
  Paper,
  Select,
  LoadingOverlay,
  Title,
  Box,
  CloseButton,
  Button,
  Card,
  Text,
  Modal,
  TextInput,
  SegmentedControl,
  Alert,
} from '@mantine/core';
import { IconPlaylistAdd, IconPencilPlus, IconTrash } from '@tabler/icons';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import AddQuestion from './upsert';
import { queryConstants, questionTypes, dbMessageSnip } from '../../shared/constant-values';
import baseApi from '../../shared/api';
import { generateQS, isEmpty } from '../../shared/utils';
import './upsert/upsert.scss';

const option = ({
  label, image, onRemove, classNames, ...others
}) => (
  <div {...others}>
    <Box
      sx={(theme) => ({
        display: 'flex',
        cursor: 'default',
        alignItems: 'center',
        backgroundColor:
          theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        border: `1px solid ${
          theme.colorScheme === 'dark'
            ? theme.colors.dark[7]
            : theme.colors.gray[4]
        }`,
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

const Item = forwardRef(({ label, image, ...others }, ref) => (
  <div ref={ref} {...others}>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box mr={10} />
      <img src={image} width="20" alt={label} />
      <div>{label}</div>
    </Box>
  </div>
));

export default function Questions() {
  const [opened, setOpened] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectOption, setSelectOption] = useState({ questionType: questionTypes[0] });
  const [techTypeOf, setTechTypeOf] = useState(null);
  const [modelKey, setModalKey] = useState('add');
  const [editObject, setEditObject] = useState({});

  const { questionType, techType } = selectOption;
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (selectOption.techType) {
      fetchData();
    }
  }, [selectOption]);

  const {
    data: techTypesResp,
    isLoading: isLoadingTechTypes,
    isError: isErrorTechTypes,
  } = useQuery(
    [queryConstants.techTypes],
    () => baseApi.get('/techTypes'),
  );

  const techTypes = techTypesResp?.data.map(({ id, imgUrl, name }) => ({
    id,
    value: id,
    label: name,
    image: imgUrl,
  })) || [];

  // setSelectOption(() => ({ ...selectOption, techType: techTypes[0]?.id }));

  const setSingleValue = (key, value) => {
    if (selectOption[key] === value) return;
    setSelectOption({ ...selectOption, [key]: value });
  };

  const openModal = (key, visible, quiz) => {
    setOpened(visible);
    setModalKey(key);
    setEditObject(quiz);
  };

  const deleteMutation = useMutation(
    (payload) => baseApi.delete('/questions', { data: [payload] }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([queryConstants.questions]);
      },
      onError: (err) => {
        showNotification({
          message: err?.data?.includes(dbMessageSnip.foreignKey)
            ? 'Please delete related questions!'
            : 'Unable to delete question!',
        });
      },
    },
  );

  const handleDelete = (id) => {
    <Alert title="Alert!" color="red">
      Are You Sure Want to delete this question
      <div>
        <div>
          <Button onClick={navigate('/questions')}>
            cancel
          </Button>
        </div>
        <div>
          <Button onClick={() => deleteMutation.mutate(id)}>
            ok
          </Button>
        </div>
      </div>
    </Alert>;
  };

  if (isLoadingTechTypes) {
    return <LoadingOverlay visible overlayBlur={2} />;
  }

  if (isErrorTechTypes) {
    return <Title>Error occurred</Title>;
  }

  return (
    <Paper p={10}>
      <Grid justify="space-between">
        <Grid.Col span={4}>
          <Title order={2} mb={4}>
            Questions
          </Title>
        </Grid.Col>
        <Grid.Col span={1}>
          <ActionIcon
            onClick={() => openModal('add', true)}
            variant="filled"
            sx={{ backgroundColor: '#211c57', marginLeft: 'auto' }}
          >
            <IconPlaylistAdd size={24} />
          </ActionIcon>
        </Grid.Col>
      </Grid>
      <Grid>
        <AddQuestion
          modelKey={modelKey}
          opened={opened}
          questionType={questionType}
          setOpened={setOpened}
          editObject={editObject}
        />
      </Grid>
      <Grid justify="space-between">
        <Grid.Col span={4}>
          <Select
            label="Tech Types"
            data={techTypes}
            // defaultValue={techTypes[1].id}
            valueComponent={option}
            itemComponent={Item}
            searchable
            size="md"
            onChange={(e) => setSingleValue('techType', e)}
            placeholder="Select Tech Type"
          />
        </Grid.Col>
        <Grid.Col span={3}>
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
        </Grid.Col>
      </Grid>
      <Grid>
        <Grid.Col span={12}>
          <Paper>
            {!!questions.length && (
              <Grid.Col
                className="question"
                mt={10}
                span={12}
              >
                  {questions.map((q) => (
                    <Card
                      shadow="sm"
                      mb={10}
                      p={20}
                      key={q.id}
                    >
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Box>
                          <ActionIcon
                            mr={5}
                            onClick={() => openModal('edit', true, q)}
                            variant="light"
                          >
                            <IconPencilPlus />
                          </ActionIcon>
                        </Box>
                        <Box>
                          <ActionIcon
                            mr={5}
                            onClick={() => handleDelete(q.id)}
                            variant="light"
                          >
                            <IconTrash />
                          </ActionIcon>

                        </Box>
                      </div>
                      <Text weight={500} size="md">
                        {q.question}
                        {' : '}
                        {q.marks}
                      </Text>
                      <Card>
                        {q.option1}
                      </Card>
                      <Card>
                        {q.option2}
                      </Card>
                      <Card>
                        {q.option3}
                      </Card>
                      <Card>
                        {q.option4}
                      </Card>
                    </Card>
                  ))}
              </Grid.Col>
            )}
          </Paper>
        </Grid.Col>
      </Grid>
    </Paper>
  );
}
