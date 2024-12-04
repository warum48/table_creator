'use client'
import Image from "next/image";
import { JSONViewer } from "./components/__atoms/JSONViewer/JSONViewr";
import { TableEditor } from "./components/Tables/TableEditor/TableEditor";
import { TableView } from "./components/Tables/TableView/TableView_v4";
import { TAction, TContent } from "./components/Tables/TableView/types";
import React from "react";
import { content } from "./components/Tables/content";

import data from "./example_jsons/data1.json" 

export default function Home() {
//  const { data, error, isLoading } = useGetOrdersQuery();

  const [actionsMenu, setActionsMenu] = React.useState<TAction[]>([]);
  const [_content, setContent] = React.useState<TContent[]>(content);
  
  const [rerender, setRerender] = React.useState(0);

  React.useEffect(() => {
    setRerender(rerender + 1);
  }, [_content]);

  function restoreInitTable() {
    setContent(content);
    setRerender(rerender + 1);
  }

  const actions: TAction[] = [
    // table may have actions, look for mantine documentation
  ];
  return (
    <div className="form-bg-and-text mr-2 space-y-8 overflow-auto rounded p-8">
    <TableView
     // header="Список заявок"
     // addButton={{
     //   text: "Добавить заявку",
     //   link: "/dashboard/requests/createnew",
     // }}
      content={_content}
      data={data}
      loading={false}//{isLoading}
      error={null}//{error}
     // actionsMenu={actions}
    />

    {data && (
      <TableEditor
        content={_content}
        exampleItem={data?.[data?.length - 1]}
        setContent={setContent}
        key={"editor" + rerender}
        reset={restoreInitTable}
      />
    )}
    <JSONViewer data={_content} />
  </div>
  );
}
