import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import DynamicProblemForm from '../../../components/form-engine/DynamicProblemForm';

export default function UserProblemSubmit() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialType = searchParams.get('type') || null;

  return (
    <div className="py-4 pb-16">
      <DynamicProblemForm
        initialRequestType={initialType}
        onSuccess={(problem) => {
          if (problem?.id) {
            navigate(`/user/problems/${problem.id}`);
          } else {
            navigate('/user/problems');
          }
        }}
      />
    </div>
  );
}
