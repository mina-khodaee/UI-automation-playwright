'use client'

import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { AiOutlineDown, AiOutlineRight } from 'react-icons/ai';

const CustomTreeItem = ({ node, onSelect }) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = (e) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect(node);
  };

  return (
    <Box sx={{ ml: 2, mb: 0.5 }}>
      <Box
        onClick={handleClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1,
          borderRadius: 1,
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
          bgcolor: node.isSelected ? 'primary.lighter' : 'transparent',
          border: node.isSelected ? '1px solid' : 'none',
          borderColor: 'primary.main',
        }}
      >
        {node.children && node.children.length > 0 && (
          <IconButton 
            size="small" 
            onClick={handleToggle}
            sx={{ mr: 0.5 }}
          >
            {expanded ? <AiOutlineDown /> : <AiOutlineRight />}
          </IconButton>
        )}
        <Typography sx={{ flex: 1 }}>{node.label}</Typography>
      </Box>

      {expanded && node.children && node.children.length > 0 && (
        <Box sx={{ ml: 3 }}>
          {node.children.map((child) => (
            <CustomTreeItem
              key={child.id}
              node={child}
              onSelect={onSelect}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CustomTreeItem;