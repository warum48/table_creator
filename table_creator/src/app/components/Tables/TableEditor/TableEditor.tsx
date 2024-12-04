"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";

import { Button, Divider } from "@mantine/core";
import { TContent } from "../TableView/types";
import { DataDisplayProps, MatchItem } from "./types";
import { SortableList } from "./SortableList";
import { DataDisplay } from "./DataDisplay";
import { useMatches } from "./useMatches";

import { throttle } from "lodash";
//import throttle from "lodash/throttle";

//export default useMatches;

export const TableEditor = ({
  content,
  exampleItem,
  setContent,
  reset = () =>{}
}: {
  content: TContent[];
  exampleItem: any;
  setContent: React.Dispatch<React.SetStateAction<TContent[]>>;
  reset?: () => void
}) => {
  const [rerender, setRerender] = useState(0);
  const [addItemMode, setAddItemMode] = useState(false);

  const { matches, handleMatchItemRef, handleMatchPathRef } = useMatches(
    content.map((item) => ({
      itemField: item.fieldName,
      path: item.fieldName,
    })),
  );

  const containerRef = useRef<HTMLDivElement>(null);

  const renderLines = () => {
    const dotRadius = 5;
    const lineWidth = 1;
    const margin = 20;

    if (!containerRef.current) return null;
    const containerRect = containerRef.current.getBoundingClientRect();

    const getRandomColor = () => {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };

    return matches
      .filter((match) => match.itemEl && match.pathEl)
      .map((match, index) => {
        const itemRect = match.itemEl!.getBoundingClientRect();
        const pathRect = match.pathEl!.getBoundingClientRect();

        // Calculate center points for the start and end of the line
        const x1 = itemRect.right - containerRect.left - margin - dotRadius;
        const y1 = itemRect.top + itemRect.height / 2 - containerRect.top;
        const x2 = pathRect.left - containerRect.left - margin - dotRadius;
        const y2 = pathRect.top + pathRect.height / 2 - containerRect.top;

        const color = getRandomColor();

        return (
          <React.Fragment key={index}>
            {/* Line connecting the dots */}
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={color}
              strokeWidth={lineWidth}
            />
            {/* Dot at the start of the line */}
            <circle cx={x1} cy={y1} r={dotRadius} fill={color} />
            {/* Dot at the end of the line */}
            <circle cx={x2} cy={y2} r={dotRadius} fill={color} />
          </React.Fragment>
        );
      });
  };

  useEffect(() => {
    // Explicitly type the throttled function
    const handleResize = throttle(() => {
      setRerender((prev) => prev + 1);
    }, 200);

    // Wrap the throttled function to match the expected event listener type
    const resizeListener = () => handleResize();

    window.addEventListener("resize", resizeListener);

    return () => {
      window.removeEventListener("resize", resizeListener);
      handleResize.cancel(); // Ensure trailing calls are cleared
    };
  }, []);

  return (
    <>
      <div ref={containerRef} className="relative flex flex-row space-x-4" >
        <div className="w-1/2">
          <SortableList
            onMatchItemRef={handleMatchItemRef}
            content={content}
            setContent={setContent}
            onSortEnd={() => setRerender(rerender + 1)}
            onDeleteItem={() => setRerender(rerender + 1)}
          />
        </div>
        <div className="w-1/2">
          <DataDisplay
            data={exampleItem}
            onMatchPath={handleMatchPathRef}
            content={content}
            setContent={setContent}
            addItemMode = {addItemMode}
             setAddItemMode={setAddItemMode}
            
          />
        </div>
        <svg
          className="pointer-events-none absolute h-full w-full"
          key={"lines" + rerender}
        >
          {renderLines()}
        </svg>
      </div>
      <div className="flex gap-2">
        
        <Button onClick={() => setAddItemMode(true)} disabled={addItemMode}>
          Добавить столбец
        </Button>
        <Button onClick={() => setAddItemMode(true)} disabled={!addItemMode}>
          Отмена
        </Button>
        <Divider orientation="vertical" />
        <Button onClick={() => reset()} disabled={false}>
          Отменить изменения таблицы
        </Button>
      </div>
      {addItemMode && (
        <div className="text-xs">Выберите из схемы поле, которое вы хотите отобразить в таблице</div>
      )}
    </>
  );
};



