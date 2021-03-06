import { WithStyles } from 'material-ui';
import { MoreVert } from 'material-ui-icons';
import red from 'material-ui/colors/red';
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import { StyleRules } from 'material-ui/styles';
import withStyles from 'material-ui/styles/withStyles';

import React from 'react';

const styles: StyleRules = {
  error: {
    color: red[500],
  },
};

interface MenuItem {
  key: string;
  text: string;
  onClickListener: () => any;
  className?: string;
}
interface Props {
  items: MenuItem[];
}

export const CardMenu = withStyles(styles)(
  class extends React.Component<Props & WithStyles> {
    public state = {
      anchorEl: undefined,
    };

    public handleClick = event => {
      this.setState({ anchorEl: event.currentTarget });
    };

    public handleClose = (callback?: () => any) => () => {
      this.setState({ anchorEl: undefined });
      if (callback) {
        callback();
      }
    };

    public render() {
      const { classes, items } = this.props;
      const { anchorEl } = this.state;

      return (
        <div>
          <IconButton aria-owns={anchorEl ? 'card-menu' : undefined} onClick={this.handleClick}>
            <MoreVert />
          </IconButton>
          <Menu
            id="card-menu"
            anchorEl={anchorEl}
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            open={Boolean(anchorEl)}
            onClose={this.handleClose()}
          >
            {items.map(item => (
              <MenuItem
                key={item.key}
                onClick={item.onClickListener}
                className={item.className ? classes[item.className] : undefined}
              >
                {item.text}
              </MenuItem>
            ))}
          </Menu>
        </div>
      );
    }
  }
);
