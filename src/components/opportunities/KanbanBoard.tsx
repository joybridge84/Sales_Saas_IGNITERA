'use client';

import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { KanbanColumn } from './KanbanColumn';
import { KanbanItem } from './KanbanItem';
import { Stage } from '@prisma/client';
import { updateOpportunityStage } from '@/actions/opportunity';

interface Opportunity {
  id: string;
  title: string;
  stage: Stage;
  amount: number | null;
  probability: number;
  account: { displayName: string };
}

interface KanbanBoardProps {
  initialOpportunities: any[];
}

const STAGES: Stage[] = [
  'PROSPECTING',
  'DISCOVERY',
  'QUALIFIED',
  'PROPOSAL',
  'QUOTE_SENT',
  'NEGOTIATION',
  'WON',
  'LOST',
];

export function KanbanBoard({ initialOpportunities }: KanbanBoardProps) {
  const [opportunities, setOpportunities] = useState(initialOpportunities);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeOpp = opportunities.find((o) => o.id === active.id);
    const overId = over.id as string;

    // Determine the target stage
    let newStage: Stage | null = null;
    if (STAGES.includes(overId as Stage)) {
      newStage = overId as Stage;
    } else {
        const overOpp = opportunities.find(o => o.id === overId);
        if (overOpp) newStage = overOpp.stage;
    }

    if (activeOpp && newStage && activeOpp.stage !== newStage) {
      setOpportunities((prev) =>
        prev.map((o) => (o.id === active.id ? { ...o, stage: newStage! } : o))
      );
      await updateOpportunityStage(active.id as string, newStage);
    }

    setActiveId(null);
  };

  const activeOpp = activeId ? opportunities.find((o) => o.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto h-full pb-10 px-8">
        {STAGES.map((stage) => (
          <KanbanColumn
            key={stage}
            id={stage}
            title={stage}
            count={opportunities.filter((o) => o.stage === stage).length}
          >
            <SortableContext
              items={opportunities.filter((o) => o.stage === stage).map((o) => o.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {opportunities
                  .filter((o) => o.stage === stage)
                  .map((opp) => (
                    <KanbanItem key={opp.id} opp={opp} />
                  ))}
              </div>
            </SortableContext>
          </KanbanColumn>
        ))}
      </div>

      <DragOverlay>
        {activeOpp ? <KanbanItem opp={activeOpp} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
