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
//import { TAction, TProps } from "./types";



interface TAction {
  text: string;
  link?: string;
  linkParam?: string;
  function?: (param: any) => void;
  param?: string;
  confirmationRequired?: boolean;
}

interface TContent {
  label: string;
  fieldName: string;
  filter?: boolean;
  formatter?: (value: any) => string;
}

interface TProps {
  header?: string;
  addButton?: { text: string; link: string };
  content: TContent[];
  data: any[];
  loading: boolean;
  error?: any;
  actionsMenu?: TAction[];
}

export const TableView = ({
  header,
  addButton,
  content,
  data,
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
      router.push(action.link || '/');
    }
  };

  const handleConfirm = () => {
    if (selectedAction && selectedAction.function) {
      selectedAction.function(row[selectedAction.param || 'id'] || '0');
    }
    setShowConfirmator(false);
  };

  const initialFilterState = React.useMemo(() => {
    return content.reduce((acc: any, item: TContent) => {
      if (item.filter) acc[item.fieldName] = ''; // Empty string for each filter field
      return acc;
    }, {} as Record<string, string>);
  }, [content]);

  const [internalFilterState, setInternalFilterState] = React.useState(initialFilterState);

  const filterOptions = React.useMemo(() => {
    if (!data) return {};

    return content.reduce((acc: any, item: TContent) => {
      if (item.filter) {
        const uniqueValues = TableUtils.getUniqueValues(data, item.fieldName)
          .filter((value) => value)
          .map((value) => ({
            value,
            label: value || 'Не указано',
          }));
        acc[item.fieldName] = uniqueValues;
      }
      return acc;
    }, {} as Record<string, { value: string; label: string }[]>);
  }, [data, content]);

  const filteredData = React.useMemo(() => {
    return data?.filter((row) => {
      return Object.entries(internalFilterState).every(([key, value]) => {
        if (!value) return true;
        return key.split('.').reduce((o, i) => o?.[i], row) === value;
      });
    });
  }, [data, internalFilterState]);

  const resetFilters = () => {
    setInternalFilterState(initialFilterState);
  };

  const numberOfAppliedFilters = React.useMemo(() => {
    return Object.values(internalFilterState).filter((value) => value !== '').length;
  }, [internalFilterState]);

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

      {content.some((item) => item.filter) && (
        <FiltersContainer resetFilters={resetFilters}>
          {content.map(
            (item, index) =>
              item.filter && (
                <ErrorBoundary FallbackComponent={ErrorFallback} key={index}>
                  <FilterItemContainer>
                    <Select
                      key={internalFilterState[item.fieldName]}
                      data={filterOptions[item.fieldName] || []}
                      placeholder="Все"
                      label={item.label}
                      labelProps={{ style: { fontWeight: 'bold' } }}
                      value={internalFilterState[item.fieldName]}
                      onChange={(value) =>
                        setInternalFilterState((prev:any) => ({
                          ...prev,
                          [item.fieldName]: value,
                        }))
                      }
                    />
                  </FilterItemContainer>
                </ErrorBoundary>
              ),
          )}
        </FiltersContainer>
      )}

      <div className="w-full overflow-x-auto">
        <Table className="mt-4 min-w-full overflow-hidden">
          <Table.Thead>
            <Table.Tr className="rounded-t-lg bg-purple-400/10 dark:bg-purple-900/15">
              {actionsMenu && (
                <Table.Th className="px-4 py-2">...</Table.Th>
              )}
              {content.map((item, index) => (
                <Table.Th className="px-4 py-2" key={index}>
                  {item.label}
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredData?.map((row, rowIndex) => (
              <Table.Tr key={rowIndex} className="cursor-pointer">
                {actionsMenu && (
                  <Table.Td>
                    <Menu>
                      <Menu.Target>
                        <ActionIcon>
                          <IconDotsVertical size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        {actionsMenu.map((action, index) => (
                          <Menu.Item
                            key={index}
                            onClick={
                              action.function
                                ? () => handleMenuItemClick(action, row)
                                : () => {
                                    toggle();
                                    router.push(
                                      action.link +
                                        (action.linkParam
                                          ? row[action.linkParam]
                                          : ''),
                                    );
                                  }
                            }
                          >
                            {action.text}
                          </Menu.Item>
                        ))}
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                )}
                {content.map((item, index) => (
                  <Table.Td className="px-4 py-2" key={index}>
                    <Value
                      value={
                        item.formatter
                          ? item.formatter(TableUtils.getComplexNestedValue(row, item.fieldName))
                          : TableUtils.getComplexNestedValue(row, item.fieldName)
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
          filteredData.length === 0 && (
            <div className="my-4 text-xs">
              Данных, удовлетворяющих все выбранные фильтры ({numberOfAppliedFilters}), нет
            </div>
          )}
        
        <Debugger>
          <JSONViewer data={data} />
        </Debugger>
        {loading && <Preloader />}
        {error && <BasicError error={error} className="mt-4" />}
      </div>

      <Confirmator
        onConfirm={handleConfirm}
        header={'Вы действительно хотите удалить эту запись?'}
        showConfirmator={showConfirmator}
        setShowConfirmator={setShowConfirmator}
        closeOnConfirm
      />
    </>
  );
};
