
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";
import  * as api  from '../connector';

// add machine code
const appleMachine = createMachine({
  id: "apple_search",
  initial: "idle",
  states: {
    idle: { },
    search: { 
      initial: "lookup",
      states: {
        lookup: {
          invoke: {
            src: "initSearch",
            onDone: [
              {
                target: "list",
                actions: "assignResults",
              },
            ],
            onError: [
              {
                target: "search_error",
                actions: "assignProblem",
              },
            ],
          },
        },
        list: {
          on: {
            CLOSE: {
              target: "#apple_search.idle",
              actions: "clearResults",
            },
          },
        },
        search_error: {},
      },
    },
  },
  on: {
    CHANGE: {
      actions: "applyChanges",
    },
    FIND: {
      target: ".search",
    },
  },
  context: {
    param: "", entity: 'all', page: 1
  },
  predictableActionArguments: true,
  preserveActionOrder: true,
},
{
  actions: {
    applyChanges: assign((_, event) => ({
      [event.key]: event.value
    })),
    assignProblem: assign((_, event) => ({
      error: event.data.message,
      stack: event.data.stack
    })),
    assignResults: assign((_, event) => ({
      results: event.data,
      page: 1
    })),
    clearResults: assign(({
      results: null,
      entity: 'all',
      param: "",
    })),
  }
});

export const useApple = () => {
  const [state, send] = useMachine(appleMachine, {
    services: {
      initSearch: async(context) => {
        return api.findMusic(context.param, context.entity);
      }
     },
  }); 

  const setProp = (event) => {
    send({
      type: "CHANGE",
      key: event.target.name, value: event.target.value
    })
  }

  return {
    state,
    send, 
    setProp,
    ...state.context
  };
}
