 type FilterWithSelect = {
    data: any;
    placeholder: string;
    label: string;
    fieldName: string;
  };
  
  type FilterWithComponent = {
    component: JSX.Element;
    fieldName: string;
  };
  
 type TFilter = FilterWithSelect | FilterWithComponent;
  
 type TCellValue = { value: string; formatter: (value: any) => string } | string;
  
export  type TAction = {
    text: string;
    link?: string;
    onClick?: () => void;
    function?: (param: string) => void;
    param?: string;
    linkParam?: string;
    confirmationRequired?: boolean; // TODO check why it's not working
    showCondition?: (item: any) => boolean;
  };


  export interface TContent {
    label: string;
    fieldName: string;
    filter?: boolean;
    sorter?: boolean;
    formatter?: string;//(value: any) => string;
    html?: boolean;
    display?: boolean;
  }  
  

//old TableView, tableView_v3 has new props type
  export  type TProps = {
    header?: string;
    addButton?: {
      text: string;
      link: string;
    };
    filters?: any;//TFilter[];
  
    filterState?: any; //Record<string, string>;
    setFilterState?: React.Dispatch<React.SetStateAction<any>>;
    data: any[];
    ths: string[];
    tds: TCellValue[];
    loading: boolean;
    error: any;
    actionsMenu?: TAction[] ;
  };