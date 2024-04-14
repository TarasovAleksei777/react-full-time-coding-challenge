import React, { FC, useState } from "react";
import uuid from "react-uuid";
import { Button, Checkbox, Input, Modal, notification, Popconfirm } from "antd";
import { DeleteTwoTone, PlusOutlined } from "@ant-design/icons";
import { Task } from "@/index";
import { TaskWrapper } from "@/components/TaskWrapper";

interface TodoItemProps {
  id: string;
  name: string;
  done: boolean;
}

export const TodoList: FC<Task> = (task) => {
  const initialItems: TodoItemProps[] = [
    {
      id: uuid(),
      name: "Fix code",
      done: false,
    },
    {
      id: uuid(),
      name: "Implement delete",
      done: false,
    },
    {
      id: uuid(),
      name: "Implement add",
      done: false,
    },
  ];

  const [newItem, setNewItem] = useState<string | null>(null);
  const [todoItems, setTodoItems] = useState<TodoItemProps[]>(initialItems);

  const handleAdd = (name: string) => {
    if (!name.trim()) {
      notification.error({ message: "Please enter a valid item name" });
      return;
    }
    setTodoItems([...todoItems, { id: uuid(), name, done: false }]);
    setNewItem(null);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Confirm Deletion",
      content: "Are you sure you want to delete this item?",
      onOk: () => {
        setTodoItems(todoItems.filter((item) => item.id !== id));
      },
    });
  };

  const toggleDone = (id: string) => {
    setTodoItems(
      todoItems.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item,
      ),
    );
  };

  const TodoItem: FC<TodoItemProps> = ({ done, name, id }) => (
    <div className="w-full rounded overflow-hidden bg-white shadow-lg flex justify-between p-4">
      {name}
      <div className="flex justify-content items-center space-x-4">
        <Checkbox checked={done} onChange={() => toggleDone(id)} />
        <Popconfirm
          title="Are you sure delete this item?"
          onConfirm={() => handleDelete(id)}
          okText="Yes"
          cancelText="No"
        >
          <DeleteTwoTone className="cursor-pointer" twoToneColor="red" />
        </Popconfirm>
      </div>
    </div>
  );

  return (
    <TaskWrapper task={task}>
      <div className="w-full">
        <div className="space-y-2">
          {todoItems.map((props) => (
            <TodoItem key={props.id} {...props} />
          ))}
        </div>
        <Button
          block
          onClick={() => setNewItem("")}
          icon={<PlusOutlined />}
          type="dashed"
          className="mt-4"
        >
          Add item
        </Button>
        <ToDoItemInput
          open={newItem !== null}
          onCreate={handleAdd}
          onCancel={() => setNewItem(null)}
        />
      </div>
    </TaskWrapper>
  );
};

const ToDoItemInput: FC<{
  open: boolean;
  onCreate: (name: string) => void;
  onCancel: () => void;
}> = ({ open, onCreate, onCancel }) => {
  const [itemName, setItemName] = useState("");

  const handleCreate = () => {
    onCreate(itemName);
    setItemName("");
  };

  return (
    <Modal
      title="New Item"
      open={open}
      onCancel={() => {
        setItemName("");
        onCancel();
      }}
      onOk={handleCreate}
    >
      <Input value={itemName} onChange={(e) => setItemName(e.target.value)} />
    </Modal>
  );
};
