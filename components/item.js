import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
  },
  input: {
    width: 100,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
}));

export default function MediaControlCard() {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.cover}
        image="https://material-ui.com/static/images/cards/paella.jpg"  
        title="Live from space album cover"
      />
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component="h5" variant="h5">
            Live From Space
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            $10
          </Typography>
        </CardContent>
        <div className={classes.controls}>
          <IconButton aria-label="previous">
            <AddIcon/>
          </IconButton>
          <IconButton aria-label="play/pause">
            <TextField
              id="outlined-read-only-input"
              label="Total"
              defaultValue="0"
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              className={classes.input}
            />
          </IconButton>
          <IconButton aria-label="next">
            <RemoveIcon/>
          </IconButton>
        </div>
      </div>
    </Card>
  );
}