import { useCallback } from "react";
import { DataDisplayProps } from "./types";
import { add } from "lodash";
import { EnRuKeys } from "@/app/dictionaries/EnRuKeys";
//import { EnRuKeys } from "@/dictionaries/EnRuKeys";

export const DataDisplay: React.FC<DataDisplayProps> = ({
  data,
  onMatchPath,
  content,
  setContent,
  addItemMode,
  setAddItemMode,
}) => {
  // Create a Set of fieldNames for quick lookup
  const contentFieldNames = new Set(content.map((item) => item.fieldName));

  const renderData = useCallback(
    (data: Record<string, any>, path: string) => {
      return Object.entries(data || {}).map(([key, value]) => {
        const currentPath = path ? `${path}.${key}` : key;
        const hasNestedValues = typeof value === "object" && value !== null;

        // Check if currentPath is in contentFieldNames
        const isContentField = contentFieldNames.has(currentPath);

        const handleClick = () => {
          if (!hasNestedValues) {
            console.log(currentPath); // Log the full path if it has no nested values
            //console.log([
            //  ...content,
            //  {
            //    label: "Новое поле",
            //    fieldName: currentPath,
            //    display: true,
            //  }
            //])
            if (addItemMode) {
              setContent((prevContent) => {
                return [
                  ...prevContent,
                  {
                    label: EnRuKeys[key as keyof typeof EnRuKeys ] || key,//"Новое поле",
                    fieldName: currentPath,
                    display: true,
                  },
                ];
              });
            }
            setAddItemMode(false);
          }
        };

        return (
          <div
            key={currentPath}
            ref={(el) => {
              if (el) {
                onMatchPath(key, currentPath, el); // Pass `key`, `currentPath`, and `el`
              }
            }}
            className={`mb-0.5 text-xs ${currentPath} ${
              !hasNestedValues && !isContentField
                ? "cursor-pointer hover:text-black dark:hover:text-white"
                : ""
            } text-gray-500`}
            onClick={
              !hasNestedValues && !isContentField ? handleClick : undefined
            } // Conditionally apply onClick
          >
            <span className="font-semibold">{key}:</span>
            {hasNestedValues ? (
              <div className="ml-4 text-xs">
                {renderData(value, currentPath)}
              </div>
            ) : (
              <span>{String(value)}</span>
            )}
          </div>
        );
      });
    },
    [onMatchPath, contentFieldNames],
  );

  return (
    <div
      className={`border ${addItemMode ? "border-red-500" : "border-gray-500/30"} p-2 px-4`}
    >
      {renderData(data, "")}
    </div>
  );
};
