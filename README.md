# plug

A pluggable, personal assistant.

## Overview

The goal of this project is to create a framework for building AI assistants, using [Wit.ai](https://wit.ai).

The framework itself won't have any interface as such, but it will be easy to add one. Initially this project is being built with a [Slack](https://slack.com) bot acting as the front-end interface.

The general flow looks something like this:

```
Interface (Slack Bot) →              Plug             → Interface (Slack Bot)
                                      ↑↓ 
                        [Wit.Ai → Plug → User Plugins] 
```

## Interaction Examples

There a few ideas of the types of interactions/questions/requests that the bot will be able to handle. Some ideas are shown below.

_Note: Some of these examples may be similar implementations, and a lot will be done in the application using this framework, but they are just to give an example of different possibilities._

### Simple Questions

These are simple, one line questions with simple responses. Examples:

```
User: What's the weather like in Tokyo?
Plug: It's a warm 22C right now, with plenty of sun!
```

```
User: Is it morning in London right now?
Plug: Yep, it's 10:31am over there.
```

### Simple Questions Requiring Follow-up

Again, these are relatively simple questions but occasionally the user will miss out a piece of information thats necessary. For example, if the bot isn't yet aware of where the user is:

```
User: Is it raining at the moment?
Plug: Where are you right now?
User: Paris.
Plug: Ah, OK. Yeah, it's raining in Paris. Gonna need an umbrella!
```

### Actions Requiring Persistent State

These are ongoing requests, which may require context and state to be persisted over a number of days/weeks/months etc.

```
User: Could you remind me to update Git tomorrow?
Plug: Sure, will do!

[The next day...]

Plug: Hey, User! Don't forget to update Git!
```

### Long Conversations for Complex Tasks

This is for allowing the bot to help with slightly more complex tasks that requires persistent state and multiple question/answer sequences.

```
User: Plug, can we set up a new AWS stack?
Plug: I would be glad to help!
Plug: First off, how many instances would you like?
User: Can we try 4 EC2 instances, with load balancing.
Plug: No problem.
User: Also, can we set up 2 relational databases.
Plug: Alright, what kind of database?
User: Postgre, please. Could you get that started?
Plug: Sure, I'll start setting it up.

[Time passes...]

User: How's it going, Plug?
Plug: Still setting up the EC2 instances. 58% done so far.
```

### Multi-User Converstations

If there are multiple people talking to the bot at once (as could be the case in Slack), you can really have some interesting interactions.

```
User 1: Plug, could you book a meeting room at 2pm?
Plug: Sure, who's coming to the meeting?
User 2: I'd like an invite please.
User 3: Yeah, I'll be joining as well.
Plug: OK, I'll set the meeting for 2pm with the 3 of you then.

[Later...]

User 2: Actually, I won't be able to make the meeting, Plug.
Plug: Alright, I'll take you off the list.
```
