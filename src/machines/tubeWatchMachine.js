
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";
import { getIntro} from "../util/getIntro";  

const loadIntro = async (context, unpinned, moreDetails) => {
  const { intros = {}, trackName, artistName, upcoming, firstName, options } = context;
  if (intros[trackName]) {
    return intros[trackName];
  }
  const { Introduction } = await getIntro(
    trackName, 
    artistName, 
    upcoming, 
    firstName, 
    options, 

    unpinned, 
    moreDetails

  );    
  return Introduction;
}

// add machine code
const tubeWatchMachine = createMachine({
  id: "tube_watch",
  initial: "ready",
  states: {
    ready: {},
    open: {
      initial: 'tik',
      states: {
        tik: {
          always: [
            {
              target: 'loaded',
              cond: 'noTrackProps',
            },
            {
              target: 'narrate',
            },
          ],
        },
        loaded: {
          initial: 'prepare',
          states: {
            prepare: {
              entry: "assignNext",
              invoke: {
                src: 'loadNext',
                onDone: [
                  {
                    target: 'ready',
                    actions: 'assignIntros',
                  },
                ],
              },
            },
            ready: {},
          },
        },
        narrate: {
          invoke: {
            src: 'loadNarration',
            onDone: [
              {
                target: 'loaded',
                actions: ['assignIntro', 'assignIntros'],
              },
            ],
            onError: [
              {
                target: 'loaded',
                actions: 'clearProps',
              },
            ],
          },
        },
      },
      on: {
        CLOSE: {
          target: 'ready',
          actions: 'clearProps',
        },
      },
    },
  },
  on: {
    OPEN: {
      target: ".open",
      actions: "assignProps",
    },
  },
  predictableActionArguments: true,
  preserveActionOrder: true,
},

{
  guards: {
    noTrackProps: context => !context.trackName
  },
  actions: {
    assignNext: assign((context, event) => {
      const { upcoming } = context;
      const { trackName, artistName } = upcoming.shift();
      return {
        trackName, artistName , upcoming
      }
    }),
    assignIntro: assign((_, event) => ({
      intro: event.data, 
    })),
    assignIntros: assign((context, event) => ({ 
      intros: {
        ...context.intros,
        [context.trackName]: event.data
      }
    })),
    assignProps: assign((_, event) => ({
      ...event,
      intro: null
    })),
    clearProps: assign({
      trackName: null,
      intro: null
    })
  }
});

export const useTubeWatch = (onChange) => {
  const [state, send] = useMachine(tubeWatchMachine, {
    services: { 
      loadNext: async(context) => {
        return await loadIntro(context); 
      },
      loadNarration: async(context) => {
        return await loadIntro(context, context.unpinned, true);  
      }
    },
  }); 

  return {
    state,
    send, 
    ...state.context
  };
}
