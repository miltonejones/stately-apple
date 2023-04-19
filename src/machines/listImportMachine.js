
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";
import  * as api  from '../connector';

// add machine code
const listImportMachine = createMachine({
  id: "list_import",
  initial: "loaded",
  states: {
    identify: {
      initial: "next",
      states: {
        next: {
          always: [
            {
              target: "identify",
              cond: "moreTracks",
            },
            {
              target: "#list_import.verify",
            },
          ],
        },
        identify: {
          invoke: {
            src: "identifyTrack",
            onDone: [
              {
                target: "next",
                actions: ["assignTrack", "increment"],
              },
            ],
            onError: [
              {
                target: "next",
                actions: "increment",
              },
            ],
          },
        },
      },
      on: {
        CLOSE: {
          target: "loaded",
        },
      },
    },
    verify: {
      on: {
        CHANGE: { 
          actions: "applyChanges",
        },
      },},
    loaded: {
      on: {
        LOAD: {
          target: "#list_import.identify",
          actions: "assignItems",
        },
      },
    },
  },
  on: {
    LOAD: {
      target: ".identify",
      actions: "assignItems",
    },
  },
  predictableActionArguments: true,
  preserveActionOrder: true,
},
{
  guards: {
    moreTracks: context => context.track_index < context.tracks.length
  },
  actions: {
    applyChanges: assign((_, event) => ({
      [event.key]: event.value
    })),
    assignItems: assign((_, event) => ({
      track_index: 0,
      results: [],
      tracks: event.tracks.map(t => ({
        ...t,
        param: `${t.trackName} ${t.artistName}`
      })),
    })),

    increment: assign(context => ({

      track_index: context.track_index + 1, 
    })) ,

    assignTrack: assign((context, event) => {
      console.log(event.data);
      const { tracks, track_index } = context;
      const track = tracks[track_index];

      const { results } = event.data;
      const result = results.find(f => f.trackName === track.trackName && f.artistName === track.artistName);
      if (!result) {
        console.log("No results found" , results)
        return   
      }

      return { 
        results: context.results.concat(result)
      }


    })
  }
}

);


export const useListImport = () => {
  const [state, send] = useMachine(listImportMachine, {
    services: {
      identifyTrack: async (context) => {
        const { tracks, track_index } = context;
        const track = tracks[track_index];
        return api.findMusic(track.param, 'music');
      }
     },
  }); 

  return {
    state,
    send, 
    ...state.context
  };
}
