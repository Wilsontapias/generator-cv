"use client";

import React, { useState } from "react";
import { moveItemUp, moveItemDown } from "@/utils/reorder";

interface ReorderableListProps<T> {
  items: T[];
  onReorder: (items: T[]) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

export function ReorderableList<T>({
  items,
  onReorder,
  renderItem,
  keyExtractor,
}: ReorderableListProps<T>) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const resetDrag = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };
  const handleDragStart = (i: number) => setDraggedIndex(i);
  const handleDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    setDragOverIndex(i);
  };
  const handleDrop = (i: number) => {
    if (draggedIndex === null || draggedIndex === i) {
      resetDrag();
      return;
    }
    onReorder(moveItem(items, draggedIndex, i));
    resetDrag();
  };
  const handleDragEnd = () => resetDrag();
  const handleMoveUp = (i: number) => onReorder(moveItemUp(items, i));
  const handleMoveDown = (i: number) => onReorder(moveItemDown(items, i));

  return (
    <ReorderableListContent
      items={items}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      draggedIndex={draggedIndex}
      dragOverIndex={dragOverIndex}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
      onMoveUp={handleMoveUp}
      onMoveDown={handleMoveDown}
    />
  );
}

function ReorderableListContent<T>({
  items,
  keyExtractor,
  renderItem,
  draggedIndex,
  dragOverIndex,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onMoveUp,
  onMoveDown,
}: {
  items: T[];
  keyExtractor: (item: T) => string;
  renderItem: (item: T, index: number) => React.ReactNode;
  draggedIndex: number | null;
  dragOverIndex: number | null;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (index: number) => void;
  onDragEnd: () => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}) {
  return (
    <div className="reorderable-list">
      {items.map((item, index) => (
        <ReorderableItem
          key={keyExtractor(item)}
          item={item}
          index={index}
          items={items}
          draggedIndex={draggedIndex}
          dragOverIndex={dragOverIndex}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onDragEnd={onDragEnd}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          renderItem={renderItem}
        />
      ))}
    </div>
  );
}

function ReorderableItem<T>({
  item,
  index,
  items,
  draggedIndex,
  dragOverIndex,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onMoveUp,
  onMoveDown,
  renderItem,
}: {
  item: T;
  index: number;
  items: T[];
  draggedIndex: number | null;
  dragOverIndex: number | null;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (index: number) => void;
  onDragEnd: () => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
}) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={() => onDrop(index)}
      onDragEnd={onDragEnd}
      className={`reorderable-item ${draggedIndex === index ? "dragging" : ""} ${dragOverIndex === index ? "drag-over" : ""}`}
    >
      <div className="reorderable-handle" aria-hidden="true">
        ⋮⋮
      </div>
      <div className="reorderable-content">{renderItem(item, index)}</div>
      <ReorderButtons
        index={index}
        total={items.length}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
      />
    </div>
  );
}

function ReorderButtons({
  index,
  total,
  onMoveUp,
  onMoveDown,
}: {
  index: number;
  total: number;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}) {
  return (
    <div className="reorderable-actions">
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={() => onMoveUp(index)}
        disabled={index === 0}
        aria-label="Mover arriba"
      >
        ↑
      </button>
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={() => onMoveDown(index)}
        disabled={index === total - 1}
        aria-label="Mover abajo"
      >
        ↓
      </button>
    </div>
  );
}

function moveItem<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  const result = [...items];
  const [removed] = result.splice(fromIndex, 1);
  if (removed !== undefined) {
    result.splice(toIndex, 0, removed);
  }
  return result;
}
