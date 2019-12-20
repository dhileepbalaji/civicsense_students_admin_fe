import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
import IconButton from '@material-ui/core/IconButton';
import StopIcon from '@material-ui/icons/Stop';
import Image from 'material-ui-image';
import { getImageUrl } from '../utils/constants';
import ToastComponent from '../components/ToastComponent';
import LoadingComponent from './LoadingComponent';
import { Tooltip } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    marginRight: '5%',
    marginTop: '2%',
    marginLeft: '5%',
    height: '550px',
  },
  grid: {
    height: '100%',
    borderRight: '2px solid #00000029',
    borderRadius: '10px',
    boxShadow: '0px 3px 6px #00000029',
  },
  titleCard: {
    height: '8%',
    boxShadow: 'unset',
    borderRadius: 'unset',
  },
  paper: {
    padding: '0 16px 0 16px',
    textAlign: 'center',
    color: 'theme.palette.text.secondary',
    height: '92%',
    overflow: 'auto',
    boxShadow: 'unset',
    borderRadius: 'unset',
  },
  campaignLabel: {
    fontWeight: 'bold',
    textAlign: 'center',
    padding: '8px 0',
  },
  campaignDurationLabel: {
    color: '#707070',
    font: 'Medium 20px/26px Roboto;',
    textAlign: 'left',
    float: 'right',
  },
  card: {
    maxWidth: '200px',
    height: '270px',
  },
  media: {
    height: 200,
  },
  button: {
    padding: '0px',
  },
  selectedListItem: { paddingLeft: '0px', color: '#0084FF !important', fontWeight: 'bold' },
  unSelectedItem: { paddingLeft: '0px' },
}));

export const CampaignIndividualStats = props => {
  const classes = useStyles();
  const [selectedCampaign, setSelectedCampaign] = React.useState('');
  const { campaignDetails, campaignData, onCampaignClick, onEntrySubmissionClick, handleToastClose } = props;

  const getElementsToRenderBasedOnProps = campaignData => {
    let campaignEntriesList = [];
    if (campaignData !== undefined) {
      if (campaignData.isLoading) {
        return <LoadingComponent isLoading={campaignData.isLoading} />;
      } else if (campaignData.campaignDetailsError !== '') {
        return (
          <ToastComponent
            handleClose={handleToastClose}
            openToast={true}
            toastMessage={'Error in fetching Campaign entries. Please try later..'}
            toastVariant={'error'}
          />
        );
      } else if (campaignData && campaignData.campaignDetails && campaignData.campaignDetails.entries) {
        campaignData.campaignDetails.entries.map(value => {
          const imageUrl = `${getImageUrl + value.photoId}`;
          campaignEntriesList.push(
            <Grid item xs={12} sm={6} md={3} key={value}>
              <Card className={classes.card}>
                <CardActionArea>
                  <Image imageStyle={{ height: '200px' }} src={imageUrl} title="" />
                </CardActionArea>
                <List>
                  <ListItem style={{ paddingTop: '0px', paddingLeft: '0px' }}>
                    <StopIcon style={{ float: 'left', color: 'grey' }} />
                    <ListItemText
                      id={value}
                      primary={
                        <Tooltip title={value.locationNm}>
                          <Typography
                            style={{ float: 'left', width: '80px', textOverflow: 'ellipsis', overflow: 'hidden' }}
                          >
                            {value.locationNm}
                          </Typography>
                        </Tooltip>
                      }
                    />
                    <IconButton
                      size="small"
                      className={classes.button}
                      aria-label="accept"
                      onClick={() => {
                        const eventData = {
                          status: 'ACCEPTED',
                          campaignId: selectedCampaign,
                          entryId: value._id,
                        };
                        onEntrySubmissionClick(eventData);
                      }}
                    >
                      <CheckBoxIcon style={{ color: '#00AB88', fontSize: '40px' }} />
                    </IconButton>
                    <IconButton
                      className={classes.button}
                      aria-label="reject"
                      onClick={() => {
                        const eventData = {
                          status: 'REJECTED',
                          campaignId: selectedCampaign,
                          entryId: value._id,
                        };
                        onEntrySubmissionClick(eventData);
                      }}
                    >
                      <CancelPresentationIcon style={{ color: '#AEAEAE', fontSize: '40px' }} />
                    </IconButton>
                  </ListItem>
                </List>
              </Card>
            </Grid>,
          );
        });
        return campaignEntriesList;
      } else {
        return '';
      }
    }
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={0} className={classes.grid}>
        <Grid item xs={3} className={classes.grid}>
          <Card className={classes.titleCard}>
            <Typography color="textSecondary" className={classes.campaignLabel}>
              CAMPAIGNS
            </Typography>
          </Card>
          <Paper className={classes.paper}>
            <List>
              {campaignDetails
                ? campaignDetails.map(value => {
                    const labelId = `checkbox-list-label-${value._id}`;

                    return (
                      <ListItem
                        key={value._id}
                        role={undefined}
                        button
                        className={selectedCampaign === value._id ? classes.selectedListItem : classes.unSelectedItem}
                        selected={selectedCampaign === value._id}
                        onClick={() => {
                          setSelectedCampaign(value._id);
                          onCampaignClick(value);
                        }}
                      >
                        <ListItemText
                          id={labelId}
                          primary={
                            <Typography style={{ float: 'left', paddingLeft: '10px' }}>{value.campaignName}</Typography>
                          }
                        />

                        <ListItemText
                          id={labelId}
                          primary={<Typography style={{ float: 'right' }}>{value.noOfEntries}</Typography>}
                        />
                      </ListItem>
                    );
                  })
                : ''}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={9} className={classes.grid}>
          <Card className={classes.titleCard}>
            <Typography color="textSecondary" className={classes.campaignLabel}>
              ENTRIES
            </Typography>
          </Card>
          <Paper className={classes.paper}>
            <List>
              <Grid container spacing={2} direction="row" justify="flex-start" alignItems="flex-start">
                {getElementsToRenderBasedOnProps(campaignData)}
              </Grid>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};
