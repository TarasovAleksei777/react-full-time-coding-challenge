import React, { FC, useState } from "react";
import { Button } from "antd";
import { TaskWrapper } from "@/components/TaskWrapper";
import { Task } from "@/index";

const MAGIC_NUMBER = 1;

/**
 * In this task you have to fix the state handling of the component.
 * The expected behavior is that the buttons increment and decrement the counter by the constant `MAGIC_NUMBER` twice using
 * two separate `setCounter` states.
 *
 * Write down all steps as comments that lead to your final solution including the problems with the original version.
 */
export const CursedCounter: FC<Task> = (task) => {
  const [counter, setCounter] = useState<number>(0);
  /**The changes made to the incr and decr functions
     use a functional state update using the previous value
     of the prevCounter counter to ensure that the counter is correctly
     incremented and decremented by the MAGIC_NUMBER value twice.//*

     /** `incr` must increment the counter by the constant `MAGIC_NUMBER` **twice** using two separate setCounter calls
     */
  const incr = () => {
    setCounter((prevCounter) => prevCounter + MAGIC_NUMBER); // Use functional update to ensure correct value is used
    setCounter((prevCounter) => prevCounter + MAGIC_NUMBER); // Use functional update to ensure correct value is used
  };

  /**
   * `decr` must decrement the counter by the constant `MAGIC_NUMBER` **twice** using two separate setCounter calls
   */
  const decr = () => {
    setCounter((prevCounter) => prevCounter - MAGIC_NUMBER); // Use functional update to ensure correct value is used
    setCounter((prevCounter) => prevCounter - MAGIC_NUMBER); // Use functional update to ensure correct value is used
  };

  return (
    <TaskWrapper task={task}>
      <div className={"space-x-1"}>
        <Button onClick={decr}>-{MAGIC_NUMBER * 2}</Button>
        <Button onClick={incr}>+{MAGIC_NUMBER * 2}</Button>
      </div>
      <div className={"font-bold"}>Counter: {counter}</div>
    </TaskWrapper>
  );
};
