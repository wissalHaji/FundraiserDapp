import React, { createContext, useContext } from "react";

/**
 * Drizzle context is an object that holds :
 * The drizzle instance
 * Drizzle state from the store
 * Boolean "initialized" : holds drizzle status
 *
 */

const Context = createContext();

export class DrizzleProvider extends React.Component {
  state = { drizzleState: null, initialized: false };

  componentDidMount() {
    const { drizzle } = this.props;
    // subscribe to changes in the store, keep state up-to-date
    this.unsubscribe = drizzle.store.subscribe(() => {
      const drizzleState = drizzle.store.getState();
      if (drizzleState.drizzleStatus.initialized) {
        this.setState({
          drizzleState,
          initialized: true,
        });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      <Context.Provider
        value={{
          drizzle: this.props.drizzle,
          drizzleState: this.state.drizzleState,
          initialized: this.state.initialized,
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}

export function useDrizzleContext() {
  const context = useContext(Context);
  return context;
}
