import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';

export default function CustomNode({ data }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: data.animationDelay || 0,
        ease: [0.23, 1, 0.32, 1],
      }}
      className="custom-node"
    >
      <Handle type="target" position={Position.Left} className="node-handle" />
      <div className="node-label">{data.label}</div>
      {data.description && (
        <div className="node-description">{data.description}</div>
      )}
      <Handle type="source" position={Position.Right} className="node-handle" />
    </motion.div>
  );
}
