// @flow
import React, { Component, FormEvent } from 'react';
import ccxt from 'ccxt';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, WithStyles } from 'material-ui';
import { StyleRules, withStyles } from 'material-ui/styles';

import { Exchange } from 'reducers/exchanges.types';
import { Autocomplete } from 'components/Autocomplete';

export type DialogConfig =
  | AddConfig
  | EditConfig;

type AddConfig = {
  action: 'add'
};

type EditConfig = {
  action: 'edit',
  exchange: Exchange
};

type Props = {
  open: boolean,
  onClose: () => void,
  saveExchange: (exchange: Exchange) => void,
  config?: DialogConfig,
};

type State = {
  exchange: Exchange
};

const emptyExchange: Exchange = {
  id: '',
  type: '',
  credentials: {
    apiKey: '',
    secret: '',
  },
  balances: {},
  ledger: [],
  trades: [],
};

const styles: StyleRules = {
  paper: {
    width: 500,
  },
};

export const ExchangeDialog = withStyles(styles)(
  class extends Component<Props & WithStyles, State> {
    state: State = {
      exchange: emptyExchange,
    };

    componentWillReceiveProps(nextProps: Props): void {
      if (this.props.open !== nextProps.open && nextProps.config) {
        if (nextProps.config.action === 'edit') {
          return this.setState({ exchange: nextProps.config.exchange });
        }
        this.setState({ exchange: emptyExchange });
      }
    }

    changeExchange = (type: string) => {
      this.setState({ exchange: { ...this.state.exchange, type } });
    };

    changeCredentials = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({
        exchange: {
          ...this.state.exchange,
          credentials: { ...this.state.exchange.credentials, [name]: event.target.value },
        },
      });
    };

    handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      this.props.saveExchange(this.state.exchange);
    };

    createDialog(config: DialogConfig) {
      const { requiredCredentials } = this.state.exchange.type !== ''
        ? new ccxt[this.state.exchange.type]()
        : { requiredCredentials: {} };
      return (
        <div>
          <DialogTitle>{config.action === 'add' ? 'Add' : 'Edit '} exchange </DialogTitle>
          <DialogContent>
            <form autoComplete="off" onSubmit={this.handleSubmit}>
              <div style={{ minHeight: 250 }}>
                <Autocomplete
                  label="Exchange"
                  onChange={this.changeExchange}
                  value={this.state.exchange.type}
                  items={ccxt.exchanges.filter(exchange => exchange.charAt(0) !== '_')}
                />
                {this.state.exchange.type !== ''
                  ? (
                    <div>
                      {requiredCredentials.apiKey
                        ? <TextField
                          label="API Key"
                          id="apiKey"
                          value={this.state.exchange.credentials.apiKey}
                          onChange={this.changeCredentials('apiKey')}
                          fullWidth
                          margin="normal"
                        /> : ''}
                      {requiredCredentials.secret
                        ? <TextField
                          label="Secret"
                          id="secret"
                          value={this.state.exchange.credentials.secret}
                          onChange={this.changeCredentials('secret')}
                          fullWidth
                          margin="normal"
                        /> : ''}
                      {requiredCredentials.uid
                        ? <TextField
                          label="User ID"
                          id="uid"
                          value={this.state.exchange.credentials.uid}
                          onChange={this.changeCredentials('uid')}
                          fullWidth
                          margin="normal"
                        /> : ''}
                      {requiredCredentials.login
                        ? <TextField
                          label="Login"
                          id="login"
                          value={this.state.exchange.credentials.login}
                          onChange={this.changeCredentials('login')}
                          fullWidth
                          margin="normal"
                        /> : ''}
                      {requiredCredentials.password
                        ? <TextField
                          label="Password"
                          id="password"
                          value={this.state.exchange.credentials.password}
                          onChange={this.changeCredentials('password')}
                          fullWidth
                          margin="normal"
                        /> : ''}
                    </div>
                  )
                  : ''}
              </div>
              <DialogActions>
                <Button onClick={this.props.onClose} color="primary">
                  Cancel
                </Button>
                <Button type="submit" color="primary">
                  Ok
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </div>
      );
    }

    render() {
      const { open, onClose, config, classes } = this.props;

      return (
        <Dialog open={open} onClose={onClose} classes={{ paper: classes.paper }}>
          {config
            ? this.createDialog(config)
            : ''}
        </Dialog>
      );
    }
  }
);