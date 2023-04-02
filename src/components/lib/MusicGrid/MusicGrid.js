import React from 'react';
import {
  styled,
  Avatar,
  Menu,
  MenuItem,
  Card,
  Pagination,
  Collapse,
  Stack,
  Box,
  Badge,
  Breadcrumbs, 
} from '@mui/material';
import {
  Nowrap,
  TinyButton,
  Flex,
  Spacer,
  Pill,
  TinyButtonGroup,
  Columns,
  // TextIcon
} from '../../../styled';
import { useMenu } from '../../../machines';
import { getPagination } from '../../../util/getPagination';
import TubeMenu from '../TubeMenu/TubeMenu';

const Layout = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 2, 24, 2),
}));

const Frame = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  borderRadius: 0,
}));

const wrapperTypes = {
  track: "MusicNote",
  collection: "Album",
  artist: "Person",
  audiobook: "LocalLibrary",
  podcast: "Podcasts",
  "music-video": "MusicVideo",
  "tv-season": "PersonalVideo",
  movie:"Videocam",
  ebook: "MenuBook"

}


const headers = {
  wrapperType: '',
  trackName: 'Title',
  artistName: 'Artist',
  collectionName: 'Album',
  // primaryGenreName: 'Genre',
  trackPrice: 'Price',
  // formattedPrice: 'Price'
};

const SortMenu = ({ handler, handleSort, onChange }) => {
  const menu = useMenu(onChange);

  return (
    <>
      <Pill sx={{ gap: 1 }} onClick={menu.handleClick} active>
        <TinyButton
          icon="SortByAlpha"
          sx={{ color: 'inherit' }}
          color="inherit"
        />
        <Nowrap tiny hover bold sx={{ color: 'white' }}>
          {headers[handler.sortBy]}
        </Nowrap>
        <TinyButton
          deg={handler.sortUp > 0 ? 180 : 0}
          color="inherit"
          icon="KeyboardArrowDown"
        />
      </Pill>
      <Menu
        anchorEl={menu.anchorEl}
        open={Boolean(menu.anchorEl)}
        onClose={menu.handleClose()}
      >
        {Object.keys(headers).map((key) => (
          <MenuItem key={key} onClick={menu.handleClose(key)}>
            <Flex sx={{ width: 160 }} bold={key === handler.sortBy} hover>
              {headers[key]}
              <Spacer />
              {key === handler.sortBy && (
                <TinyButton
                  deg={handler.sortUp > 0 ? 180 : 0}
                  icon="KeyboardArrowDown"
                />
              )}
            </Flex>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

const MusicGrid = ({ handler, tube, audio }) => {
  const { results = [] } = handler.results || {};
  const { isIdle } = handler;
  const isOpen = audio.state.matches('opened');
  const songList = results?.filter(f => f.collectionType !== 'Album' && f.artistType !== 'Artist');
  const songNode = results?.find(f => f.collectionType === 'Album' || f.artistType === 'Artist');
  const isAlbum = !!songNode?.collectionPrice;
  const prefixLabel = isAlbum ? "album" : "artist";


  const pages = getPagination(songList, {
    page: handler.page,
    sortBy: handler.sortBy,
    sortUp: handler.sortUp,
    pageSize: 25,
  });

  const handleLookup = (id, entity) => {
    return handler.send({
      type: 'LOOKUP',
      entity, id
    })
  }

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

  return (
    <Collapse in={!isIdle}>
      {!!results.length && (
        <Flex sx={{ p: (t) => t.spacing(0, 4) }} spacing={2}>


          {!!handler.lookupType && !!songNode && <Flex spacing={1}>
           {!!songNode.artworkUrl100 && <Avatar src={songNode.artworkUrl100} alt={songNode.collectionName}/>}
            <Breadcrumbs aria-label="breadcrumb">
                <Nowrap onClick={() => handler.send('RESET')} hover>
                  Tracks like "{handler.param}"
                </Nowrap>
              <Nowrap>
              {prefixLabel}: <b>{songNode.collectionName || songNode.artistName}</b>
              </Nowrap>
              </Breadcrumbs>
            </Flex>}


         {pages.pageCount > 1  && <Pagination
            count={Number(pages.pageCount)}
            page={Number(handler.page)}
            onChange={(a, b) =>
              handler.setProp({
                target: {
                  name: 'page',
                  value: b,
                },
              })
            }
          />}

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
          <SortMenu handler={handler} onChange={(e) => !!e && handleSort(e)} />
          <Nowrap small muted>
            {pages.startNum} to {pages.lastNum} of {pages.itemCount} results
          </Nowrap>
        </Flex>
      )}

      <Layout data-testid="test-for-MusicGrid">
        {!!results.length && (
          <Card
            sx={{
              m: 2,
              maxWidth: '100vw', 
              transition: 'height 0.2s linear',
              height: `calc(100vh - ${isOpen ? "300px" : "220px"})`,
              overflow: 'auto',
            }}
          >
            {!!results && (
              <View
                pages={pages}
                audio={audio}
                tube={tube}
                handleSort={handleSort}
                handleLookup={handleLookup}
                handler={handler}
              />
            )}
        {/* <pre>
        {JSON.stringify(results,0,2)}
        </pre> */}
          </Card>
        )}
      </Layout>
    </Collapse>
  );
};
 
MusicGrid.defaultProps = {};
export default MusicGrid;

const GridView = ({ pages, handleLookup, audio, tube }) => {
  const columns = '1fr 1fr 1fr 1fr 1fr';
  const maxWidth = 240;
  return (
    <Columns sx={{ m: 1 }} spacing={1} columns={columns}>
      {!!pages.visible &&
        pages.visible.map((res) => (
          <Frame
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
                {/* {res.trackExplicitness === 'explicit' && <Pill>e</Pill>} */}
               <Badge  sx={{ '& .MuiBadge-badge': { borderRadius: 1 }}} badgeContent={res.trackExplicitness === 'explicit' ? "E" : 0} color="error">
                
                <Nowrap
                color={tube.contains(res) ? "primary" : "inherit"}
                  bold={
                    audio.src === res.previewUrl &&
                    audio.state.matches('opened.playing')
                  }
                  sx={{ maxWidth }}
                >
                  {res.trackName || res.collectionName} 
                </Nowrap>
                
                </Badge> 

                <Spacer />

                <TubeMenu  tube={tube} track={res} />
              </Flex>

              <Nowrap
                hover
                onClick={() => handleLookup(res.collectionId, 'song')}
              sx={{ maxWidth }} width="100%" small>
                {res.collectionName || 'unknown'}
              </Nowrap>
             <Flex>
             <Nowrap
               hover
               onClick={() => handleLookup(res.artistId, 'song')}
             sx={{ maxWidth }} width="100%" small muted>
                {res.artistName || 'unknown'}
              </Nowrap>
              <Spacer/>
              <Nowrap 
                onClick={() => window.open(res.trackViewUrl)} hover wrap small muted>
                ${res.trackPrice}
              </Nowrap>
             </Flex>
            </Stack>
          </Frame>
        ))}
    </Columns>
  );
};

const ListView = ({ pages, audio, tube, handleSort, handleLookup, handler }) => {
  const columns = '40px 24px 24px 1fr 1fr 1fr 1fr';
  return (
    <>
      <Columns sx={{ m: 1 }} spacing={1} columns={columns}>
        <Box />
        <Flex />
        {Object.keys(headers).map((key) => (
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

      {!!pages.visible &&
        pages.visible.map((res) => (
          <Columns sx={{ m: 1 }} spacing={1} columns={columns}>
            <Avatar src={res.artworkUrl100} alt={res.trackName} />

            <TinyButton icon={ audio.src === res.previewUrl &&
                audio.state.matches('opened.playing') 
                ? "VolumeUp" 
                : wrapperTypes[ res.wrapperType ]} />
            
            <TubeMenu tube={tube} track={res} />

            <Nowrap
              color={tube.contains(res) ? "primary" : "inherit"}
              bold={
                audio.src === res.previewUrl &&
                audio.state.matches('opened.playing')
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
              {res.trackExplicitness === 'explicit' && <sup>E</sup>}{' '}
            </Nowrap>

            <Nowrap
            hover
            onClick={() => handleLookup(res.artistId, 'song')}
            >{res.artistName}</Nowrap>

            <Nowrap
            hover
            onClick={() => handleLookup(res.collectionId, 'song')}
            >{res.collectionName || res.description}</Nowrap>

            {/* <Nowrap>{res.primaryGenreName}</Nowrap> */}
            <Nowrap hover
              onClick={() => window.open(res.trackViewUrl)}
            >{res.trackPrice || res.formattedPrice}</Nowrap>

          </Columns>
        ))}
    </>
  );
};

/**
 *
 */
