import { useState, useCallback } from 'react';

export const useInput = (defaultValue) => {
  const [value, setValue] = useState(defaultValue);

  const onChange = useCallback(e => {
    const { value } = e.target;
    setValue(value);
  }, []); 

  return { value, onChange };
};
