import { useState } from 'react';

export interface MessageError {
  fieldName: string;
}

export interface SetErrors {
  field: string;
  message: string;
}

export function useErrors() {
  const [errors, setErrors] = useState<SetErrors[]>([]);

  function setError({ field, message }: SetErrors) {
    const errorAlreadyExists = errors.find((error) => error.field === field);

    if (errorAlreadyExists) {
      return;
    }

    setErrors((prevState) => [
      ...prevState,
      { field, message },
    ]);
  }

  function removeError({ fieldName }: MessageError) {
    setErrors((prevState) => prevState.filter(
      (error) => error.field !== fieldName,
    ));
  }

   
  const getErrorMessageByFieldName = ({ fieldName }: MessageError) =>
      errors.find((error) => error.field === fieldName)?.message;

  return {
    errors, setError, removeError, getErrorMessageByFieldName,
  };
}