import React, { HTMLAttributes, SFC } from 'react';
import classNames from 'classnames';

import { CommonProps, keysOf } from '../common';
import { isColorDark, hexToRgb } from '../../services/color';
import { VISUALIZATION_COLORS } from '../../services';

const sizeToClassNameMap = {
  'none': null,
  's': 'euiAvatar--s',
  'm': 'euiAvatar--m',
  'l': 'euiAvatar--l',
  'xl': 'euiAvatar--xl',
};

export const SIZES = keysOf(sizeToClassNameMap);

const typeToClassNameMap = {
  space: 'euiAvatar--space',
  user: 'euiAvatar--user',
};

export const TYPES = keysOf(typeToClassNameMap);

export type AvatarSize = 'none' | 's' | 'm' | 'l' | 'xl';

export type AvatarType = 'user' | 'space';

export interface EuiAvatarProps {
  name: string;
  color?: string;
  initials?: string;
  initialsLength?: number;
  className?: string;
  imageUrl?: string;
  size?: AvatarSize;
  type?: AvatarType;
}

type Props = CommonProps & HTMLAttributes<HTMLDivElement> & EuiAvatarProps;

export const EuiAvatar: SFC<Props> = ({
  className,
  color,
  imageUrl,
  initials,
  initialsLength,
  name,
  size = 'm',
  type = 'user',
  ...rest
}) => {
  const classes = classNames(
    'euiAvatar',
    sizeToClassNameMap[size],
    typeToClassNameMap[type],
    className
  );

  if (color) {
    const validHex = /^#(?:[0-9A-F]{6})|(?:[0-9A-F]{3})$/i.test(color);
    if (!validHex) {
      // tslint:disable-next-line:no-console
      console.error('EuiAvatar needs a valid color. This can either be a three or six character hex value');
    }
  }

  // Must be the number "1" or "2"
  if (initialsLength && initialsLength > 2) {
    // tslint:disable-next-line:no-console
    console.error('EuiAvatar only accepts 1 or 2 for the initials as a number');
  }

  // Must be a string of 1 or 2 characters
  if (initials && initials.length > 2) {
    // tslint:disable-next-line:no-console
    console.error('EuiAvatar only accepts a max of 2 characters for the initials as a string');
  }

  let optionalInitial;
  if (name && !imageUrl) {
    // Calculate the number of initials to show, maxing out at 2
    let calculatedInitialsLength = initials ? initials.split(' ').length : name.split(' ').length;
    calculatedInitialsLength = calculatedInitialsLength > 2 ? 2 : calculatedInitialsLength;

    // Check if initialsLength was passed and set to calculated, unless greater than 2
    if (initialsLength) {
      calculatedInitialsLength = initialsLength <= 2 ? initialsLength : 2;
    }

    let calculatedInitials;
    // A. Set to initials prop if exists (but trancate to 2 characters max unless length is supplied)
    if (initials) {
      calculatedInitials = initials.substring(0, calculatedInitialsLength);
    } else {
      if (name.trim() && name.split(' ').length > 1) {
        // B. If there are any spaces in the name, set to first letter of each word
        calculatedInitials = name.match(/\b(\w)/g)!.join('').substring(0, calculatedInitialsLength);
      } else {
        // C. Set to the name's initials truncated based on calculated length
        calculatedInitials = name.substring(0, calculatedInitialsLength);
      }
    }

    optionalInitial = (
      <span aria-hidden="true">{calculatedInitials}</span>
    );
  }

  const assignedColor = color || VISUALIZATION_COLORS[Math.floor(name.length % VISUALIZATION_COLORS.length)];
  const [r, g, b] = hexToRgb(assignedColor);
  const textColor = isColorDark(r, g, b) ? '#FFFFFF' : '#000000';

  const avatarStyle = {
    backgroundImage: imageUrl ? `url(${  imageUrl  })` : 'none',
    backgroundColor: assignedColor,
    color: textColor,
  };

  return (
    <div
      className={classes}
      style={avatarStyle}
      aria-label={name}
      title={name}
      {...rest}
    >
      {optionalInitial}
    </div>
  );
};
