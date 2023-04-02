
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";

// add machine code
const tubeWatchMachine = createMachine({
  id: "tube_watch",
  initial: "ready",
  states: {
    ready: {},
    count: {
      initial: "tik",
      states: {
        tik: {
          entry: "assignTime",
          invoke: {
            src: "emitTime",
            onDone: [
              {
                target: "tok",
              },
            ],
          },
        },
        tok: {
          after: {
            "500": [
              {
                target: "#tube_watch.ready",
                cond: "validTime",
                actions: [],
                internal: false,
              },
              {
                target: "#tube_watch.count.tik",
                actions: [],
                internal: false,
              },
            ],
          },
        },
      },
    },
  },
  on: {
    START: {
      target: ".count",
      actions: "assignPlayer",
    },
  },
  predictableActionArguments: true,
  preserveActionOrder: true,
},
{
  guards: {
    validTime: () => true
  },
actions: {
  assignPlayer: assign((_, event) => ({
    player: event.player
  })),
  assignTime: assign((context, event) => {
    const current_time = context.player?.getCurrentTime();
    const duration = context.player?.getDuration();
    return {
      time: {
        current_time,
        duration
      }
    }
  })
}});

export const useTubeWatch = (onChange) => {
  const [state, send] = useMachine(tubeWatchMachine, {
    services: { 
      emitTime: async(context) => onChange && onChange(context.time)
    },
  }); 

  return {
    state,
    send, 
    ...state.context
  };
}
