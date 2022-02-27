import React from 'react';
import { render, waitFor, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import SortableTableHeading, { PropTypes } from './SortableTableHeading';
import { SortableFields } from '../../types/SortableFields';

const SortableTableHeadingDefault = (props: Partial<PropTypes>) => (
  <table>
    <thead>
      <tr>
        <SortableTableHeading
          name={SortableFields.Name}
          sortedBy="name"
          setSortedBy={() => { }}
          orderBy={1}
          setOrderBy={() => { }}
          {...props}
        />
      </tr>
    </thead>
  </table>
);

test('clicking selected heading switches from ASC to DESC order', async () => {
  const setSortOrderCallback = jest.fn();
  render(
    <SortableTableHeadingDefault
      setOrderBy={setSortOrderCallback}
    />
  );

  const element = await screen.findByText(SortableFields.Name as string)

  userEvent.click(element)

  expect(setSortOrderCallback).toBeCalledWith(0);
});

test('clicking selected heading switches from DESC to ASC order', async () => {
  const setSortOrderCallback = jest.fn();
  render(
    <SortableTableHeadingDefault
      orderBy={0}
      setOrderBy={setSortOrderCallback}
    />
  );

  const element = await screen.findByText(SortableFields.Name as string)

  userEvent.click(element)

  expect(setSortOrderCallback).toBeCalledWith(1);
});