import React from 'react';

interface CustomMark {
  labelNode: React.ReactNode;
  info: {
    required: boolean;
  };
}

const CustomMark = (labelNode: React.ReactNode, info: { required: boolean }) => {
  return info.required ? (
    <>
      {labelNode}
      <span style={{ order: 1, color: '#F53F3F', marginRight: 8 }}>*</span>
    </>
  ) : (
    labelNode
  );
};

export default CustomMark;
