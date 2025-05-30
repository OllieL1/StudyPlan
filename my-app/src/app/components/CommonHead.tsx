'use client';

import { useEffect } from 'react';

interface CommonHeadProps {
  title: string;
}

const CommonHead: React.FC<CommonHeadProps> = ({ title }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return null;
};

export default CommonHead;