
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";

// add machine code
const useTimerMachine = createMachine({
  id: "timer",
  initial: "ready",
  states: {
    ready: {
      description: "Timer is idle unless AUTO is set to true, otherwise wait for START event.",
      initial: "load",
      states: {
        load: {
          invoke: {
            src: "loadSettings",
            onDone: [
              {
                target: "decide",
                actions: "assignSettings",
              },
            ],
          },
        },
        decide: {
          always: {
            target: "#timer.running",
            cond: "isAuto",
          },
        },
      },
      on: {
        START: {
          target: "running",
        },
      },
    },
    running: {
      initial: "tick",
      states: {
        tick: {
          entry: "decrementTick",
          after: {
            "100": {
              target: "#timer.running.tock",
              actions: [],
              internal: false,
            },
          },
        },
        tock: {
          entry: "decrementTick",
          after: {
            "100": [
              {
                target: "#timer.running.tick",
                cond: "positiveTick",
                actions: [],
                internal: false,
              },
              {
                target: "#timer.done",
                actions: [],
                internal: false,
              },
            ],
          },
        },
      },
    },
    done: {},
  },
  context: {
    counter: 0,
    auto: false,
  },
  predictableActionArguments: true,
  preserveActionOrder: true,
},
{
  guards: {
    isAuto: context => !!context.auto,
    positiveTick: context => context.counter > 0
  }, 
  actions: {
    decrementTick: assign((context) => ({ 
      counter: context.counter - .1,
      progress: 100 * (1 - (context.counter / context.limit))
    })),
    assignSettings: assign((_, event) => ({
      limit:  event.data.limit,
      counter: event.data.limit,
      auto: event.data.auto
    }))
  }
}
);

export const useUseTimer = (settings) => {
  const [state, send] = useMachine(useTimerMachine, {
    services: { 
      loadSettings: async() => settings
    },
  }); 

  return {
    state,
    send, 
    ...state.context
  };
} 
 