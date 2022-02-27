import React, { useState } from 'react';
import { Container, Table } from '@mui/material';
import { styled } from '@mui/system';
import { SortableFields } from './types/SortableFields';

import useAPI from './hooks/useAPI';

import SortableTableHeadingComponent from './components/SortableTableHeading/SortableTableHeading';
import SearchBox from './components/SearchBox/SearchBox';


const StyledTable = styled(Table)`

  thead tr th {
    text-align: left;
    border-bottom: 1px solid #333333;
  }

  tbody tr td {
    padding: 10px;
  }

  tbody tr:nth-of-type(even){
    background-color: #EEEEEE;
  }
`;

function App() {
  const [searchText, setSearchText] = useState<string>('');
  const [filterText, setFilterText] = useState<string>('');
  const [currentSearch, setCurrentSearch] = useState<string>();
  const [sortedBy, setSortedBy] = useState<SortableFields>(SortableFields.Name);
  const [orderBy, setOrderBy] = useState<number>(1);
  const [isFetching, error, data] = useAPI(currentSearch);

  const sorted = data.slice().sort((a: any, b: any) => {
    if (orderBy === 1) {
      return a[sortedBy] as any > b[sortedBy] as any ? 1 : -1;
    }
    return a[sortedBy] as any < b[sortedBy] as any ? 1 : -1;
  });

  const filtered = sorted.filter(pwn => {
    return pwn[SortableFields.Name].toLowerCase().includes(filterText.toLocaleLowerCase()) ||
      pwn[SortableFields.BreachDate].includes(filterText);
  });

  const SortableTableHeading = ({ name }: { name: SortableFields }) => (
    <SortableTableHeadingComponent
      name={name}
      sortedBy={sortedBy}
      orderBy={orderBy}
      setSortedBy={setSortedBy}
      setOrderBy={setOrderBy}
    />
  )

  return (
    <Container>
      <div style={{ backgroundColor: '#EEE', height: 200, paddingTop: 20 }}>
        <SearchBox
          searchText={searchText}
          filterText={filterText}
          setSearchText={setSearchText}
          setFilterText={setFilterText}
          setCurrentSearch={setCurrentSearch}
        />
      </div>
      {!isFetching && data.length === 0 && currentSearch !== undefined && (
        <h2>No Results</h2>
      )}
      {isFetching && (
        <h2 style={{ margin: '0 auto' }}>Searching...</h2>
      )}
      {!isFetching && data.length > 0 && (
        <StyledTable>
          <thead>
            <tr>
              <th />
              <SortableTableHeading name={SortableFields.Name} />
              <SortableTableHeading name={SortableFields.BreachDate} />
            </tr>
          </thead>
          <tbody>
            {filtered && filtered.map((pwn, idx) => (
              <tr key={idx}>
                <td>
                  <div style={{ backgroundColor: '#333', width: 70, padding: 10 }}>
                    <img width={50} src={pwn.logoPath} alt={pwn.name} />
                  </div>
                </td>
                <td>
                  {pwn.domain?.includes('.') ? (
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={`http://${pwn.domain}`}>
                      {pwn.title}
                    </a>
                  ) : (
                    <span>{pwn.title}</span>
                  )}
                </td>
                <td>{pwn.breachDate}</td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      )}
    </Container>
  );
}

export default App;
