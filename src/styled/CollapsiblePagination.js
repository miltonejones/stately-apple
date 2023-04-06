
import React from 'react';
import { TablePagination, Pagination } from '@mui/material';

const CollapsiblePagination = ({ pages, page, collapsed, onChange }) => {
  if (collapsed) {
    return (
      <TablePagination
        classes={{
          toolbar: 'table-pagination-toolbar',
          root: 'table-pagination-root'
        }}
        sx={{
          '&.MuiTableCell-root': {
            p: 0
          }
        }}
        count={Number(pages.itemCount)}
        page={page - 1}
        rowsPerPage={pages.pageSize}
        rowsPerPageOptions={[]}
        onPageChange={(a, num) => onChange(num + 1)}
      />
    );
  }
  return (
    <Pagination
      count={Number(pages.pageCount)}
      page={page}
      onChange={(a, num) => onChange(num)}
    />
  );
};

export default CollapsiblePagination;
