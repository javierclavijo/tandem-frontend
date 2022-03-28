`28/03/2022`

There we go, I'm starting the development of the app's frontend. I was getting a bit tired of so much design, so I'm
looking forward to it. I'm a bit daunted by it, though --the hardest part of the project begins here.

Anyway, my first objective will be setting up TS and React Router, then integrating the project with the backend and
fetching something. Then, I probably should start creating the views that I have designed, as a sort of MVP --just the
functionality, no styles for now. As I move along, I'll probably need to make adjustments to the backend. I'll write it
down here, including the order in which I think I should create the views:

1. [ ] Basic setup
    - [x] Set up TypeScript
    - [ ] Set up React Router
    - [ ] Integrate with the backend --create user list view (keep in mind that it most surely won't be used)
    - [ ] Set up base async stuff, research how it all works
2. Create basic views
    - [ ] Chat list
    - [ ] Chat
    - [ ] Home
    - [ ] Search
    - [ ] User detail
    - [ ] Channel detail

I should take into account that I must avoid coding stuff that is not going to be used in the end project. I already
wasted some time coding such things in the backend (e.g. some controllers), only to realise that they weren't going to
be used anyway. For example, coding a detail view with a form that sends all the data at once would be a waste of time.

Given the fact that today I won't have the time to start coding, I'm going to go over the views I've mentioned to plan a
bit further, including additional functionalities, the changes that I'll probably have to perform in the backend, etc.

### Chat list

- Description: shows list of chats for the user as a list of links, ordered by latest message desc.
- Backend: introduce a view in UserViewSet to fetch all user and channel chats for the user.
- Additional functionalities:
    - Show latest message: this would be nice, although not really of vital importance (I could remove it from the
      design if needed). The difficulty here would be updating the messages as they're sent, which should not be too
      hard if I'm using Redux.
    - Delete chat: this is more superfluous, and not in the design. It probably would require too much work in the
      backend to be worth it.

### Chat

- Description: at its most basic, a list of messages paginated and ordered by date desc, with an input box to send
  messages.
- Backend:
    - Chat views: set order (time sent desc) and default pagination (20 or so).
    - Send message: create ViewSets to manage messages. I thought I should be able to create messages from chat views,
      but I don't really see how right now.
- Additional functionalities:
    - Show older messages: make a call to the chat view with pagination offset.
    - Delete message, edit message, etc.: I shouldn't worry about this right now, but it shouldn't be too hard.
    - Async stuff: this *is* critical, but nevertheless I think that I can do without it at first. Once the basic views
      are made, though, it should be priority number one.

### Home

- Description: a list of active friend, a list of channels with active members and a list of recommended users and
  channels.
- Backend: I feel like this one will be a bit of a pain in the long run. Each list should have its own endpoint, or else
  the "show more" links will be harder to implement. At first, however, users and channels should just be selected
  randomly.
    - Active friends: this will need an 'online' attribute of sorts in the backend. Or else, it should be set at runtime
      somehow --it will need to be async in the end. I really should just look it up somewhere.
    - Active channels: same.
    - Recommended users: a list of randomly selected users that aren't friends with the users
    - Recommended channels: and a list of channels that the user is not a member of. Backend-wise, it cannot be the same
      endpoint as recommended users, as that would need a common serializer or something (which would be a pain).

Anyway, I'm leaving it here. I should note, however, that I'm considering to implement the async stuff earlier. The
later I implement it, the more I'll have to do later, and the more unused code that I'll waste time writing. So I'll
update the to-do list to reflect that.