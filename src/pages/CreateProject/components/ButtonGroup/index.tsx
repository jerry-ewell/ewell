import React from 'react';
import { Button, Flex } from 'antd';

const ButtonGroup = () => {
  return (
    <Flex>
      <Button>Previous</Button>
      <Button>{`Next >`}</Button>
    </Flex>
  );
};
export default ButtonGroup;
