`28/03/2022`

There we go, I'm starting the development of the app's frontend. I was getting a bit tired of so much design, so I'm
looking forward to it. I'm a bit daunted by it, though --the hardest part of the project begins here.

Anyway, my first objective will be setting up TS and React Router, then integrating the project with the backend and
fetching something. Then, I probably should start creating the views that I have designed, as a sort of MVP --just the
functionality, no styles for now. As I move along, I'll probably need to make adjustments to the backend. I'll write it
down here, including the order in which I think I should create the views:

1. [ ] Basic setup
    - [x] Set up TypeScript
    - [x] Set up React Router
    - [x] Integrate with the backend --create user list view (keep in mind that it most surely won't be used)
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

`29/03/2022`

I've done the basic setup part already. I think I'm going to create the chat list view first, then proceed to create the
user chat view with websockets and all. I'm going to try to do everything with TS from the start, so I'll define
entities as I move forward.

Edit: I've spent a lot of time writing the chat list view in the backend --too much time, in fact. I've fallen prey to
my eagerness to coding thing as they should be done, instead of simply making them functional. Basically, I've tried
using serializers and subqueries, but in the end those approaches were too complicated. Well, at least I've made it and
can start coding the frontend part of it.

Anyway, I should start thinking about Redux soon. Some parts of the app are going to need to share state (mostly about
chat messages and user online status). Therefore, it should become a priority once I have set up the basic WS stuff (
which should be pretty soon). But first, there's that.

Also, now that I'm thinking, the view I've made will probably be useless in the long run. I should have just added info
to the Channel and User ChatSerializers, then added filtering by user and made two calls to the respective list views,
which would have gone to the Redux state. How stupid. But well, this kind of thing is just unavoidable, even if I try (
yesterday I wrote about it). Also, I have a better plan now (the one I've mentioned). Time to set up Redux, then.

I don't have the time to keep coding right now, so I'll write it here. I have to think about how I'm going to handle the
fetching of chat data. It's too messy right now. It requires several ways to fetch them:

1. Initial fetch (when logging in, etc.). Make two calls to the chat list endpoints, which should basic info about
   user/channel and a list of the first 20 messages or so. This can be done through the current ChatViewSets (I just
   need to make some adjustments, such as limiting the number of messages and probably returning more information).
2. Look up older messages: when the user clicks 'show more messages' (or similar) in the chat, more messages should load
   up. This should be done through specific MessageViewSets, to enable pagination (always taking into account the number
   of messages fetched initially).
3. Send/receive message: this is done through WS, so ViewSets don't matter in this case.
