# Simple Workflow Automation

> A simplified MVP version of [n8n](https://github.com/n8n-io/n8n) - Execute basic workflow automation

## 🎯 Overview

This is a minimal workflow automation engine inspired by n8n, implementing the core concept of node-based workflow execution. It demonstrates the fundamental architecture of workflow automation without the complexity of a full production system.

## ✨ Features

- **Workflow Engine**: Execute workflows with multiple nodes in sequence
- **Built-in Nodes**:
  - **HTTP Request**: Make HTTP calls to external APIs
  - **Set**: Transform and set data
  - **Code**: Execute custom JavaScript code
- **REST API**: Simple API to trigger workflows
- **No Database**: Workflows defined in JSON (in-memory)
- **No Authentication**: MVP simplicity

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.19
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Or build and run production
npm run build
npm start
```

The server will start on `http://localhost:3000`

## 📖 Usage

### Execute a Workflow

POST to `/api/workflows/execute` with a workflow definition:

```bash
curl -X POST http://localhost:3000/api/workflows/execute \
  -H "Content-Type: application/json" \
  -d '{
    "nodes": [
      {
        "id": "node1",
        "type": "httpRequest",
        "parameters": {
          "url": "https://jsonplaceholder.typicode.com/posts/1",
          "method": "GET"
        }
      },
      {
        "id": "node2",
        "type": "set",
        "parameters": {
          "values": {
            "title": "={{$json.title}}",
            "upperTitle": "={{$json.title.toUpperCase()}}"
          }
        }
      }
    ],
    "connections": [
      {
        "from": "node1",
        "to": "node2"
      }
    ]
  }'
```

### Example Workflows

#### 1. Simple HTTP Request

```json
{
  "nodes": [
    {
      "id": "fetch",
      "type": "httpRequest",
      "parameters": {
        "url": "https://api.github.com/users/octocat",
        "method": "GET"
      }
    }
  ],
  "connections": []
}
```

#### 2. HTTP + Data Transformation

```json
{
  "nodes": [
    {
      "id": "fetch",
      "type": "httpRequest",
      "parameters": {
        "url": "https://jsonplaceholder.typicode.com/users",
        "method": "GET"
      }
    },
    {
      "id": "transform",
      "type": "code",
      "parameters": {
        "code": "return items.slice(0, 3).map(user => ({ name: user.name, email: user.email }));"
      }
    }
  ],
  "connections": [
    { "from": "fetch", "to": "transform" }
  ]
}
```

#### 3. Set Node Example

```json
{
  "nodes": [
    {
      "id": "getData",
      "type": "httpRequest",
      "parameters": {
        "url": "https://api.coindesk.com/v1/bpi/currentprice.json",
        "method": "GET"
      }
    },
    {
      "id": "formatData",
      "type": "set",
      "parameters": {
        "values": {
          "currency": "USD",
          "rate": "={{$json.bpi.USD.rate}}",
          "description": "={{$json.bpi.USD.description}}"
        }
      }
    }
  ],
  "connections": [
    { "from": "getData", "to": "formatData" }
  ]
}
```

## 🏗️ Architecture

### Core Components

- **Workflow Engine** (`WorkflowEngine`): Orchestrates node execution
- **Node Executor** (`NodeExecutor`): Executes individual nodes
- **Node Registry**: Manages available node types
- **Expression Resolver**: Handles `={{}}` expressions in parameters

### Node Types

#### HTTP Request Node
```typescript
{
  type: "httpRequest",
  parameters: {
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    headers?: Record<string, string>,
    body?: any
  }
}
```

#### Set Node
```typescript
{
  type: "set",
  parameters: {
    values: Record<string, string | number | boolean>
  }
}
```

#### Code Node
```typescript
{
  type: "code",
  parameters: {
    code: string  // JavaScript code to execute
  }
}
```

## 🔍 What's Different from n8n?

This MVP focuses on the **core workflow execution engine** and removes:

❌ **Not Included:**
- Database (PostgreSQL, SQLite, MySQL)
- Authentication & Authorization
- User Interface (Vue.js frontend)
- 400+ integrations
- Webhooks & Triggers
- Workflow persistence
- Credentials management
- Error workflow handling
- Queues (Bull/Redis)
- Multi-tenancy
- AI nodes (LangChain)
- External secrets management

✅ **Included:**
- Core workflow execution logic
- Expression evaluation (`={{}}` syntax)
- Node-based architecture
- HTTP node for API calls
- Data transformation (Set & Code nodes)
- Simple REST API

## 🧪 Testing

Test the health endpoint:

```bash
curl http://localhost:3000/health
```

## 📚 Comparison with n8n

| Feature | n8n | This MVP |
|---------|-----|----------|
| Workflow Execution | ✅ | ✅ |
| Visual Editor | ✅ | ❌ |
| Database | ✅ | ❌ |
| Authentication | ✅ | ❌ |
| Nodes | 400+ | 3 |
| Webhooks | ✅ | ❌ |
| Triggers | ✅ | ❌ |
| Expressions | ✅ | ✅ (basic) |
| Error Handling | ✅ | ✅ (basic) |

## 🛠️ Tech Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript 5.9
- **Framework**: Express 5.1
- **HTTP Client**: Axios 1.12
- **Validation**: Zod 3.25
- **Utilities**: Lodash 4.17

## 📝 License

MIT License - Free to use and modify

## 🙏 Acknowledgments

Inspired by the amazing [n8n](https://github.com/n8n-io/n8n) project by n8n.io

---

**Note**: This is an educational MVP demonstrating workflow automation concepts. For production use, check out the full [n8n platform](https://n8n.io).
