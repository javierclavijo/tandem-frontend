/** @jsxImportSource @emotion/react */

import React from 'react';
import { useParams } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { Plus } from 'iconoir-react';
import { css } from '@emotion/react';
import ReactModal from 'react-modal';
import { listContainerCss, listContainerCssMobile } from './styles';
import ChatListFilter from './list/ChatListFilter';
import ChatListElements from './list/ChatListElements';
import { useChatList } from './hooks';
import useAuth from '../auth/AuthContext';
import Button from '../../components/Button';
import { colors } from '../../styles/variables';
import { modal } from '../../styles/components';
import ChannelCreationForm from './ChannelCreationForm';

function ChatList() {
  const params = useParams();
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });

  const [filter, setFilter] = React.useState<string>('');

  const { data } = useChatList();
  const { user } = useAuth();

  const [isChannelCreationModalOpen, setIsChannelCreationModalOpen] = React.useState<boolean>(false);

  return (
    <>
      <section css={isDesktop ? listContainerCss : listContainerCssMobile}>
        <ChatListFilter setFilter={setFilter} />
        {data && user
          ? <ChatListElements data={data} filter={filter} selectedId={params.id} userId={user?.id} />
          : null}
        <div css={css`
                  position: absolute;
                  background-color: ${colors.PRIMARY};
                  border-radius: 50%;
                  padding: 0.25rem;
                  bottom: 0;
                  right: 0;
                  margin: 1rem;
                  z-index: 10;
                `}
        >
          <Button visible onClick={() => setIsChannelCreationModalOpen(true)}>
            <Plus height="2rem" width="2rem" color={colors.WHITE} />
          </Button>
        </div>
      </section>
      <ReactModal
        isOpen={isChannelCreationModalOpen}
        onRequestClose={() => setIsChannelCreationModalOpen(false)}
        contentLabel="Add a new language"
        style={modal}
      >
        <h3 css={css`
                  margin-bottom: 1rem;
                  color: ${colors.DARK};
                `}
        >
          Create a new channel
        </h3>
        <ChannelCreationForm closeModal={() => setIsChannelCreationModalOpen(false)} />
      </ReactModal>
    </>
  );
}

export default ChatList;
