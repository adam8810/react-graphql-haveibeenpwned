import React from 'react';
import { Button } from '@mui/material';
import { SortableFields } from '../../types/SortableFields';
import { ArrowDropUp, ArrowDropDown } from '@mui/icons-material';

export type PropTypes = {
  name: SortableFields,
  sortedBy: string,
  orderBy: number,
  setSortedBy: React.Dispatch<React.SetStateAction<SortableFields>>
  setOrderBy: React.Dispatch<React.SetStateAction<number>>
}

const SortableTableHeading = ({
  name,
  sortedBy,
  orderBy,
  setSortedBy,
  setOrderBy,
}: PropTypes) => {

  function handleClick() {
    setSortedBy(name);

    // If name does not equal sortedBy this means it's the first click
    // and we reset the order back to the default ascending
    if (name !== sortedBy) {
      setOrderBy(1);
    } else {
      setOrderBy(orderBy === 1 ? 0 : 1);
    }
  }

  return (
    <th style={{ width: '100%' }}>
      <Button
        onClick={handleClick}>
        {name}
        {sortedBy === name && (
          <span>{orderBy > 0 ? (
            <ArrowDropUp />
          ) : (<ArrowDropDown />)}</span>
        )}
      </Button>
    </th>
  )
}

export default SortableTableHeading;