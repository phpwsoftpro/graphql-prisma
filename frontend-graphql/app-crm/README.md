[![Cover Image](https://refine.ams3.cdn.digitaloceanspaces.com/example-readmes/CRM/crm-readme-temp.png "Cover Image")](https://github.com/refinedev/refine)

<div align="center">
    <a href="https://refine.dev">Home Page</a> |
    <a href="https://discord.gg/refine">Discord</a> |
    <a href="https://refine.dev/examples/">Examples</a> |
    <a href="https://refine.dev/blog/">Blog</a> |
    <a href="https://refine.dev/docs/">Documentation</a>
</div>
</div>

<br />
<br />

<div align="center">Build your React-based internal tools, admin panels, dashboards, B2B apps with flexibility in mind.<br>An open source, headless web application framework developed with flexibility in mind.

<br />
<br />

[![Discord](https://img.shields.io/discord/837692625737613362.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/refine)
[![Twitter Follow](https://img.shields.io/twitter/follow/refine_dev?style=social)](https://twitter.com/refine_dev)

<a href="https://www.producthunt.com/posts/refine-3?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-refine&#0045;3" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=362220&theme=light&period=daily" alt="refine - 100&#0037;&#0032;open&#0032;source&#0032;React&#0032;framework&#0032;to&#0032;build&#0032;web&#0032;apps&#0032;3x&#0032;faster | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

</div>

## About

⭐ Check out the live demo of the application [here](https://example.crm.refine.dev/).

This is a complete CRM (Customer Relationship Management) example project built using [refine](https://refine.dev/) and [Ant Design](https://ant.design/). It provides a set of tools and features to manage customer data, track interactions, and streamline business processes.

The application includes features such as dashboard analytics, a calendar for scheduling appointments, a scrum board for task management, and CRUD operations for managing companies, contacts, and quotes.

refine is a React-based powerful framework for building low-code applications. It is primarily focused on implementing data-heavy apps such as internal tools, dashboards, admin panels, and storefronts. It comes with a core package that segregates app concerns like data handling, authentication, access control, etc., into React contexts. It also supports integration with industry standard backend systems such and UI frameworks. It is highly customizable and extensible.

## Features

**Dashboard**: Gain insights into your business with interactive charts and analytics.

**Calendar**: Schedule and manage appointments, meetings, and events.

**Scrumboard**: Organize and track tasks using a Kanban-style board.

**Companies**: Create, update, and delete company records.

**Contacts**: Manage your customer contacts efficiently.

**Quotes**: Generate and manage quotes for your clients.

**Administration**: Configure application settings and user roles.

<br>

![Product Edit Page](https://refine.ams3.cdn.digitaloceanspaces.com/example-readmes/dashboard.png "Product Edit Page")

<br>

![Dashboard Page](https://refine.ams3.cdn.digitaloceanspaces.com/example-readmes/companies.png "Dashboard Page")

<br>

![Product List Page](https://refine.ams3.cdn.digitaloceanspaces.com/example-readmes/contacts.png "Product List Page")

<br>

![Product Edit Page](https://refine.ams3.cdn.digitaloceanspaces.com/example-readmes/sales-pipeline.png "Product Edit Page")
<br>

![Product Edit Page](https://refine.ams3.cdn.digitaloceanspaces.com/example-readmes/login.png "Product Edit Page")

## Company API Endpoints

### 1. List Companies

- **Endpoint:** `GET /companies`
- **Returns:**
  - `id`
  - `name`
  - `avatarUrl`
  - `dealsAggregate.sum.value`

  - `salesOwner` (user info)
  - `contacts` (basic contact info)

Example response:

```json
{
  "data": {
    "companies": {
      "nodes": [
        {
          "id": 1,
          "name": "Acme",
          "avatarUrl": null,
          "dealsAggregate": [
            { "sum": { "value": 1000 } }
          ],
          "salesOwner": { "id": 2, "name": "Jane" },
          "contacts": [
            { "id": 5, "name": "John" }
          ]
        }
      ],
      "totalCount": 1
    }
  }
}


## Try this example on your local

```bash
npm create refine-app@latest -- --example app-crm
```

## Try this example on CodeSandbox

<br/>

[![Open app-crm example from refine](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/embed/github/refinedev/refine/tree/master/examples/app-crm?view=preview&theme=dark&codemirror=1)

## API Endpoints

### List Quotes


Quotes are fetched via GraphQL using the `quotes` query. A typical request
might look like the following:

```graphql
query QuotesTable($filter: QuoteFilter!, $sorting: [QuoteSort!], $paging: OffsetPaging!) {
  quotes(filter: $filter, sorting: $sorting, paging: $paging) {
    nodes {
      id
      title
      status
      description
      subTotal
      total
      tax
      createdAt
      items {
        title
        unitPrice
        quantity
        discount
        totalPrice
      }
      company {
        id
        name
        country
        website
        avatarUrl
      }
      salesOwner {
        id
        name
      }
      contact {
        id
        name
      }
    }
    totalCount
  }
}
```

The `$filter` variable uses the `QuoteFilter` input type. Example:

```json
{
  "title": { "iLike": "%sample%" },
  "status": { "in": ["DRAFT", "SENT"] }
}
```

This allows searching quotes by title and filtering by multiple statuses.

