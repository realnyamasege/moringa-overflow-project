import React from 'react';

function AnswerList({ answers }) {
  return (
    <div>
      {answers.map((answer) => (
        <div key={answer.id}>
          <p>{answer.content}</p>
        </div>
      ))}
    </div>
  );
}

export default AnswerList;