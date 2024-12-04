import React from 'react';
import { JSONViewer } from '../JSONViewer/JSONViewr';
//import {JSONViewer} from '@/components/__atoms/JSONViewer/JSONViewr'; 

type TProps = {
    value: any;
    prefix?: string;
    postfix?: string;
    missing?: string;
    html?: boolean
}

const Value = ({ value, prefix='',postfix='', missing='—', html=false }: TProps) => {

  //return JSON.stringify(value);

  if (value === undefined || value === null || value === '') {
    return missing ;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    if (html) {
      return <span className="flex items-center"dangerouslySetInnerHTML={{ __html: value }} />
    }
    return <>{value + postfix}</>;
  }

  if (Array.isArray(value)) {
    return <>{value.join(', ') + postfix}</>;
  }

  if (typeof value === 'object') {
    try {
      return <JSONViewer data={value} />;
    } catch (error) {
      console.error('Error rendering JSONViewer:', error);
      return <>Invalid object</>;
    }
  }

  return <>Unsupported value</>;
};

export default Value;
