import React from 'react';
import { Nowrap, Flex, TinyButton, TextIcon } from '../../../styled';
import AboutModal from '../AboutModal/AboutModal';

const AppFooter = ({ small }) => {
  return (
    <Flex
      between
      sx={{ p: (t) => t.spacing(1, 3), height: 'var(--bottom-bar-offset)' }}
      spacing={1}
    >
      {!small && <Flex spacing={2} small muted>
        <AboutModal />
        <Flex spacing={1}>
          <TinyButton icon="GitHub" />
          <Nowrap small hover muted onClick={() => window.open(GITHUB_URL)}>
            Github Repo
          </Nowrap>
        </Flex>
      </Flex>}

      {!small && <Nowrap small hover muted onClick={() => window.open(ITUNES_API)}>
        {' '}
        Powered by the <b>iTunes Search API</b>
      </Nowrap>}

      <Flex spacing={1}>
        <TextIcon icon="Apple" />
        <Nowrap hover small muted onClick={() => window.open(XSTATE_HOME)}>
          <b>Boombot</b>. An xstate web application
        </Nowrap>
      </Flex>
    </Flex>
  );
};
AppFooter.defaultProps = {};
export default AppFooter;

const ITUNES_API =
  'https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/index.html';
const GITHUB_URL = 'https://github.com/miltonejones/stately-apple';
const XSTATE_HOME = 'https://xstate.js.org/';
