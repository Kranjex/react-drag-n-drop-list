import { useState, useRef } from "react";
import styles from "../style/DragElement.module.css";

type DataType = {
  title: string;
  items: string[];
};

type DragParams = {
  groupIndex: number;
  itemIndex: number;
};

const data: DataType[] = [
  { title: "Group 1", items: ["Item 1", "Item 2", "Item 3"] },
  { title: "Group 2", items: ["Item 4", "Item 5"] },
];

export default function DragElement() {
  const [list, setList] = useState(data);
  const [dragging, setDragging] = useState(false);

  const dragItem = useRef(null);
  const dragElement = useRef(null);

  const handleDragStart = (e: DragEvent, params: DragParams) => {
    dragItem.current = params;
    dragElement.current = e.target;
    dragElement.current.addEventListener("dragend", handleDragEnd);

    setTimeout(() => {
      setDragging(true);
    }, 0);
  };

  const handleDragEnter = (e: DragEvent, params: DragParams) => {
    const currentItem = dragItem.current;

    if (e.target !== dragElement.current) {
      setList((prev) => {
        // let newList = [...prev];
        let newList = JSON.parse(JSON.stringify(prev));
        newList[params.groupIndex].items.splice(
          params.itemIndex,
          0,
          newList[currentItem?.groupIndex].items.splice(
            currentItem?.itemIndex,
            1
          )[0]
        );
        dragItem.current = params;
        return newList;
      });
    }
  };

  const handleDragEnd = () => {
    setDragging(false);
    dragElement.current?.removeEventListener("dragend", handleDragEnd);
    dragItem.current = null;
    dragElement.current = null;
  };

  const getStyles = ({ groupIndex, itemIndex }: DragParams) => {
    const currentItem = dragItem.current;

    if (!currentItem) return styles.item;

    if (
      currentItem.groupIndex === groupIndex &&
      currentItem.itemIndex === itemIndex
    )
      return `${styles.current} ${styles.item}`;

    return styles.item;
  };

  return (
    <div className={styles["dnd-container"]}>
      {list.map((group, groupIndex) => (
        <div
          className={styles.group}
          key={group.title}
          onDragEnter={
            dragging && !group.items.length
              ? (e) => handleDragEnter(e, { groupIndex, itemIndex: 0 })
              : () => {}
          }
        >
          <div className={styles["group-title"]}>{group.title}</div>
          {group.items.map((item, itemIndex) => (
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, { groupIndex, itemIndex })}
              onDragEnter={
                dragging
                  ? (e) => handleDragEnter(e, { groupIndex, itemIndex })
                  : () => {}
              }
              className={
                dragging ? getStyles({ groupIndex, itemIndex }) : styles.item
              }
              key={item}
            >
              {item}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
