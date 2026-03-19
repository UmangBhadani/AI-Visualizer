import { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from './CustomNode';
import { getLayoutedElements } from '../utils/layout';

const nodeTypes = { custom: CustomNode };

export default function DiagramViewer({ diagram }) {
  const { nodes, edges } = useMemo(() => {
    const rawNodes = diagram.nodes.map((n) => ({
      id: n.id,
      type: 'custom',
      position: { x: 0, y: 0 },
      data: { label: n.label, description: n.description },
    }));

    const rawEdges = diagram.edges.map((e, i) => ({
      id: `edge-${i}`,
      source: e.source,
      target: e.target,
      label: e.label,
      animated: true,
      style: { stroke: '#6366f1', strokeWidth: 2 },
      labelStyle: { fill: '#c4b5fd', fontSize: 11, fontWeight: 500 },
      labelBgStyle: { fill: '#1e1b4b', fillOpacity: 0.85 },
      labelBgPadding: [6, 4],
      labelBgBorderRadius: 4,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#6366f1',
      },
    }));

    return getLayoutedElements(rawNodes, rawEdges);
  }, [diagram]);

  return (
    <div className="diagram-container">
      <h2 className="diagram-title">{diagram.title}</h2>
      <div className="diagram-flow">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          proOptions={{ hideAttribution: true }}
          minZoom={0.3}
          maxZoom={1.5}
        >
          <Background color="#312e81" gap={20} size={1} />
          <Controls
            showInteractive={false}
            style={{ background: '#1e1b4b', borderColor: '#4338ca' }}
          />
        </ReactFlow>
      </div>
    </div>
  );
}
