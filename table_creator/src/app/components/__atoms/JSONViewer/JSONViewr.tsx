import { Box, NavLink, Text } from '@mantine/core';
import Link from 'next/link';
import * as React from 'react';

export const JSONViewer: React.FC<{ data: any }> = ({ data }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  return (
    <Box className="">
      {isExpanded ? (
        <>
          <a onClick={()=>{setIsExpanded(false)}} className="text-xs text-gray-500 cursor-pointer">Свернуть ▴</a>
          <pre className="overflow-auto">
            <Text c="dimmed" size="xs" className={"text-wrap w-full w-max-xl text-left"}>
              {JSON.stringify(data, null, 2)}
            </Text>
          </pre>
        </>
      ) : (
        <a onClick={()=>{setIsExpanded(true)}} className="text-xs text-gray-500 cursor-pointer ">Подробнее ▾</a>
      )}
    </Box>
  );
};
