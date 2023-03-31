// import React from 'react';
import { styled, Box } from "@mui/material";

const Flex = styled(Box)(({ theme, center, wrap = "nowrap", between, bold = false, spacing = 0 }) => ({
  gap: theme.spacing(spacing),
  cursor: "default",
  display: "flex",
  fontWeight: bold ? 600 : 400,
  alignItems: "center",
  justifyContent: center ? "center" : between ? "space-between" : "flex-start",
  whiteSpace: wrap,
  flexWrap: wrap
}));

export default Flex;
