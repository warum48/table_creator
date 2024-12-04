import React from "react";
import { ActionIcon, Menu, Select, Table } from "@mantine/core";
import { Button } from "@mantine/core";
import { useRouter } from "next/navigation";
import { IconDotsVertical } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { JSONViewer } from "@/components/__atoms/JSONViewer/JSONViewr";
import { Debugger } from "@/components/__atoms/Debugger/Debugger";
import Link from "next/link";
import { BasicError } from "@/components/Errors/BasicError";
import { customLabelStyle } from "@/styles/mantine_styles";
import { FilterItemContainer } from "@/components/__atoms/Tables/Filters/FilterItemContainer";
import { FiltersContainer } from "@/components/__atoms/Tables/Filters/FiltersContainer";
import { Preloader } from "@/components/__atoms/Preloader/Preloader";
import ErrorBoundary from "@/components/__atoms/Suspense/ErrorBoundary";
import ErrorFallback from "@/components/__atoms/Suspense/ErrorFallback";
import { Confirmator } from "@/components/__uiutils/Confirmator";
import Value from "@/components/__atoms/Value/Value";
import { TableUtils } from "@/utils/TableUtils";
import { TAction, TProps } from "./types";


export const TableView = ({
    filters = [
      
    ],
    header,
    addButton,
    data,
    ths,
    tds,
    loading,
    error,
    actionsMenu,
  }: TProps) => {
    const router = useRouter();
    const [opened, { toggle }] = useDisclosure(false);
    const [showConfirmator, setShowConfirmator] = React.useState<boolean>(false);
    const [selectedAction, setSelectedAction] = React.useState<TAction | null>(null);
    const [row, setRow] = React.useState<any>(null);

    const handleMenuItemClick = (action: TAction, row: any) => {
        if (action.function) {
          setSelectedAction(action); 
          setShowConfirmator(true); 
          setRow(row);
        } else {
          router.push(action.link || "/");
        }
      };

      const handleConfirm = () => {
        if (selectedAction && selectedAction.function) {
          selectedAction.function(row[selectedAction.param || "id"] || `0`);
        }
        setShowConfirmator(false); 
      };
  
    // Initialize filterState dynamically based on filters array
    const initialFilterState = React.useMemo(() => {
      return filters.reduce((acc: any, filter: any) => {
        acc[filter.fieldName] = ""; // Empty string for each filter field
        return acc;
      }, {} as Record<string, string>);
    }, [filters]);
  
    // Use initialFilterState as the default for filterState if not provided
    const [internalFilterState, setInternalFilterState] = React.useState(initialFilterState);
    
    const currentFilterState = internalFilterState; //filterState || 
    const currentSetFilterState = setInternalFilterState; //setFilterState || 
  
    // Generate filter options based on the data and filters provided
    const filterOptions = React.useMemo(() => {
      if (!data) return {};
  
      return filters.reduce((acc:any, filter: any) => {
        const uniqueValues = TableUtils.getUniqueValues(data, filter.fieldName)
          .filter((value) => value)
          .map((value) => ({
            value,
            label: value || "Не указано",
          }));
        acc[filter.fieldName] = uniqueValues;
        return acc;
      }, {} as Record<string, { value: string; label: string }[]>);
    }, [data, filters]);
  
    const filteredData = React.useMemo(() => {
      return data?.filter((row) => {
        return Object.entries(currentFilterState).every(([key, value]) => {
          if (!value) return true;
          return key.split(".").reduce((o, i) => o?.[i], row) === value;
        });
      });
    }, [data, currentFilterState]);
  
    const resetFilters = () => {
      currentSetFilterState(initialFilterState);
    };

    const numberOfAppliedFilters = React.useMemo(() => {
        return Object.keys(initialFilterState).reduce((acc, key) => {
            initialFilterState[key] != "" ? acc++ : acc;
          return acc;
        }, 0);
      }, [data, initialFilterState]);
  
    return (
      <>
        <div className="flex items-center justify-between gap-4">
          {header && <div className="form-header">{header}</div>}
          {addButton && (
            <Link href={addButton.link}>
              <Button className="button-secondary">{addButton.text}</Button>
            </Link>
          )}
        </div>
  
        {filters && filters.length > 0 && (
          <FiltersContainer resetFilters={resetFilters}>
            {filters.map((filter:any, index:any) => (
              <ErrorBoundary FallbackComponent={ErrorFallback} key={index}>
                <FilterItemContainer>
                  <Select
                    key={internalFilterState[filter.fieldName]}
                    data={filterOptions[filter.fieldName] || []}
                    placeholder="Все"
                    label={filter.label}
                    labelProps={{ style: customLabelStyle }}
                    value={currentFilterState[filter.fieldName]}
                    onChange={(value) =>
                      currentSetFilterState((prev: any) => ({
                        ...prev,
                        [filter.fieldName]: value,
                      }))
                    }
                  />
                </FilterItemContainer>
              </ErrorBoundary>
            ))}
          </FiltersContainer>
        )}
  
        <div className="w-full overflow-x-auto">
        <Table className="mt-4 min-w-full overflow-hidden">
          <Table.Thead>
            <Table.Tr className="rounded-t-lg bg-purple-400/10 dark:bg-purple-900/15">
              {actionsMenu && actionsMenu.length > 0 && (
                <Table.Th className="px-4 py-2">...</Table.Th>
              )}
              {ths.map((th, index) => (
                <Table.Th className="px-4 py-2" key={index}>
                  {th}
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredData?.map((row, rowIndex) => (
              <Table.Tr key={rowIndex} className="cursor-pointer">
                {actionsMenu && actionsMenu.length > 0 && (
                  <Table.Td>
                    <Menu>
                      <Menu.Target>
                        <ActionIcon>
                          <IconDotsVertical size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        {actionsMenu.map((action, index) => (
                          <>
                            <Menu.Item
                              onClick={
                                action.function != undefined
                                  ? () => {
                                      if (action.function != undefined) {
                                        handleMenuItemClick(action, row);
                                      }
                                    }
                                  : () => {
                                      toggle();
                                      router.push(
                                        action.link +
                                          (action.linkParam
                                            ? row[action.linkParam]
                                            : ""),
                                      );
                                    }
                              }
                            >
                              {action.text} {row?.id}
                            </Menu.Item>
                          </>
                        ))}
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                )}
                {tds.map((td, index) => (
                  <Table.Td className="px-4 py-2" key={index}>
                    <Value
                      value={
                        typeof td === "string"
                          ? TableUtils.getComplexNestedValue(row, td)
                          : TableUtils.getComplexNestedValue(row, td.value) &&
                            td.formatter(
                              TableUtils.getComplexNestedValue(row, td.value),
                            )
                      }
                    />
                  </Table.Td>
                ))}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        {numberOfAppliedFilters > 1 &&
          filteredData &&
          filteredData.length == 0 && (
            <div className="my-4 text-xs">
              Данных, удовлетворяющих все выбранные фильтры (
              {numberOfAppliedFilters}), нет
            </div>
          )}
        {loading && <Preloader />}
        <Debugger>
          <JSONViewer data={data} />
        </Debugger>
        {error && <BasicError error={error} className="mt-4" />}

        </div>

        <Confirmator
        onConfirm={handleConfirm}
        header={"Вы действительно хотите удалить эту запись'?"}
        showConfirmator={showConfirmator}
        setShowConfirmator={setShowConfirmator}
        closeOnConfirm={true}
      />

        {error && <BasicError error={error} className="mt-4" />}
      </>
    );
  };
  