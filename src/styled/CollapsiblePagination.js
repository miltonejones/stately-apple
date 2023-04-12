/**
 * Renders a collapsible pagination component
 * @function
 * @param {Object} props - Component props
 * @param {number} props.pages - Total number of pages
 * @param {number} props.page - Current page
 * @param {boolean} props.collapsed - Whether the pagination is collapsed or not
 * @param {function} props.onChange - Function to be called when the page is changed
 * @param {boolean} props.nolabel - Whether to display the label for the rows or not
 * @returns {JSX.Element} - Rendered component
 */
import React from 'react';
import PropTypes from 'prop-types';
import { TablePagination, Pagination } from '@mui/material';

const CollapsiblePagination = ({ pages, page, collapsed, onChange, nolabel }) => {
  const props = nolabel ? {
    labelDisplayedRows: () => ''
  } : {};
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

CollapsiblePagination.propTypes = {
  pages: PropTypes.shape({
    pageCount: PropTypes.number.isRequired,
    itemCount: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired
  }).isRequired,
  page: PropTypes.number.isRequired,
  collapsed: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  nolabel: PropTypes.bool
};

CollapsiblePagination.defaultProps = {
  nolabel: false
};

export default CollapsiblePagination;