
import React from 'react';
import { TablePagination, Pagination } from '@mui/material';

const CollapsiblePagination = ({ pages, page, collapsed, onChange, nolabel }) => {
  const props = nolabel ? {
    labelDisplayedRows: () => ''
  } : {}; //    labelDisplayedRows={() => ''}
  if (collapsed) {
    return (
      <TablePagination
        {...props}
        classes={{
          toolbar: 'table-pagination-toolbar',
          root: 'table-pagination-root',
          actions: 'table-pagination-actions'
        }}
        sx={{
          '&.MuiTableCell-root': {
            p: 0
          },
          '& .MuiTablePagination-actions': {
            ml: 0,
            border: 1,
            borderColor: 'red'
          },
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
