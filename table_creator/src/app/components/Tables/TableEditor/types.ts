import { TContent } from "../TableView/types";

export interface DataDisplayProps {
    data: Record<string, any>;
    onMatchPath: (fieldName: string, path: string, el: HTMLElement) => void;
    content: TContent[];
    setContent: React.Dispatch<React.SetStateAction<TContent[]>>;//(content: TContent[]) => void;
    addItemMode?: boolean;
    setAddItemMode: React.Dispatch<React.SetStateAction<boolean>>;
  }
  
  
  //import { useState, useRef, useCallback, useEffect } from 'react';
  
  export interface MatchItem {
    itemField: string;
    path: string;
    itemEl: HTMLElement | null;
    pathEl: HTMLElement | null;
  }