import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { SearchBar } from './App';
import { Link } from 'react-router-dom';
import { Chip } from '@mui/material';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function ResultCard({ details }) {
  const short_text = (text, words) => (text.split(" ", words).join(" "))

  return (
    <>
    <Card sx={{ display: 'flex', ':hover': {boxShadow: 100,} }}>
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: '1 0 auto' }}>
        <a href={`https://www.youtube.com/watch?v=${details['id']}`}>
        <Typography component="div" variant="h5">
          {details['snippet']['title']}
        </Typography>
        </a>
        <Typography variant="subtitle2" color="text.secondary" component="div" fontStyle={'italic'} sx={{my: 2}}>
            <a href={`https://youtube.com/channel/${details['snippet']['channelId']}`}>
            <Chip label={details['snippet']['channelTitle']} sx={{mr: 2}} onClick={() => {}} />
            </a>
            {new Date(details['snippet']['publishedAt']).toLocaleString()}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" component="div">
          {short_text(details['summary'], 50)}
        </Typography>
      </CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
        
      </Box>
    </Box>
    <a href={`https://www.youtube.com/watch?v=${details['id']}`}>
    <CardMedia
      component="img"
      sx={{ width: '22vw' }}
      image={details['snippet']['thumbnails']['high']['url']}
      alt="Live from space album cover"
    />
    </a>
    </Card>
    </>
  )
}

export default function SearchResults({query, setQuery}) {
  const [cards, setCards] = React.useState(undefined)
  const [time, setTime] = React.useState(undefined)
  const [error, setError] = React.useState('') 

  const fetch_results = (query, setCards, setTime) => {
    setError('')
    setCards(undefined)
    setTime(undefined)

    fetch('http://localhost:8000/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        'text': query
      })
    })
    .then(resp => {
      if(!resp.ok)
        throw Error('Error while fetching results!')
      return resp.json()
    })
    .then(resp => {
      setCards(resp.results)
      setTime(resp.time)
    })
    .catch(err => {
      setError(err.message)
    })
  }

  React.useEffect(() => {
    fetch_results(query, setCards, setTime)
  }, [])

  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <CameraIcon sx={{ mr: 2 }} />
          <Link to="/">
          <Typography variant="h6" color="inherit" noWrap>
            VidRetrieve
          </Typography>
          </Link>
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container>
            <Grid container>
              <Grid item xs={10} style={{ display: 'flex' }}>
                <SearchBar query={query} setQuery={setQuery} />
              </Grid>
              <Grid item xs={2} style={{ display: 'flex' }}>
                <Button variant="outlined" size='large'
                  style={{ display: 'flex', minWidth: '90%', height: '100%', margin: 'auto' }}
                  onClick={() => fetch_results(query, setCards, setTime)}>
                  Search
                </Button>
              </Grid>
            </Grid>
          </Container>

          {
            (time) ?
              <div style={{ textAlign: 'center', marginTop: '1%' }}>
                This search took
                <Typography color={'green'} align='center' style={{ margin: '5px', display: 'inline' }}>
                  {parseFloat(time.toFixed(6))}
                </Typography>
                seconds!
              </div>
              :
              <></>
          }
        </Box>

        <Container>
          <Typography color={'red'} align='center' style={{margin: '2%'}}>
          {error}
          </Typography>
        </Container>

        <Container sx={{ py: 8 }} maxWidth="lg">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {
              cards ?
                cards.map((card) => (
                  <Grid item key={card} xs={12}>
                    <ResultCard details={card} />
                  </Grid>
                ))
                :
                <></>
            }
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Something here to give the footer a purpose!
        </Typography>
        <Copyright />
      </Box>
      {/* End footer */}
    </>
  );
}