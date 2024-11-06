---
title: "Role Based Access Control (RBAC) Authorisation in Golang with Permit.io"
date: 2024-11-04
tags: ["projects"]
summary: "What is 'Authorisation', and how to implement a working solution with Permit.io"
canonicalUrl: "https://www.permit.io/blog/role-based-access-control-rbac-authorization-in-golang"
---

When building an application, you need to know who your users are, and what they should have access to.

That’s when “Authentication” (are you who you say you are?) and “Authorisation” (are you allowed to do this thing?) come in to play.

These are two similar but separate problems, each with their own challenges.

Most developers don’t build their own authentication systems. It's not-secure, and more importantly -   not part of your products' core offering. Thus, it's just not worth the effort / time you'll spend building it. 

Authorisation is something traditionally built by developers in-house (Just like authentication was a few years ago), but in recent years, there are  emerging options in the market that allow you to implement it without building it yourself.

In this article we are going to focus on authorisation (authorization for my U.S. friends), covering a step by step integration and implementation with an example Key-Value service, written in the Go programming language.

We are going to build our own naive authorisation system to get a feel for how it all works, and compare this with a production-ready implementation from [Permit.io](http://permit.io).

## What is "Authorisation"?

At some point in the development of any "System" with "Users", you will need some method of determining:

> Is this "User" *actually* *allowed* to do the *thing* they are trying to do?
> 

This is inevitable, whether the "system" you are building is physical (i.e. a Hotel), or virtual (i.e. a Social Network website).

For any sensitive action, we need to make sure that the person performing that action is *allowed* to do the action.
If the scenario is as simple as `if request.IsAuthenticated()`, then congrats, you can end here, you have "authorisation through authentication". **But**, this means that **any user who can authenticate into your system, is also authorised do to anything in your system**. For everything but a simple POC, this won't fly.

If the scenario is more complex, i.e. `if request.GetUser() not in authorisedUsers`, then you are now able to **restrict access to parts of your system**, but you have now inherited a complexity: you need to **store and maintain a list of every single user allowed to perform every action in your system**.
If you have 100 users, and 5 actions in your system (a very small example), this can become a headache to manage very quickly, let alone if you have >1000 users, or more actions to perform.

To simplify this, we can instead assign abilities to an abstract concept (Roles), this is where RBAC comes in.

## What is "Role Based Access Control" (RBAC)

Rather than storing a map of user -> allowed actions, or actions -> allowed user, let's abstract this a little.
Introducing the concept of "Roles": A label you can pin to a whole bunch of users, and check against that.

Benefits:

- Low cardinality
    - You may have millions of users, but you'll rarely need more than a few dozen "roles"
    - This is why the CIA has "security clearance levels", rather than granting access to information individually
- Easier to manage
    - Easier to remove 1 "role" from 1 "user", than updating the 1000s of actions a "user" may have access to
    - This is why the CIA has "security clearance levels", rather than granting access to information individually
- *Semantically* relevant
    - Wherever possible, as a developer your goal is to simplify the system
    - Example: Seeing that a user has the roles of `["intern", "employee", "admin"]`, it is clearer to spot the problem than seeing a user with access to `["receptionDoor1", "receptionDoor2", "cafeDoor3", "floor4Door4", "floor2Door3"]`, if `"floor4Door4"` is your server room

Now that we understand the benefits of simplifying access control through the use of “Roles” users can be assigned to, let’s look at a demo application in Golang.

## Example Application

Let's keep this super simple, and say that you have 2 endpoints to an application that allows users to save and retrieve key-value pairs:

- `GET /v1/map/{key}`
- `POST /v1/map/{key}`

Each "user", once authenticated, can be in one of two groups ("roles"):

- `reader`
- `writer`

"Readers" can **GET**, "Writers" can **POST**, a user can have either or both of these roles.

i.e. If I am a user (”Alice”), and I have the ability to **write**, I should be able to write a value of “world” to a key of “hello”.

If I am a user (”Bob”), and I have the ability to **read**, I should be able to see the value “world” under key “hello” that alice has just written for me.

However, since Bob cannot write, he should not be able to override the value of “world”, nor should he be able to add any new values to our system.

To show how to implement this sort of authorisation control to a system, we are going to start off with a working key-value service for the above, without any access controls in place.

We will then build our own RBAC system given the users and roles we know about and integrate it with our system.

To top it all off, we are then we are going to showcase a scalable, production ready setup built using the [Permit.io](http://Permit.io) Golang SDK for RBAC.

First, our Service setup:

```go
package service

// StorageClient provides access to a key-value map.
type StorageClient interface {
	Get(key string) (value string, exists bool, err error)
	Set(key string, value string) error
}

// Service is an implementation of the key-value service
type Service struct {
	storage StorageClient
}

// Get accepts a user and a key, and returns either the value associated with that key,
// or an error if encountered.
func (s *Service) Get(userID string, key string) (string, error) {
	value, ok, err := s.storage.Get(key)
	if err != nil {
		return "", fmt.Errorf("error getting value for key:%q error:%w", key, err)
	}
	if !ok {
		return "", fmt.Errorf("error getting value for key:%q error:%w", key, Error_NOTFOUND)
	}
	return value, nil
}

// Set accepts a user, key and value, and will attempt to set the value with that key,
// or return an error if encountered.
func (s *Service) Set(userID, key, value string) error {
	err := s.storage.Set(key, value)
	if err != nil {
		return fmt.Errorf("error setting value for key:%q error:%w", key, err)
	}
	return nil
}
```

Using our `StorageClient` interface, and the `Get` and `Set` application APIs, we have the ability to read and write any key-value pair we desire, without any authorisation logic to safeguard access.
Get allows any user to extract the value for a given key, and Set allows any user to write the value at a given key.

Simple, right? Now let’s try and implement our own RBAC!

### Restricting Access to our API

Remember, we now want to restrict access to `Get` and `Set` based on whether the given user is a "reader" or a "writer".
To build an API for checking the authorisation level of the user, we really only care about whether they are or aren't authorised to access the resource.
A good API for this, therefore, would enable us to supply our `userID`, and their intended `action`, and allow the API to resolve the user's `roles`, and the `permitted roles` for each action, and return us `true` or `false`, depending on whether the user can or cannot perform the intended action.

A good interface for this then, would follow:

```go
// AccessClient enables the ability to check authorisation for a given user.
type AccessClient interface {
    Check(userID string, action string) bool
}
```

Popping this into our implementation is quite simple, as an initial validation step for our API:

```go
func (s *Service) Get(userID string, key string) (string, error) {
    if !s.access.Check(userID, "get") {
        return "", Error_UNAUTHORISED
    }
    ...
}
func (s *Service) Set(userID, key, value string) error {
    if !s.access.Check(userID, "set") {
        return Error_UNAUTHORISED
    }
    ...
}
```

For this `AccessClient`to work however, we need an implementation...

### DIY: In-memory RBAC

Those with a keen eye for Go would notice we have defined our authorisation API first, ignoring any eventual implementation.
This is a good way to focus on your API first, without getting too bogged down with how your API implementation should actually work.

To get our heads around the problem, we can look into a simple implementation of this API, using an in-memory map to keep track of our users, the actions that may be performed, and the roles permitted to complete those actions.

Our objects `User` and `Action` :

```go
// User is a user object, containing the roles this user is a member of.
type User struct {
    Roles []string
}

// Action is an action that can be performed, along with the roles allowed to perform this action.
type Action struct {
    PermittedRoles []string
}
```

Our `Check` function, needs to answer the question of `Does the given user have a role, that is permitted to complete the given action?`
In reality, this manifests quite easily as a reverse lookup:

```go
// Check returns true if the user is allowed to perform the action, false otherwise.
func (a *Access) Check(userID string, actionID string) bool {
    user, ok := a.users[userID]
    if !ok {
        return false
    }

    action, ok := a.actions[actionID]
    if !ok {
        return false
    }

    for _, role := range user.Roles {
        if slices.Contains(action.PermittedRoles, role) {
            return true
        }
    }

    return false
}
```

In the above, if the user exists, the action exists, and at least one of the user's roles match with at least one of the action's permitted roles, then we `return true`, and the action is permitted!

Conversely, if the user is unknown, or the action is unknown or none of the user's roles match with any of the action's permitted roles, then we `return false`, and the action is denied, at which point an UNAUTHORISED error is returned to the the caller.

### Flaws with DIY

In practise however, I don’t recommend you to actually use the above DIY approach.
DIY-ing your own authorisation implementation is something that should really only be attempted by the Googles of this world, as there is a good chance you simply will **not have the resources** to do it **correctly**, let alone **quickly**.

Focus on outsourcing the implementation of all elements of your system that are not specifically critical to the value you intend to provide:

- Don't build your own database
- Don't build your own container orchestrator
- Don't build your own authorisation system
- Don't do anything that you don't have to...

### Alternative: RBAC with [permit.io](http://permit.io/)

[Permit.io](https://permit.io/) is an authorisation as a service provider, with a whole suite of features that cover use cases from this simple example, all the way to the largest enterprise applications with millions of users and umpteen levels of complexity.

This solution was easy enough to work with that I could build this example implementation in <30 mins from reading through their docs (ChatGPT could probably do it faster though!)

Conveniently, the Permit Golang SDK also has it's own `Check` function, that is similar to ours:

```go
// PermitClient is the permit.io client interface.
type PermitClient interface {
    Check(user enforcement.User, action enforcement.Action, resource enforcement.Resource) (bool, error)
}
```

For our case, to provide a drop in replacement to our DIY solution, we are going to wrap this function.
The models in this API are:

- "User"
    - Identifiers for a given user to the system
- "Action"
    - The intent for a given call to "Check", in our case this will be "get" or "set"
- "Resource"
    - The domain for which this action is being performed against
    - In our simple example, we do not have a need for this "resource", as we only have a single map domain, but this allows for other rich customisations later on, such as namespaced maps with alternative access controls.

Our wrapper:

```go
// Check returns true if the user is allowed to perform the action, false otherwise.
func (p *Permit) Check(userID string, actionID string) bool {
    user := enforcement.UserBuilder(userID).Build()
    action := enforcement.Action(actionID)
    resource := enforcement.ResourceBuilder("map").Build()

    allowed, err := p.permitClient.Check(user, action, resource)
    if err != nil {
        fmt.Printf("permit error: %s\\n", err.Error())
        return false
    }

    return allowed
}
```

### Our final application

If you want to dive deeper into the code, and run the application yourself (with both DIY and Permit based authorisation), you can follow the steps on [github.com/jamesjarvis/rbac-example](https://github.com/jamesjarvis/rbac-example).

Our test data includes the following users, and their roles:

| UserID | Role: reader | Role: writer |
| --- | --- | --- |
| alice | Y | Y |
| bob |  | Y |
| charli | Y |  |

Our server is a HTTP server running on port `:8080`, so we can perform a simple test by setting a value "world" for key "hello" as user "alice":

```bash
$ curl -H "User: alice" -X POST <http://localhost:8080/v1/map/hello> -d "world"
> world
```

Fantastic, this works! Alice is indeed able to write to the `POST` endpoint, as they have the role of "writer". We can see since they also have the role of "reader", they should also be able to `GET` this value again:

```bash
$ curl -H "User: alice" -X GET <http://localhost:8080/v1/map/hello>
> world
```

But what if Bob tries to read this value?

```bash
$ curl -H "User: bob" -X GET <http://localhost:8080/v1/map/hello>
> UNAUTHORISED
```

Bob cannot perform any GET calls, because Bob does not have the "reader" role, which is required to perform the "get" action. Bob can, however, perform POST requests.

Similarly, our final user Charli does not have the "writer" role, preventing them from accessing the POST endpoint, but since they are a "reader", they can still perform `GET` requests:

```bash
$ curl -H "User: charli" -X GET <http://localhost:8080/v1/map/hello>
> world
```

## Summary

Authorisation is the challenge of answering “Is this User *actually* *allowed* to do the *thing* they are trying to do?”

By focusing on Roles, rather than Users (RBAC), application writers can greatly simplify both their application logic, and the operation of their application.

We have built a working HTTP Key-Value service in Golang, that allows a user to `GET` (read) and `POST` (write) values at a given key.

We have then extended this application to restrict access to these endpoints based on whether the user has the associated role of “reader” or “writer”.

We have explored the pros and cons of two different implementation to this RBAC solution:

- DIY using just the Golang standard library
- Using [Permit.io](http://Permit.io) as our Authentication as a service provider

Phew!

By this point, you should have a decent understanding of how a simple Role Based Access Control (RBAC) implementation can be integrated into your application.

Focusing on "roles" rather than "users", provides an easier abstraction for both yourself as a developer, but also your system administrators, and ultimately, your users themselves.

Finally, another word of caution.

Focus on outsourcing the implementation of all elements of your system that are **not specifically critical to the value you intend to provide**:

- Don't build your own databases
- Don't build your own container orchestrators
- Don't build your own authorisation systems
- Do focus on the core offering of your product

Thanks for reading!
