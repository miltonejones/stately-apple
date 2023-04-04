import React from 'react';
import {
  styled,
  Avatar, 
  MenuItem,
  Card,
  Pagination,
  Collapse,
  Stack,
  Box, 
  Breadcrumbs, 
  CircularProgress,
  TablePagination,
  Switch,
  Link
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
  Tooltag
} from '../../../styled';
import { useMenu } from '../../../machines';
import { getPagination } from '../../../util/getPagination';
import TubeMenu from '../TubeMenu/TubeMenu';





const CollapsiblePagination = ({ pages, page, collapsed, onChange }) => {
  if (collapsed) {
    return (
      <TablePagination
        sx={{
          padding: 0,
          borderBottom: 0, 
        }}
        count={Number(pages.itemCount)}
        page={page - 1}
        rowsPerPage={pages.pageSize}
        rowsPerPageOptions={[]}
        onPageChange={(a, num) => onChange(num + 1)}
      />
    );
  }
  return (
    <Pagination
      count={Number(pages.pageCount)}
      page={page}
      onChange={(a, num) => onChange(num)}
    />
  );
};



const Layout = styled(Box)(({ small, theme }) => ({
  padding: theme.spacing(0, small ? 0 : 2, 24, small ? 0 : 2),
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

const SortMenu = ({ handler, small, handleSort, onChange }) => {
  const menu = useMenu(onChange);

  return (
    <>
      <Pill sx={{ gap: 1 }} onClick={menu.handleClick} active>
        <TinyButton
          icon="SortByAlpha"
          sx={{ color: 'inherit' }}
          color="inherit"
        />
      {!small && (<>
        <Nowrap tiny hover bold sx={{ color: 'white' }}>
          {headers[handler.sortBy]}
        </Nowrap>
        <TinyButton
          deg={handler.sortUp > 0 ? 180 : 0}
          color="inherit"
          icon="KeyboardArrowDown"
        />
      </>)}
      </Pill>
      <FlexMenu
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
      </FlexMenu>
    </>
  );
};

const MusicGrid = ({ handler, tube, audio, small }) => {
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
  const openHeight = small ? '280px' : '300px';
  const closedHeight = small ? '190px' : '200px';

  return (
    <Collapse in={!isIdle}>
      {!!results.length && (
        <Flex sx={{ p: (t) => t.spacing(0, small ? 2 : 4) }} spacing={2}>


          {!!handler.lookupType && !!songNode && <Flex spacing={1}>
           {!!songNode.artworkUrl100 && <Avatar src={songNode.artworkUrl100} alt={songNode.collectionName}/>}



            <Breadcrumbs aria-label="breadcrumb">
               <Nowrap small={small} onClick={() => handler.send('RESET')} hover>
                   {!small && <>Tracks like</>} "{handler.param}"
                </Nowrap>
              <Nowrap small={small}>
              {!small && <>{prefixLabel}</>}: <b>{songNode.collectionName || songNode.artistName}</b>
              </Nowrap>
              </Breadcrumbs>


            </Flex>}


         {pages.pageCount > 1  && <CollapsiblePagination
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
          <SortMenu small={small} handler={handler} onChange={(e) => !!e && handleSort(e)} />
          {!small && <Nowrap small muted>
            {pages.startNum} to {pages.lastNum} of {pages.itemCount} results
          </Nowrap>}
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

const GridView = ({ pages, handleLookup, audio, small, tube }) => {
  const columns = small ? "1fr 1fr" : '1fr 1fr 1fr 1fr 1fr';
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


                {/* track name */}
                <Nowrap
                color={tube.contains(res) ? "error" : "inherit"}
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

                <TubeMenu items={pages.items} tube={tube} track={res} />
              </Flex>

              {/* album name */}
              <Nowrap
                hover
                onClick={() => handleLookup(res.collectionId, 'song')}
              sx={{ maxWidth }} width="100%" small>
                {res.collectionName || 'unknown'}
              </Nowrap>

             <Flex>
              {/* artist name */}
             <Nowrap
               hover
               onClick={() => handleLookup(res.artistId, 'song')}
             sx={{ maxWidth }} width="100%" small muted>
                {res.artistName || 'unknown'}
              </Nowrap>
              <Spacer/>

              {/* track price */}
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

const ListView = ({ pages, audio, tube, small, handleSort, handleLookup, handler }) => {

 
  const coreCols = handler.selectMode ? "40px 40px 24px 24px 1fr" : '40px 24px 24px 1fr';
  const columns = coreCols + ( small ? "" : " 1fr 1fr 1fr")

  const downloadableItems = pages.items?.filter(item => !(handler.excludedItems && handler.excludedItems[item.previewUrl]));

  const handleBatch = () => {
    
    const batch = downloadableItems?.map(item => ({
      ...item,
      param: `${item.trackName} ${item.artistName}`
    }));

    tube.send({
      type: 'BATCH',
      batch
    })
  }

  const handleSelectMode = () => {
    handler.setProp({
      target: {
        name: "selectMode",
        value: !handler.selectMode
      }
    })
  }

  const handleExclude = (id) => {
    handler.setProp({
      target: {
        name: "excludedItems",
        value: {
          ...handler.excludedItems,
          [id]: !(handler.excludedItems && handler.excludedItems[id])
        }
      }
    })
  }

  const headerNames = Object.keys(headers).slice(0, columns.split(' ').length - (handler.selectMode ? 3 : 2))


  return (
    <>
    {/* [{JSON.stringify(tube.pin)}] */}
      <Columns sx={{ m: 1 }} spacing={1} columns={columns}>

        {!!handler.selectMode && <Box />}

        <Switch checked={handler.selectMode} onClick={handleSelectMode} size="small" />
        

       {!tube.batch && <ConfirmPop
       onChange={ok => !!ok && handleBatch()}
        message={`Add ${downloadableItems.length} items from  YouTube to your library?`}
        label="Save items to local storage" 
        ><Tooltag component={TinyButton} title="Find all on YouTube" icon="YouTube" /></ConfirmPop>}
      {!!tube.batch && <CircularProgress size={18} />}


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

      {!!pages.visible &&
        pages.visible.map((res) => (
          <Columns sx={{ m: 1 }} spacing={1} columns={columns}>
            <Avatar src={res.artworkUrl100} alt={res.trackName} />

           {!!handler.selectMode && <Switch
            checked={!(handler.excludedItems && handler.excludedItems[res.previewUrl])}
            onClick={() => handleExclude(res.previewUrl)}
            size="small" />}

            <TubeMenu items={pages.items} tube={tube} track={res} />

            <TinyButton icon={ 
               (audio.src === res.previewUrl &&
                audio.state.matches('opened.playing')) || 
                tube.pin?.previewUrl === res.previewUrl
                ? "VolumeUp" 
                : wrapperTypes[ res.wrapperType ]} />
            

            {/* track name */}
            <Stack sx={{ maxWidth: '80vw', overflow: 'hidden' }}>
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
                {res.trackExplicitness === 'explicit' && <sup>E</sup>}{' '}
              </Nowrap>
              {!!small && <Flex spacing={1} sx={{ maxWidth: 'calc(100vw - 160px)'}}>
                  <Nowrap small><Link onClick={() => handleLookup(res.artistId, 'song')}>{res.artistName}</Link> - <Link  onClick={() => handleLookup(res.collectionId, 'song')}>{res.collectionName}</Link></Nowrap>
                  <Spacer />
                  <Nowrap hover wrap
                    onClick={() => window.open(res.trackViewUrl)}
                    small>{res.trackPrice}</Nowrap>
              </Flex>}
            </Stack>
            
            
            {!small && <>
              {/* artist name  */}
              <Nowrap
              hover
             
              >{res.artistName}</Nowrap>

              {/* album name/description */}
              <Nowrap
              hover
            
              >{res.collectionName || res.description}</Nowrap>

                {/* track price */}
              <Nowrap hover
                onClick={() => window.open(res.trackViewUrl)}
              >{res.trackPrice || res.formattedPrice}</Nowrap>
 
            </>}

          </Columns>
        ))}
    </>
  );
};

/**
 *
 */
