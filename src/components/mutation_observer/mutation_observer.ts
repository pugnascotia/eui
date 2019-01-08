import { Component, ReactNode } from 'react';

interface Props {
  children: (updateChildNode: any) => ReactNode;
  observerOptions: MutationObserverInit;
  onMutation: MutationCallback;
}

class EuiMutationObserver extends Component<Props> {
  childNode: Node | null = null;
  observer: MutationObserver | null = null;

  componentDidMount() {
    if (this.childNode == null) {
      throw new Error('EuiMutationObserver did not receive a ref');
    }
  }

  updateChildNode = (ref: Node) => {
    if (this.childNode === ref) {
      return; // node hasn't changed
    }

    this.childNode = ref;

    // if there's an existing observer disconnect it
    if (this.observer != null) {
      this.observer.disconnect();
      this.observer = null;
    }

    if (this.childNode != null) {
      this.observer = new MutationObserver(this.onMutation);
      this.observer.observe(this.childNode, this.props.observerOptions);
    }
  }

  onMutation = (mutations: MutationRecord[], observer: MutationObserver) => {
    this.props.onMutation(mutations, observer);
  }

  render() {
    return this.props.children(this.updateChildNode);
  }
}

export { EuiMutationObserver };
