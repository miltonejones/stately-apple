import React from 'react';
import {
  styled,
  Drawer,
  Stack, 
  Avatar,
  Collapse,
  Box,
  LinearProgress
} from '@mui/material';
// import { useMenu } from '../../../machines';
import {
  Nowrap,
  TinyButton,
  Flex,
  Spacer,  
} from '../../../styled';
import { sorter } from '../../../util/sorter';

const Layout = styled(Box)(({ theme }) => ({
  margin: theme.spacing(1, 2),
  width: 400,
}));

const TubeBrowser = ({ handler }) => {
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
  }
   
  const groupIcons = {
    Artists: 'People',
    Albums: 'Album',
    Generes: 'Sell',
  };
  function formatBytesToKB(bytes) {
    return Math.round(bytes / 1024) + ' KB';
  }
  
  const groupKeys = Object.keys(handler.groups);
  const diskUsed = JSON.stringify(handler.pins).length;
  // const notExpanded =!handler.expanded || !Object.values(handler.expanded).find(value => !!value)
  return (
    <Drawer anchor="left" onClose={handleClose} open={handler.browse}>
      {/* {JSON.stringify(handler.expanded)} */}
    
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
      <Layout data-testid="test-for-TubeBrowser">
        {groupKeys 
        .map((key) => (
          <Stack>


            <Flex spacing={1}>
              <TinyButton icon={groupIcons[key]} />
              <Nowrap  muted={!(handler.expanded && handler.expanded[key])} small hover onClick={() => handleExpand(key)}>
                {key}
              </Nowrap>
            </Flex>

            <Collapse in={handler.expanded && handler.expanded[key]}>
              {/* category collections */}


              {Object.keys(handler.groups[key])
              .sort()
              .map((cat) => (

                <Stack sx={{ ml: 2 }}>
                  <Flex spacing={1}>
                    <TinyButton
                      icon="KeyboardArrowDown"
                      deg={
                        handler.expanded && handler.expanded[`${key}/${cat}`]
                          ? 0
                          : 270
                      }
                    />
                    <Nowrap
                      small
                   
                      hover
                      onClick={() => handleExpand(`${key}/${cat}`)}
                    >
                      {' '}
                      {cat}
                    </Nowrap>
                  </Flex>

                  <Collapse
                    in={handler.expanded && handler.expanded[`${key}/${cat}`]}
                  >
                    {/* collection tracks */}
                    {handler.groups[key][cat]
                    .sort(sorter('trackNumber'))
                    .map((item) => (
                      <CollectionItem group={handler.groups[key][cat]} handler={handler} item={item} handlePlay={handlePlay} selectedItem={selectedItem} 
                        key={item.tubekey} /> 
                      
                    ))}
                  </Collapse>


                </Stack>
              ))}




            </Collapse>


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


              {Object.keys(handler.playlists).map((cat) => (

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
                    {handler.playlists[cat].map((item) => (
                      <CollectionItem group={handler.playlists[cat]} handler={handler} item={item} handlePlay={handlePlay} selectedItem={selectedItem} 
                        key={item.tubekey} /> 
                      
                    ))}
                  </Collapse>


                </Stack>
              ))}




            </Collapse>



            <Stack sx={{mt: 4}}>
              <Nowrap small muted > {formatBytesToKB(diskUsed)} of 400 KB used</Nowrap>
              <LinearProgress variant="determinate" value={diskUsed / 4000} />
            </Stack>

           

        </Stack>
        {/* <pre>
    {JSON.stringify(handler.playlists,0,2)}
    </pre> */}
      </Layout>
    </Drawer>
  );
};
TubeBrowser.defaultProps = {};
export default TubeBrowser;

const CollectionItem = ({ handler, item, handlePlay, group, selectedItem }) => {

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
    <Nowrap muted small>
      {item.artistName}
    </Nowrap>
  </Stack>
</Flex>

}
