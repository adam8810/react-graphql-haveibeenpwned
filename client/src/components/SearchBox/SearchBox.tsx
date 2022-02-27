import React, { useState, useEffect, useRef } from 'react';
import { Card, Chip, IconButton } from '@mui/material';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { styled } from '@mui/system';

export type PropTypes = {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>
  filterText: string,
  setFilterText: React.Dispatch<React.SetStateAction<string>>,
  setCurrentSearch: React.Dispatch<React.SetStateAction<string | undefined>>
}

const BorderlessInput = styled('input')`
  border: none;
  font-size: 15px;
  flex-grow: 1;
  padding: 20px;

  &:focus {
    outline-width: 0;
  }

  &.invalid-email {
    color: red;
  }
`;

const UnifiedSearchBox = styled(Card)`
  display:flex;
  padding-left: 10px;
  padding-right: 10px;
  position: relative;
  margin: 50px auto;
  width: 600px;
`;

const SearchBox = ({
  searchText,
  setSearchText,
  filterText,
  setFilterText,
  setCurrentSearch,
}: PropTypes) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSearchTextHighlighted, setIsSearchTextHighlighted] = useState(false);
  const [shouldResetFilter, setShouldResetFilter] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  function handleChipRemove() {
    setIsSubmitted(false);
    setSearchText('')
    setFilterText('');
  }

  function handleSearchSubmit() {
    setIsSubmitted(true);
    setCurrentSearch(searchText);
  }

  function handleSearchKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {

    const regex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    setIsEmailValid(regex.test(searchText));

    if (event.key === 'Enter' && isEmailValid) {
      handleSearchSubmit();
      setIsSearchTextHighlighted(false);
      setShouldResetFilter(false);
    }

    if (event.key === 'Escape') {
      setIsSubmitted(false);
      setSearchText('');
    }
  }

  function handleFilterKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setIsSubmitted(false);
      setFilterText('');
      setIsSearchTextHighlighted(true);
    }

    if (event.key === 'Backspace' && filterText === '' && shouldResetFilter) {
      setIsSubmitted(false);
      setFilterText('');
      setIsSearchTextHighlighted(true);
    }
    if (event.key === 'Backspace' && filterText === '' && !shouldResetFilter) {
      setShouldResetFilter(true);
    }
  }

  function handleSearchClick() {
    if (isEmailValid) {
      handleSearchSubmit();
      setIsSearchTextHighlighted(false);
      setShouldResetFilter(false);
    }
  }

  useEffect(() => {
    if (isSearchTextHighlighted) {
      inputRef?.current?.select()
    }
  }, [inputRef, isSearchTextHighlighted])

  return (
    <UnifiedSearchBox>
      {!isSubmitted ? (
        <BorderlessInput
          data-testid="email-input"
          className={!isEmailValid ? 'invalid-email' : ''}
          ref={inputRef}
          placeholder="Search by Email to see if you've been pwned..."
          autoFocus
          value={searchText}
          onChange={({ target }) => setSearchText(target.value)}
          onKeyUp={handleSearchKeyUp}
        />
      ) : (
        <div>
          <Chip
            label={searchText}
            onClick={() => { setIsSubmitted(false) }}
            onDelete={handleChipRemove}
          />
          <BorderlessInput
            value={filterText}
            placeholder="Filter within Results..."
            autoFocus
            onChange={({ target }) => setFilterText(target.value)}
            onKeyUp={handleFilterKeyUp}
          />
        </div>
      )}
      <IconButton onClick={handleSearchClick} style={{ position: 'absolute', top: 10, right: 10 }} >
        <KeyboardReturnIcon
        />
      </IconButton>
    </UnifiedSearchBox>
  )
};

export default SearchBox;