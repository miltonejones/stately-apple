import React from 'react';
import {
  styled,
  Drawer,
  Stack, 
  Avatar,
  Collapse,
  Box,
  LinearProgress,
  Pagination,
} from '@mui/material';
// import { useMenu } from '../../../machines';
import {
  Nowrap,
  TinyButton,
  Flex,
  Spacer,  
  IconTextField
} from '../../../styled';
import { sorter } from '../../../util/sorter';
import { getPagination } from '../../../util/getPagination';
import { collatePins } from '../../../util/collatePins';

const Layout = styled(Box)(({ small, theme }) => ({
  margin: theme.spacing(1, 2),
  width: small ? "80vw" : 400,
}));


const groupCaptions = {
  Artists: e => e.collectionName,
  Albums: e => e.artistName,
  Generes: e => `${e.artistName} - ${e.collectionName}`,
};

const groupIcons = {
  Artists: 'People',
  Albums: 'Album',
  Generes: 'Selling',
};


const TubeBrowser = ({ handler, small, searchText }) => {
  // const menu = useMenu();
  const selectedItem = !handler.response?.pages
    ? {}
    : handler.response.pages[0];
  const handleClose = () => {
    handler.send({
      type: 'CHANGE',
      key: 'browse',
      value: !handler.browse,
    });
  };
  const handleFilter = (value) => {
    handler.send({
      type: 'CHANGE',
      key: 'filter',
      value
    });
  };
  const handleExpand = (node) => {
    handler.send({
      type: 'CHANGE',
      key: 'expanded',
      value: {
        ...handler.expanded,
        [node]: !(handler.expanded && handler.expanded[node]),
      },
    });
  };
  const handlePlay = (track, items) => {
 
    handler.send({
      type: 'FIND',
      param: track.param,
      track,
      items
    });

    handleClose();
  }
   

  function formatBytesToKB(bytes) {
    const mb = 1024 * 1024;
    if (bytes < mb) {
      return Math.round(bytes / 1024) + 'kb'
    }
    return Math.round(bytes / mb) + 'mb'
  }

  const pins = !handler.filter 
    ? handler.pins 
    : handler.pins.filter(f => (f.title.toLowerCase().indexOf(handler.filter.toLowerCase()) > -1) || 
      (f.artistName.toLowerCase().indexOf(handler.filter.toLowerCase()) > -1) || 
      (f.collectionName.toLowerCase().indexOf(handler.filter.toLowerCase()) > -1))
  const { groups, playlists } = collatePins(pins);

  
  const groupKeys = Object.keys(groups);
  const diskUsed = JSON.stringify(handler.pins).length;
  // const notExpanded =!handler.expanded || !Object.values(handler.expanded).find(value => !!value)

 
  return (
    <Drawer anchor="left" onClose={handleClose} open={handler.browse}>
      {/* {JSON.stringify(handler.expanded)} */}
    {!handler.state.can('FIND') && <>The librarian is busy right now. Try again later.</>}
      <Flex
        spacing={1}
        sx={{ 
          p: 1,
        }}
      >
        <TinyButton icon="YouTube" />
        <Nowrap small>Saved videos</Nowrap>
        <Spacer />
          <TinyButton onClick={() => handleClose()} icon="Close" />
      </Flex>


      <Flex sx={{
        p: 1
      }}>
        <IconTextField 
          endIcon={<TinyButton onClick={() => handleFilter("")} icon={!!handler.filter ? "Close" : "Search"} />}
          value={handler.filter}
          onChange={e => handleFilter(e.target.value)}
          size="small"
          label="Filter"
          fullWidth
          />
      </Flex>
 
      <Layout data-testid="test-for-TubeBrowser" small={small}>
        {groupKeys 
        .map((key) => (
          <Stack>


            <Flex spacing={1}>
              <TinyButton icon={groupIcons[key]} 
              
              color={ handler.expanded && handler.expanded[key] ? "error" : "inherit"}
              />
              <Nowrap  muted={!(handler.expanded && handler.expanded[key])} small hover onClick={() => handleExpand(key)}>
                {key}
              </Nowrap>
            </Flex>
            
            <Collection 
              groups={groups}
              groupKey={key}
              handler={handler}
              searchText={searchText}
              handlePlay={handlePlay}
              handleExpand={handleExpand}
              selectedItem={selectedItem}
            /> 

 

          </Stack>
        ))}


        <Stack>


          <Flex muted={!(handler.expanded && handler.expanded.lists)} spacing={1}>
            <TinyButton icon="QueueMusic" />
            <Nowrap small hover onClick={() => handleExpand("lists")}>
              Playlists
            </Nowrap>
          </Flex>

                    

          <Collapse in={handler.expanded && handler.expanded.lists}>
              {/* category collections */}


              {Object.keys(playlists).map((cat) => (

                <Stack sx={{ ml: 2 }}>
                  <Flex spacing={1}>
                    <TinyButton
                      icon="KeyboardArrowDown"
                      deg={
                        handler.expanded && handler.expanded[`lists/${cat}`]
                          ? 0
                          : 270
                      }
                    />
                    <Nowrap
                      small
                   
                      hover
                      onClick={() => handleExpand(`lists/${cat}`)}
                    >
                      {' '}
                      {cat}
                    </Nowrap>
                  </Flex>

                  <Collapse
                    in={handler.expanded && handler.expanded[`lists/${cat}`]}
                  >
                    {/* collection tracks */}
                    {playlists[cat].map((item) => (
                      <CollectionItem searchText={searchText} group={playlists[cat]} handler={handler} item={item} handlePlay={handlePlay} selectedItem={selectedItem} 
                        key={item.tubekey} /> 
                      
                    ))}
                  </Collapse>


                </Stack>
              ))}




            </Collapse>



            <Stack sx={{mt: 4}}>
              <Nowrap small muted > {formatBytesToKB(diskUsed)} of 5 MB used</Nowrap>
              <LinearProgress variant="determinate" value={diskUsed / 500000} />
            </Stack>
{/* {diskUsed / 500} */}
           

        </Stack>
        <pre>
    {JSON.stringify(handler.dynamoItems,0,2)}
    </pre>
      </Layout>
    </Drawer>
  );
};
TubeBrowser.defaultProps = {};
export default TubeBrowser;

const Collection = ({ 
  groups, 
  groupKey, 
  handler, 
  searchText, 
  handlePlay,
  handleExpand,
  selectedItem
 }) => {


  if (!(handler.expanded && handler.expanded[groupKey])) {
    return <i />
  } 

  const pageKey = groupKey + '_page';
  
  const pages = getPagination(Object.keys(groups[groupKey]).sort(), {
    page: handler[pageKey] || 1, 
    pageSize: 10,
  });

  const handlePage = (value) => {
    handler.send({
      type: 'CHANGE',
      key: pageKey,
      value
    });
  };

  return (

    <Collapse in={handler.expanded && handler.expanded[groupKey]}>
      {/* category collections */}


      {pages.pageCount > 1  && <Pagination
        count={Number(pages.pageCount)}
        page={Number(pages.page)}
        onChange={(a, b) =>
          handlePage(b)
        }
      />}


      {pages.visible
      .map((groupItem) => (

        <Stack sx={{ ml: 2 }}>
          <Flex spacing={1}>
            <TinyButton
              icon="KeyboardArrowDown"
              deg={
                handler.expanded && handler.expanded[`${groupKey}/${groupItem}`]
                  ? 0
                  : 270
              }
            />
            <Nowrap
              small
            
              hover
              onClick={() => handleExpand(`${groupKey}/${groupItem}`)}
            >
              {' '}
              {groupItem}
            </Nowrap>
          </Flex>

          <Collapse
            in={handler.expanded && handler.expanded[`${groupKey}/${groupItem}`]}
          >
            {/* collection tracks */}
            {handler.expanded && handler.expanded[`${groupKey}/${groupItem}`] && 
            groups[groupKey][groupItem]
            .sort(sorter('trackNumber'))
            .map((item) => (
              <CollectionItem 
                searchText={searchText} 
                group={groups[groupKey][groupItem]} 
                handler={handler} 
                item={item} 
                caption={groupCaptions[groupKey]}
                handlePlay={handlePlay} 
                selectedItem={selectedItem} 
                key={item.tubekey} /> 
              
            ))}
          </Collapse>


        </Stack>
      ))}




    </Collapse>

  )
}



const CollectionItem = ({ handler, caption, searchText, item, handlePlay, group, selectedItem }) => {

  return  <Flex sx={{ ml: 2 }} spacing={1}>
  <Avatar
    src={item.artworkUrl100}
    alt={item.title}
    sx={{ width: 32, height: 32 }}
  />
  <Stack>
    <Nowrap
      color={
        selectedItem.href === item.tubekey
          ? 'error'
          : 'inherit'
      }
      bold={selectedItem.href === item.tubekey}
      onClick={() => handlePlay(item, group)}
      hover
      small
    >
      {item.title} 
    </Nowrap>
    {!!caption && <Nowrap  hover onClick={() => searchText(item.artistName)} muted small>
      {caption(item)}
    </Nowrap>}
  </Stack>
</Flex>

}
