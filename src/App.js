import './App.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { TextField, InputAdornment, Button, useStepContext, Container } from '@mui/material';

import SearchIcon from "@mui/icons-material/Search";
import { useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import SearchResults from './SearchResults';

const theme = createTheme();

export function SearchBar({query, setQuery}) {
  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  return (
    <>
    <TextField
      id="search"
      type="search"
      value={query}
      onChange={handleChange}
      sx={{ width: '90%', marginX: 'auto' }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
    </>
  )
}

function Home({query, setQuery}) {
  return (
    <Container>
    <div className="App">
      <header className="App-header">
        <img src='vidretrieve.png' alt="logo" />
        <SearchBar query={query} setQuery={setQuery} />
        <Link to="search">
        <Button variant="outlined" size='large' style={{margin: 20}}>Search</Button>
        </Link>
      </header>
    </div>
    </Container>
  )
}


function App() {
  const [query, setQuery] = useState('')

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home query={query} setQuery={setQuery} />} />
          <Route path='/search' element={<SearchResults query={query} setQuery={setQuery} />} />
        </Routes>
      </BrowserRouter>

    </ThemeProvider>
  );
}

export default App;
