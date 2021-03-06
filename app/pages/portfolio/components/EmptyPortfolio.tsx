import { Button, Typography } from 'material-ui';
import React from 'react';
import { Link } from 'react-router-dom';

export const EmptyPortfolio = () => {
  return (
    <div>
      <Typography type="title">No data yet</Typography>
      <Typography type="subheading">
        Try to add an<Button
          dense
          color="primary"
          component={props => <Link {...props} to="/sources" />}
        >
          exchange
        </Button>
        or a<Button dense color="primary" component={props => <Link {...props} to="/wallets" />}>
          wallet
        </Button>
      </Typography>
    </div>
  );
};
