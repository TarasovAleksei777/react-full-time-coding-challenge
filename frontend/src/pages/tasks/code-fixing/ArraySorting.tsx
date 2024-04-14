import React, { FC, useEffect, useState } from "react";
import { Button } from "antd";
import { Task } from "@/index";
import { randomIntArrayInRange, shuffle } from "@/utils/array-utils";
import { TaskWrapper } from "@/components/TaskWrapper";

/**
 * In this task you have to fix the state handling and the array operations of the component.
 * The expected behavior is to display two arrays with the following invariants:
 *    The `someArray` is an array of length 10 which gets randomly generated on page load.
 *    The `sortedArray` contains the same elements as the `someArray` sorted ascending.
 *    The button `Shuffle Array` should randomize the order of the elements of the `someArray`. Why is this not working?
 *
 * There are multiple things that have to be fixed and that can be improved. Also think about the render efficiency of this component.
 *
 * Write down all steps as comments that lead to your final solution including the problems with the original version.
 */
export const ArraySorting: FC<Task> = (task) => {
  const [someArray, setSomeArray] = useState<number[]>([]);
  const [sortedArray, setSortedArray] = useState<number[]>([]);
  /**Changes:
    Two states are used: someArray to store the current array and sortedArray to store the sorted version of the array.
    In useEffect, someArray is sorted and sortedArray is updated when someArray is changed.
    The shuffle Array function creates a copy of someArray, and then shuffles the elements of this copy and sets a new array.**/

  const createNewRandomArray = () => {
    const shuffledArray = randomIntArrayInRange(12, 1000);
    setSomeArray(shuffledArray);
  };
  const shuffleArray = () => {
    const shuffledArray = shuffle([...someArray]);
    setSomeArray(shuffledArray);
  };

  useEffect(() => {
    createNewRandomArray();
  }, []);

  useEffect(() => {
    setSortedArray([...someArray].sort((a, b) => a - b)); // Sort the array in ascending order
  }, [someArray]);

  /**
   * shuffleArray randomizes the order of the elements in `someArray`.
   * Hint: The implementation of `shuffle` is working and must not be changed.
   */

  /** Editable Code END **/

  return (
    <TaskWrapper task={task}>
      <div className={"space-x-1"}>
        <Button onClick={createNewRandomArray}>New array</Button>
        <Button onClick={shuffleArray}>Shuffle array</Button>
      </div>
      <div className={"font-bold"}>
        <div>Current array: {someArray.join(", ")}</div>
        <div>Sorted array: {sortedArray.join(", ")}</div>
      </div>
    </TaskWrapper>
  );
};
