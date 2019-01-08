/**
 * NOTE: We can't test this component because Enzyme doesn't support rendering
 * into portals.
 */

import { Component } from 'react';
import { createPortal } from 'react-dom';

export const insertPositions: { [position: string]: InsertPosition } = {
  'after': 'afterend',
  'before': 'beforebegin',
};

export const INSERT_POSITIONS = Object.keys(insertPositions);

interface Props {
  insert?: {
    sibling: HTMLElement;
    position: 'after' | 'before';
  };
  portalRef?: (portalRef: HTMLDivElement) => void;
}

export class EuiPortal extends Component<Props> {
  portalNode: HTMLDivElement;

  constructor(props: Props) {
    super(props);

    const {
      insert,
    } = this.props;

    this.portalNode = document.createElement('div');

    if (insert == null) {
      // no insertion defined, append to body
      document.body.appendChild(this.portalNode);
    } else {
      // inserting before or after an element
      insert.sibling.insertAdjacentElement(
        insertPositions[insert.position],
        this.portalNode
      );
    }
  }

  componentDidMount() {
    this.updatePortalRef();
  }

  componentWillUnmount() {
    if (this.portalNode != null) {
      if (this.portalNode.parentNode != null) {
        this.portalNode.parentNode.removeChild(this.portalNode);
      }
      // @ts-ignore only null because we're unmounting, and it's cleaner to suppress the
      // warning than handle nulls everywhere else.
      this.portalNode = null;
    }
    this.updatePortalRef();
  }

  updatePortalRef() {
    if (this.props.portalRef) {
      this.props.portalRef(this.portalNode);
    }
  }

  render() {
    return createPortal(
      this.props.children,
      this.portalNode
    );
  }
}
