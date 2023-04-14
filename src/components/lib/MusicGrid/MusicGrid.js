import React from 'react';

import {
  styled,
  Avatar,
  MenuItem,
  Card, 
  Collapse,
  Stack,
  Box,
  Breadcrumbs,
  CircularProgress, 
  Switch,
  IconButton,
  Link,
} from '@mui/material';

import {
  Nowrap,
  TinyButton,
  Flex,
  Spacer,
  Pill,
  FlexMenu,
  TinyButtonGroup,
  Columns,
  ConfirmPop,
  Tooltag,
  TextIcon,
  CollapsiblePagination
} from '../../../styled';

import { useMenu } from '../../../machines';
import { getPagination } from '../../../util/getPagination';
import TubeMenu from '../TubeMenu/TubeMenu';


const Layout = styled(Box)(({ small, theme }) => ({
  padding: theme.spacing(0, small ? 0 : 2, 24, small ? 0 : 2),
}));

const Frame = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  borderRadius: 0,
}));

const wrapperTypes = {
  track: 'MusicNote',
  collection: 'Album',
  artist: 'Person',
  audiobook: 'LocalLibrary',
  podcast: 'Podcasts',
  'music-video': 'MusicVideo',
  'tv-season': 'PersonalVideo',
  movie: 'Videocam',
  ebook: 'MenuBook',
};

const headers = {
  wrapperType: '',
  trackName: 'Title',
  artistName: 'Artist',
  collectionName: 'Album', 
  trackPrice: 'Price', 
};

const sortTypes = {
  ...headers,
  trackNumber: 'Track Number',
  wrapperType: 'Media Type', 
};

/**

Renders a sort menu component.
@param {Object} props - The component props.
@param {Object} props.handler - The sort handler object.
@param {boolean} props.small - Whether the component is small.
@param {function} props.onChange - The onChange function.
@returns {JSX.Element} - The SortMenu component. */
const SortMenu = ({ handler, small, onChange }) => {
  const menu = useMenu(onChange);
  const { sortBy, sortUp } = handler; // Destructure handler object for cleaner code

  return (
    <>
      <Pill sx={{ gap: 1 }} onClick={menu.handleClick} active>
        <TinyButton
          icon="SortByAlpha"
          sx={{ color: 'inherit' }}
          color="inherit"
        />
        {!small && (
          <>
            <Nowrap tiny hover bold sx={{ color: 'white' }}>
              {sortTypes[sortBy]}
            </Nowrap>
            <TinyButton
              deg={sortUp > 0 ? 180 : 0}
              color="inherit"
              icon="KeyboardArrowDown"
            />
          </>
        )}
      </Pill>
      <FlexMenu
        anchorEl={menu.anchorEl}
        open={Boolean(menu.anchorEl)}
        onClose={menu.handleClose()} // Remove unnecessary parentheses
      >
        {Object.keys(sortTypes).map((key) => (
          <MenuItem key={key} onClick={menu.handleClose(key)}>
            <Flex sx={{ width: 160 }} bold={key === sortBy} hover>
              {sortTypes[key]}
              <Spacer />
              {key === sortBy && (
                <TinyButton
                  deg={sortUp > 0 ? 180 : 0}
                  icon="KeyboardArrowDown"
                />
              )}
            </Flex>
          </MenuItem>
        ))}
      </FlexMenu>
    </>
  );
}; 


/**
 * A component that renders a grid view of track results.
 *
 * @param {Object} props - The props object.
 * @param {Object} props.handler - An object containing the handler data.
 * @param {Object} props.tube - An object containing tube data to render.
 * @param {Object} props.audio - An object containing the audio data to render.
 * @param {boolean} props.small - A boolean indicating whether the view is small or not.
 * @returns {JSX.Element} - The music grid component.
 */
const MusicGrid = ({ handler, tube, audio, small }) => {
  const { results = [] } = handler.results || {};
  const { isIdle } = handler;
  const isOpen = audio.state.matches('opened');
  const songList = results?.filter(
    (f) => f.collectionType !== 'Album' && f.artistType !== 'Artist'
  );
  const songNode = results?.find(
    (f) => f.collectionType === 'Album' || f.artistType === 'Artist'
  );
  const isAlbum = !!songNode?.collectionPrice;
  const prefixLabel = isAlbum ? 'album' : 'artist';

  const pages = getPagination(songList, {
    page: handler.page,
    sortBy: handler.sortBy,
    sortUp: handler.sortUp,
    pageSize: 25,
  });

  const handleLookup = (id, entity, order) => {
    return handler.send({
      type: 'LOOKUP',
      entity,
      id,
      order
    });
  };

  const handleSort = (key) => {
    if (key === handler.sortBy) {
      return handler.setProp({
        target: {
          name: 'sortUp',
          value: -handler.sortUp,
        },
      });
    }
    handler.setProp({
      target: {
        name: 'sortBy',
        value: key,
      },
    });
  };

  const View = handler.viewAs === 'grid' ? GridView : ListView;
  const openHeight = small ? '280px' : '300px';
  const closedHeight = small ? '190px' : '200px';

  return (
    <Collapse in={!isIdle}>
      {!!results.length && (
        <Flex sx={{ p: (t) => t.spacing(0, small ? 2 : 4) }} spacing={1}>
          {!!handler.lookupType && !!songNode && (
            <Flex spacing={1}>
              
              {!!songNode.artworkUrl100 && !small && (
                <Avatar
                  onClick={() => handler.send('RESET')}
                  src={songNode.artworkUrl100}
                  alt={songNode.collectionName}
                />
              )}

              {!!small && (
                <IconButton
                  onClick={() => handler.send('RESET')} 
                >
                  <TextIcon icon="ArrowBack" />
                </IconButton>
              )}

              <Breadcrumbs aria-label="breadcrumb">
                {!small && (
                  <Nowrap
                    small={small}
                    onClick={() => handler.send('RESET')}
                    hover
                  >
                    <>Tracks like</>"{handler.param}"
                  </Nowrap>
                )}
                {!(pages.pageCount > 1 && small) && <Nowrap sx={{ maxWidth: '40vw' }} small={small}>
                  {!small && <>{prefixLabel}:</>}{' '}
                  <b>{songNode.collectionName || songNode.artistName}</b>
                </Nowrap>}
              </Breadcrumbs>
            </Flex>
          )}

          {pages.pageCount > 1 && (
            <CollapsiblePagination
              pages={pages}
              page={Number(handler.page)}
              collapsed={small}
              onChange={(b) =>
                handler.setProp({
                  target: {
                    name: 'page',
                    value: b,
                  },
                })
              }
            />
          )}

          <Spacer />

          <TinyButtonGroup
            onChange={(e) =>
              handler.setProp({
                target: {
                  name: 'viewAs',
                  value: e,
                },
              })
            }
            value={handler.viewAs}
            values={['grid', 'list']}
            buttons={['GridView', 'ViewList']}
          />
          <SortMenu
            small={small}
            handler={handler}
            onChange={(e) => !!e && handleSort(e)}
          />
          {!small && (
            <Nowrap small muted>
              {pages.startNum} to {pages.lastNum} of {pages.itemCount} results
            </Nowrap>
          )}
        </Flex>
      )}

      <Layout data-testid="test-for-MusicGrid" small={small}>
        {!!results.length && (
          <Card
            sx={{
              m: small ? 1 : 2,
              maxWidth: '100vw',
              transition: 'height 0.2s linear',
              height: `calc(100vh - ${isOpen ? openHeight : closedHeight})`,
              overflow: 'auto',
            }}
          >
            {!!results && (
              <View
                small={small}
                pages={pages}
                audio={audio}
                tube={tube}
                handleSort={handleSort}
                handleLookup={handleLookup}
                handler={handler}
              />
            )} 
          </Card>
        )}
      </Layout>
    </Collapse>
  );
};

MusicGrid.defaultProps = {};
export default MusicGrid;


/**
 * A component that renders a grid view of track results.
 *
 * @param {Object} props - The props object.
 * @param {Object} props.pages - An object containing the page data to render.
 * @param {Function} props.handleLookup - A function to handle lookups of track data.
 * @param {Object} props.audio - An object containing the audio data to render.
 * @param {boolean} props.small - A boolean indicating whether the view is small or not.
 * @param {Object} props.tube - An object containing tube data to render.
 * @returns {JSX.Element} - The grid view component.
 */ 
const GridView = ({ pages, handleLookup, audio, small, tube }) => {

  // Set the number of columns for the grid based on whether small is true or not
  const columns = small ? '1fr 1fr' : '1fr 1fr 1fr 1fr 1fr';

  // Set the maximum width for each track
  const maxWidth = 240;

  return (
    <Columns sx={{ m: 1 }} spacing={1} columns={columns}>
      {/* Render each visible page result */}
      {!!pages.visible &&
        pages.visible.map((res) => (
          <Frame
            // Apply elevation and outline styles based on whether the track is currently being played
            elevation={
              audio.src === res.previewUrl && audio.state.matches('opened')
                ? '4'
                : '1'
            }
            sx={{
              outline: (t) =>
                audio.src === res.previewUrl && audio.state.matches('opened')
                  ? `solid 4px ${t.palette.primary.main}`
                  : ``,
            }}
          >
            <img
              // Handle click event for track play
              onClick={() => {
                audio.handlePlay(res.previewUrl, {
                  src: res.previewUrl,
                  Title: res.trackName,
                  trackList: pages.items,
                  ...res,
                });
              }}
              src={res.artworkUrl100}
              alt={res.trackName}
              style={{
                width: '100%',
                aspectRatio: '1 / 1',
              }}
            />
            <Stack sx={{ p: 1 }}>
              <Flex>
                {/* Render track name with optional "explicit" label */}
                <Nowrap
                  color={tube.contains(res) ? 'error' : 'inherit'}
                  bold={
                    audio.src === res.previewUrl &&
                    audio.state.matches('opened.playing')
                  }
                  sx={{ maxWidth }}
                >
                  {res.trackName || res.collectionName}
                  {res.trackExplicitness === 'explicit' && <sup>E</sup>}
                </Nowrap>

                <Spacer />

                {/* Render menu for track actions */}
                <TubeMenu items={pages.items} tube={tube} track={res} />
              </Flex>

              {/* Render album name */}
              <Nowrap
                hover
                onClick={() => handleLookup(res.collectionId, 'song', 'trackNumber')}
                sx={{ maxWidth }}
                width="100%"
                small
              >
                {res.collectionName || 'unknown'}
              </Nowrap>

              <Flex>
                {/* Render artist name */}
                <Nowrap
                  hover
                  onClick={() => handleLookup(res.artistId, 'song', 'collectionName')}
                  sx={{ maxWidth }}
                  width="100%"
                  small
                  muted
                >
                  {res.artistName || 'unknown'}
                </Nowrap>
                <Spacer />

                {/* Render track price with a link to the track view */}
                <Nowrap
                  onClick={() => window.open(res.trackViewUrl)}
                  hover
                  wrap
                  small
                  muted
                >
                  ${res.trackPrice}
                </Nowrap>
              </Flex>
            </Stack>
          </Frame>
        ))}
    </Columns>
  );
};

 
const ListView = ({
  pages,
  audio,
  tube,
  small,
  handleSort,
  handleLookup,
  handler,
}) => {

// Determine core columns based on whether selectMode is enabled or not.
const coreCols = handler.selectMode ? '40px 40px 24px 24px 1fr' : '40px 24px 24px 1fr';

// Determine columns based on core columns and whether small is true or not.
const columns = small ? coreCols : coreCols + ' 1fr 1fr 1fr';

// Filter out excluded items from the items list.
const downloadableItems = pages.items?.filter((item) => !(handler.excludedItems && handler.excludedItems[item.previewUrl]));

// Handle batch download of selected items.
const handleBatch = () => {
  const batch = downloadableItems?.map((item) => ({
    ...item,
    param: `${item.trackName} ${item.artistName}`,
  }));
  tube.send({
    type: 'BATCH',
    batch,
  });
  // Disable selectMode after handling batch.
  handler.setProp('selectMode', false);
};

// Toggle selectMode on or off.
const handleSelectMode = () => {
  handler.setProp('selectMode', !handler.selectMode); 
};

// Toggle excluded status of an item with a given id.
const handleExclude = (id) => {
  handler.setProp('excludedItems', {
    ...handler.excludedItems,
    [id]: !(handler.excludedItems && handler.excludedItems[id]),
  });  
};

// Set header names based on columns and whether selectMode is enabled or not.
const headerNames = Object.keys(headers).slice(0, columns.split(' ').length - (handler.selectMode ? 3 : 2));

  return (
    <>
 
      <Columns sx={{ m: 1 }} spacing={1} columns={columns}>


        {/* list view header columns */}


        {/* spacer column for select mode */}
        {!!handler.selectMode && <Box />}

        {/* column header to toggle select mode */}
        <Switch
          checked={handler.selectMode}
          onClick={handleSelectMode}
          size="small"
        />

        {/* column header to add selected tracks */}
        {!tube.batch?.length && (
          <ConfirmPop
            onChange={(ok) => !!ok && handleBatch()}
            message={`Add ${downloadableItems.length} items from  YouTube to your library?`}
            label="Save items to local storage"
          >
            <Tooltag
              component={TinyButton}
              title="Find all on YouTube"
              icon="YouTube"
            />
          </ConfirmPop>
        )}

        {/* waiting column header when tubeloader is running */}
        {!!tube.batch?.length && <CircularProgress size={18} />}


        {/* list view data header columns */}
        {headerNames.map((key) => (
          <Flex spacing={1}>
            <Nowrap
              bold={key === handler.sortBy}
              hover
              onClick={() => handleSort(key)}
              key={key}
              muted
              small
            >
              {headers[key]}
            </Nowrap>

            {/* <Spacer /> */}
            {key === handler.sortBy && (
              <TinyButton
                deg={handler.sortUp > 0 ? 180 : 0}
                icon="KeyboardArrowDown"
              />
            )}
          </Flex>
        ))}
      </Columns>

      {/* list view rows */}
      {!!pages.visible &&
        pages.visible.map((res) => (
          <Columns sx={{ m: 1 }} spacing={1} columns={columns}>

            {/* track cover art column  */}
            <Avatar src={res.artworkUrl100} alt={res.trackName} />

            {/* row selector checkbox column  */}
            {!!handler.selectMode && (
              <Switch
                checked={
                  !(
                    handler.excludedItems &&
                    handler.excludedItems[res.previewUrl]
                  )
                }
                onClick={() => handleExclude(res.previewUrl)}
                size="small"
              />
            )}

            {/* youtube status indicator column  */}
            <TubeMenu items={pages.items} tube={tube} track={res} />

            {/* track status indicator column */}
            <TinyButton
              icon={
                (audio.src === res.previewUrl &&
                  audio.state.matches('opened.playing')) ||
                tube.pin?.previewUrl === res.previewUrl
                  ? 'VolumeUp'
                  : wrapperTypes[res.wrapperType]
              }
            />

            {/* first column is visible in all viewports, collapsing 
            to show all columns in mobile view  */}
            <Stack sx={{ maxWidth: '80vw', overflow: 'hidden' }}>

              {/* track name */}
              <Nowrap
                muted={!tube.contains(res)}
                bold={
                  (audio.src === res.previewUrl &&
                    audio.state.matches('opened.playing')) ||
                  tube.pin?.previewUrl === res.previewUrl
                }
                hover
                onClick={() => {
                  audio.handlePlay(res.previewUrl, {
                    src: res.previewUrl,
                    Title: res.trackName,
                    trackList: pages.items,
                    ...res,
                  });
                }}
              >
                {res.trackName || res.collectionName}{' '}

                {/* explicitness marker */}
                {res.trackExplicitness === 'explicit' && <sup>E</sup>}{' '}
              </Nowrap>

              {/* columns collapsed in mobile view */}
              {!!small && (
                <Flex spacing={1} sx={{ maxWidth: 'calc(100vw - 160px)' }}>
                  <Nowrap small>

                    {/* artist name  */}
                    <Link onClick={() => handleLookup(res.artistId, 'song', 'collectionName')}>
                      {res.artistName}
                    </Link>{' '}
                    -{' '}

                    {/* album name */}
                    <Link
                      onClick={() => handleLookup(res.collectionId, 'song', 'trackNumber')}
                    >
                      {res.collectionName}
                    </Link>

                  </Nowrap>
                  <Spacer />

                  {/* track price */}
                  <Nowrap
                    hover
                    wrap
                    onClick={() => window.open(res.trackViewUrl)}
                    small
                  >
                    {res.trackPrice}
                  </Nowrap>
                </Flex>
              )}
            </Stack>

            {/* added columns only visible in desktop mode */}
            {!small && (
              <>
                {/* artist name  */}
                <Nowrap onClick={() => handleLookup(res.artistId, 'song', 'collectionName')} hover>{res.artistName}</Nowrap>

                {/* album name/description */}
                <Nowrap onClick={() => handleLookup(res.collectionId, 'song', 'trackNumber')} hover>{res.collectionName || res.description}</Nowrap>

                {/* track price */}
                <Nowrap hover onClick={() => window.open(res.trackViewUrl)}>
                  {res.trackPrice || res.formattedPrice}
                </Nowrap>
              </>
            )}
          </Columns>
        ))}
    </>
  );
};
 
