import editDeleteRenderer from '../../renderers/edit-delete-renderer';
import stateRenderer from '../../renderers/state-renderer';

const config = {
  rowKey: 'id',
  columnDefs: [
    {
      display: 'Candidate Email',
      value: 'candidateEmail',
    },
    {
      display: 'Time Allotted',
      value: 'timeAllowedInMins',
      renderer: (v) => (v.timeAllowedInMins > 60 ? `${(v.timeAllowedInMins / 60).toFixed(2)} hrs` : `${v.timeAllowedInMins} mins`),
    },
    {
      display: 'Assessment Session Started',
      renderer: stateRenderer({ key: 'startTime' }),
    },
    {
      display: 'Assessment Session Completed',
      renderer: stateRenderer({ key: 'endTime' }),
    },
    {
      display: 'Email Sent',
      renderer: stateRenderer({ key: 'isEmailSent' }),
    },
    {
      display: 'Questions Count',
      value: 'questionsCount',
    },
    {
      display: 'Possible Score',
      value: 'possibleScore',
    },
    {
      display: 'Score',
      value: 'score',
    },
    {
      display: 'Score Out Of 100 percent',
      renderer: (v) => `${v.scoreOutOf100Percent}%`,
    },
    {
      display: 'Operations',
      renderer: editDeleteRenderer,
    },
  ],
};

export default config;
