
import { createMachine, assign } from 'xstate';
import { useMachine } from "@xstate/react";
import { useMediaQuery, useTheme } from '@mui/material';
import  * as api  from '../connector';

// add machine code
const appleMachine = createMachine({
  id: "apple_search",
  description:
  "The apple search machine performs searches against Apple's free iTunes Search API to allow easy browsing of music and video samples.",
initial: "idle",
  states: {
    idle: {
      entry: "assignMemory",
      description: 'Display main screen and wait  for  search entry.',
    },
    search: {
      initial: 'lookup',
      description: "User is either searching or viewing search results.",
      states: {
        lookup: {
          description: 'Perform the actual search on the iTunes API.',
          invoke: {
            src: 'initSearch',
            onDone: [
              {
                target: 'list',
                actions: 'assignResults',
                description: 'Assign event date to context results list.',
              },
            ],
            onError: [
              {
                target: 'search_error',
                actions: 'assignProblem',
                description: 'Add any errors and the call stack to context.',
              },
            ],
          },
        },

        
        list: {
          description: "Show the list of search results.",
          initial: "viewing",
          states: {
            viewing: {
              description: "Display list of results from music search or lookup",
              on: {
                LOOKUP: {
                  target: "entity",
                  actions: "assignEntity",
                  description: "Assign entity ID and type to context",
                },
                RESET: {
                  target: "#apple_search.search.lookup",
                  actions: "clearEntity",
                  description: "Reset list to original search params",
                },
              },
            },
            entity: {
              description: "Perform the entity lookup search on the iTunes API.",
              invoke: {
                src: "entityLookup",
                onDone: [
                  {
                    target: "viewing",
                    actions: "assignResults",
                    description: "Assign event date to context results list.",
                  },
                ],
                onError: [
                  {
                    target: "lookup_error",
                    description: "Add any errors and the call stack to context.",
                  },
                ],
              },
            },
            lookup_error: {
              description: "Pause to allow user to see the lookup error and recover from it",
              on: {
                RECOVER: {
                  target: "viewing",
                  actions: "clearProblems",
                  description: "Clear any errors and return to idle state,",
                },
              },
            },
          },
          on: {
            CLOSE: {
              target: "#apple_search.idle",
              actions: "clearResults",
              description: "Clear search results and return to main screen",
            },
          },
        },

        search_error: {
          description:
            'Pause to allow user to see the error and recover from it',
          on: {
            RECOVER: {
              target: '#apple_search.idle',
              actions: 'clearProblems',
              description: 'Clear any errors and return to idle state,',
            },
          },
        },
      },
    },
    transcribe: {
      description: "Transcribes spoken words into text search parameters.",
      initial: "listen",
      states: {
        listen: {
          description: "Start the speech recognition object.",
          invoke: {
            src: "startListening",
            onDone: [
              {
                target: "listening",
                description: "Transition to listen mode to capture voice input.",
              },
            ],
          },
        },
        listening: {
          description: "Listen for spoken input.",
          on: {
            STOP: {
              target: "stopping",
              description: "Transition to stopping mode to begin search.",
            },
            HEAR: {
              // target: "#apple_search.search",
              target: "stopping",
              actions: "assignHeard",
              description: "Assign transcribed text to state.",
            },
          },
        },
        stopping: {
          description: "Stop the speech recognition object.",
          invoke: {
            src: "stopListening",
            onDone: [
              {
                target: "#apple_search.search",
                description: "Begins search for the spoken search parameter",
              },
            ],
          },
        },
      },
    },
  },
  on: {
    FIND: {
      target: '.search',
      description: 'Begins search for the current search parameter',
    },
    CHANGE: {
      actions: 'applyChanges',
      description: 'Add or update the value of a state.context property',
    },
    SPEAK: {
      target: ".transcribe",
      description: "Prepare to capture voice input",
    },
  },
  context: {
    param: "", 
    entity: 'all', 
    page: 1,
    viewAs: 'grid',
    sortBy: "trackName",
    sortUp: 1
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
    clearEntity: assign((_, event) => ({
      id: null,
      lookupType: null
    })),
    assignEntity: assign((_, event) => ({
      id: event.id,
      lookupType: event.entity,
      sortBy: event.order
    })),
    assignMemory: assign({
      memory: JSON.parse(
        localStorage.getItem('amp-memory') || "[]"
      )
    }),
    assignResults: assign((context, event) => { 
      const memory = JSON.parse(
        localStorage.getItem('amp-memory') || "[]"
      )

      if (memory.indexOf(context.param) < 0) {
        memory.push(context.param)
        localStorage.setItem('amp-memory', JSON.stringify(memory)) 
      }

      return {
        results: event.data,
        page: 1,
        memory,
      }
    }),
    assignHeard: assign((_, event) => { 
      return {
        param: event.result
      }
    }),
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
      stopListening: async() => {
        return recognition.stop();
      },
      startListening: async() => {
        return recognition.start();
      },
      initSearch: async(context) => {
        return api.findMusic(context.param, context.entity);
      },
      entityLookup: async(context) => {
        return api.lookupMusic(context.id, context.lookupType);
      }
     },
  });  
  
  const theme = useTheme();
  const isMobileViewPort = useMediaQuery(theme.breakpoints.down('md'));


  // helper function sets property from an INPUT element event
  const setProp = (event, value) => {
    if (typeof event === 'string') {
      return send({ type: "CHANGE", key: event, value})
    }
    send({
      type: "CHANGE",
      key: event.target.name, value: event.target.value
    })
  } 
  
  const searchText = (param) => {
    send({
      type: "CHANGE",
      key: 'param',
      value: param
    });
    send('FIND');
  } 
  

  // fire the HEAR event when the recognizer has a result
  recognition.addEventListener("result",  (event) => { 
    const result = event.results[event.resultIndex][0].transcript; 
    send({
      type: 'HEAR',
      result
    });
  }); 

  const diagnosticProps = {
    ...appleMachine,
    state,
    send,
  };

  const isIdle = ['idle'].some(state.matches);
  const isListening = ['transcribe.listening'].some(state.matches);
  const isSearching = state.matches('search');
  const hasListItems = state.context.results?.length;


  return {
    state,
    send, 

    setProp, 
    searchText,
    isIdle,
    isListening,
    hasListItems,
    isSearching,
    isMobileViewPort,
    
    diagnosticProps,
    ...state.context
  };
}

const recognition = new window.webkitSpeechRecognition();
recognition.lang = 'en-US';
recognition.continuous = true; 