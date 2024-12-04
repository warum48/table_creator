import { useState } from "react";
import { TContent } from "../TableView/types";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { IconEdit, IconX } from "@tabler/icons-react";
import { Button, Divider } from "@mantine/core";
import React from "react";

export const SortableList: React.FC<{
    onMatchItemRef: (fieldName: string, el: HTMLElement) => void;
    content: TContent[];
    setContent: React.Dispatch<React.SetStateAction<TContent[]>>;
    onSortEnd: () => void;
    onDeleteItem?: () => void;
}> = ({ onMatchItemRef, content, setContent, onSortEnd, onDeleteItem = () => {console.log('DELTE ITEM undefined')} }) => {
    const [items, setItems] = useState(content);
    const [editIndex, setEditIndex] = useState<number | null>(null);

    const onDragEnd = (result: any) => {
        const { source, destination } = result;
        if (!destination) return;

        const updatedItems = Array.from(items);
        const [movedItem] = updatedItems.splice(source.index, 1);
        updatedItems.splice(destination.index, 0, movedItem);

        setItems(updatedItems);
        onSortEnd();
    };

    const handleCheckboxChange = (index: number) => {
        const updatedItems = items.map((item, i) =>
            i === index ? { ...item, display: !item.display } : item
        );
        setItems(updatedItems);
    };

    const toggleEditBlock = (index: number) => {
        setEditIndex(editIndex === index ? null : index);
    };

    const handleBooleanChange = (index: number, key: keyof TContent) => {
        const updatedItems = items.map((item, i) =>
            i === index ? { ...item, [key]: !item[key] } : item
        );
        setItems(updatedItems);
    };

    const handleLabelChange = (index: number, newLabel: string) => {
        const updatedItems = items.map((item, i) =>
            i === index ? { ...item, label: newLabel } : item
        );
        setItems(updatedItems);
    };

    const deleteItem = (index: number) => {
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
        setEditIndex(null);
       // onDeleteItem();
      //  setContent(items);
    };

    const copyToClipboard = () => {
        const jsonOutput = JSON.stringify(items, null, 2);
        navigator.clipboard.writeText(jsonOutput);
        alert("Copied JSON to clipboard!");
    };

    React.useEffect(() => {       
        console.log('items', items);
        setContent(items); 

    }, [items]);

    return (
        <div>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="sortableList">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {items.map((item, index) => (
                                <Draggable
                                    key={item.fieldName}
                                    draggableId={item.fieldName}
                                    index={index}
                                >
                                    {(provided, snapshot) => (
                                        <div
                                            ref={(el) => {
                                                provided.innerRef(el);
                                                if (el) onMatchItemRef(item.fieldName, el);
                                            }}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`relative mb-1.5 mr-24 flex items-center rounded bg-gray-100 p-2 text-xs shadow dark:bg-gray-700 ${
                                                snapshot.isDragging ? "opacity-70" : "opacity-100"
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={item.display ?? false}
                                                onChange={() => handleCheckboxChange(index)}
                                                className="mr-2"
                                            />
                                            {item.label} ({item.fieldName})

                                            {/* Edit icon */}
                                            <IconEdit
                                                className="ml-auto cursor-pointer text-gray-500 hover:text-gray-700 mr-4"
                                                size={20}
                                                onClick={() => toggleEditBlock(index)}
                                            />

                                            {/* Edit block */}
                                            {editIndex === index && (
                                                <div className="absolute right-0 top-4 z-10 mt-1 w-48 rounded bg-white p-4 shadow-lg dark:bg-gray-800">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-xs font-bold">Edit Options</span>
                                                        <IconX
                                                            className="cursor-pointer text-gray-500 hover:text-gray-700"
                                                            size={14}
                                                            onClick={() => setEditIndex(null)}
                                                        />
                                                    </div>

                                                    {/* Label Edit Input */}
                                                    <div className="flex items-center mb-2">
                                                        <input
                                                            type="text"
                                                            value={item.label}
                                                            onChange={(e) =>
                                                                handleLabelChange(index, e.target.value)
                                                            }
                                                            className="border p-1 text-xs rounded w-full"
                                                        />
                                                    </div>

                                                    {/* Other Boolean Options */}
                                                    <div className="flex items-center mb-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={item.filter ?? false}
                                                            onChange={() => handleBooleanChange(index, "filter")}
                                                            className="mr-2"
                                                        />
                                                        <span className="text-xs">Filter</span>
                                                    </div>
                                                    <div className="flex items-center mb-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={item.sorter ?? false}
                                                            onChange={() => handleBooleanChange(index, "sorter")}
                                                            className="mr-2"
                                                        />
                                                        <span className="text-xs">Sorter</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={item.html ?? false}
                                                            onChange={() => handleBooleanChange(index, "html")}
                                                            className="mr-2"
                                                        />
                                                        <span className="text-xs">HTML</span>
                                                    </div>

                                                    <Divider className="text-xs text-gray-500 mt-2"  color='gray'/>

                                                    {/* Delete button */}
                                                    <button
                                                        onClick={() => deleteItem(index)}
                                                        className="mt-2 flex items-center text-red-600 hover:text-red-800 text-xs"
                                                    >
                                                        <IconX size={14} className="mr-1" />
                                                        Удалить
                                                    </button>
                                                    <div className="text-xs text-gray-500 mt-2">Не рекоммендуется, предпочтительнее скрывать чекбоксом чтобы иметь возможность быстро восстановить</div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            {/* JSON output section */}
            <div className="mr-24 mt-4 max-h-[300px] overflow-y-auto border-gray-500 border p-2 rounded bg-gray-50 dark:bg-gray-800">
                <pre className="text-xs">{JSON.stringify(items, null, 2)}</pre>
            </div>

            <div className="flex gap-2">
                {/* Copy button */}
                <button
                    onClick={copyToClipboard}
                    className="mt-2 rounded bg-neutral-700 px-2 py-1 text-white hover:bg-neutral-800 text-xs"
                >
                    Copy JSON
                </button>

                {/* 
                !!! automatized 
                Save button 
                <Button size="xs"
                    onClick={() => setContent(items)}
                   // className="mt-2 rounded bg-neutral-700 px-2 py-1 text-white hover:bg-neutral-800 text-xs"
                   className="mt-2"
                >
                    Применить
                </Button>*/}

            </div>
        </div>
    );
};
