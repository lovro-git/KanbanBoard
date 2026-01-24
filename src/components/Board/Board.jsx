import { useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useBoard } from '../../context/BoardContext';
import { Column } from '../Column/Column';
import { TaskCard } from '../TaskCard/TaskCard';
import styles from './Board.module.css';

export function Board({ onEditTask, onTaskCreated }) {
  const { state, moveTask } = useBoard();
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const activeTask = useMemo(() => {
    if (!activeId) return null;
    return state.tasks[activeId] || null;
  }, [activeId, state.tasks]);

  const findColumnForTask = (taskId) => {
    return Object.keys(state.columns).find((columnId) =>
      state.columns[columnId].taskIds.includes(taskId)
    );
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeColumn = findColumnForTask(activeId);
    let overColumn = findColumnForTask(overId);

    // If over is a column (not a task), use it directly
    if (!overColumn && state.columns[overId]) {
      overColumn = overId;
    }

    if (!activeColumn || !overColumn || activeColumn === overColumn) {
      return;
    }

    // Move task to new column during drag
    const activeIndex = state.columns[activeColumn].taskIds.indexOf(activeId);
    const overIndex = state.columns[overColumn].taskIds.includes(overId)
      ? state.columns[overColumn].taskIds.indexOf(overId)
      : state.columns[overColumn].taskIds.length;

    moveTask(activeId, activeColumn, overColumn, activeIndex, overIndex);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeColumn = findColumnForTask(activeId);
    let overColumn = findColumnForTask(overId);

    // If over is a column (not a task), use it directly
    if (!overColumn && state.columns[overId]) {
      overColumn = overId;
    }

    if (!activeColumn || !overColumn) return;

    const activeIndex = state.columns[activeColumn].taskIds.indexOf(activeId);
    let overIndex;

    if (state.columns[overColumn].taskIds.includes(overId)) {
      overIndex = state.columns[overColumn].taskIds.indexOf(overId);
    } else {
      // Dropped on column itself
      overIndex = state.columns[overColumn].taskIds.length;
    }

    if (activeColumn === overColumn && activeIndex !== overIndex) {
      moveTask(activeId, activeColumn, overColumn, activeIndex, overIndex);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.board}>
        {state.columnOrder.map((columnId, index) => (
          <Column
            key={columnId}
            column={state.columns[columnId]}
            tasks={state.columns[columnId].taskIds.map((id) => state.tasks[id]).filter(Boolean)}
            onEditTask={onEditTask}
            onTaskCreated={onTaskCreated}
            index={index}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <TaskCard
            task={activeTask}
            isDragging
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
