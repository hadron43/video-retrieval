import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { SearchBar } from './App';
import { Link } from 'react-router-dom';
import { Chip } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Varun Khurana, Harsh Kumar
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function ResultCard({ details }) {
  const short_text = (text, words) => (text.split(" ", words).join(" "))
  const count_words = (text) => (text.split(" ").length)
  const [full, setFull] = React.useState(false)

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
          {(full | count_words(details['summary']) <= 50) ? details['summary'] : short_text(details['summary'], 50)+'...'}
          
          {
            (count_words(details['summary']) > 50) ?
            <Chip label={`View ${full ? 'Less' : 'More'}`} sx={{mx: 1}} onClick={() => setFull(!full)} />
            :
            <></>
          }
          
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

    if (!query) {
      setError("Query string can't be empty!")
      return
    }

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
      let results = []
      for (let i in resp.results) {
        if(resp.scores[i] >= -10)
          results.push(resp.results[i])
      } 

      setCards(results)
      setTime(resp.time)
    })
    .catch(err => {
      setError(err.message)
      setCards(null)
    })
  }

  React.useEffect(() => {
    fetch_results(query, setCards, setTime)
  // eslint-disable-next-line
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

        <Container maxWidth="lg">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {
              (cards && cards.length > 0) ?
                cards.map((card) => (
                  <Grid item key={card['id']} xs={12}>
                    <ResultCard details={card} />
                  </Grid>
                ))
              :
              (cards === undefined && !error)?
                <Box sx={{ display: 'flex', m: 'auto' }}>
                  <CircularProgress />
                </Box>
              :
              (!error) ?
              <Typography color={'red'} align='center' style={{margin: '2%', width: '100%'}}>
              No relevant results found. Try again?
              </Typography>
              :
              <></>
            }
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          VidRetrieve
        </Typography>
        {/* <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Retrieve videos from video descriptions with ease.
        </Typography> */}
        <Copyright />
      </Box>
      {/* End footer */}
    </>
  );
}