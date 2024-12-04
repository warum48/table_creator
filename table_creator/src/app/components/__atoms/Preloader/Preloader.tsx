import { Box, Center, Loader } from '@mantine/core';
import * as React from 'react';
import classes from './Spinner.module.css';   

export const Preloader = () => {
  return (
    <Center>
      {/*<Loader
      // color="blue"
  />*/}
      <Box h={40} w={40} className='scale-50'>
        <div className={classes.loader }></div>
      </Box>
    </Center>
  );
};
