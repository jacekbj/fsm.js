import { FSM, State, Transition } from './finite-state-machine';

interface ReduxExtension {
  send: (action: string, payload: any) => void;
}

interface ReduxExtensionWindow {
  __REDUX_DEVTOOLS_EXTENSION__?: ReduxExtension
}

declare const window: Window & ReduxExtensionWindow;

export class ReduxExtensionConnector {
  extension?: ReduxExtension;

  constructor(private fsm: FSM, prefix: string = '') {
    this.extension = window.__REDUX_DEVTOOLS_EXTENSION__;

    fsm.eventEmitter.on(FSM.events.leave, (state: State) => {
      if (typeof this.extension !== 'undefined') {
        this.extension.send(`${prefix}${FSM.events.leave}`, state.name);
      }
    });
    fsm.eventEmitter.on(FSM.events.enter, (state: State) => {
      if (typeof this.extension !== 'undefined') {
        this.extension.send(`${prefix}${FSM.events.enter}`, state.name);
      }
    });
    fsm.eventEmitter.on(FSM.events.transition, (transition: Transition) => {
      if (typeof this.extension !== 'undefined') {
        this.extension.send(
          `${prefix}${FSM.events.transition}`,
          `${transition.from}`,
        );
      }
    });
  }
}