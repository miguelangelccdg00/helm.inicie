# Helm Workspace

![Nx Monorepo](https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png)

**Helm Workspace** is a modular, scalable monorepo built with [Nx](https://nx.dev), designed for modern full-stack development. It combines robust backend APIs, a feature-rich Angular frontend, and reusable libraries to accelerate enterprise application development.

---

## ✨ Features

- **Monorepo Architecture:** Manage multiple apps and libraries in a single, consistent workspace.
- **Backend APIs:** Node.js/Express services for authentication and shared business logic.
- **Modern Frontend:** Angular-based SPA for a seamless user experience.
- **Reusable Libraries:** Share UI components and authentication logic across projects.
- **TypeScript Everywhere:** End-to-end type safety for reliability and maintainability.
- **Integrated Testing:** Jest and E2E support for all apps and libraries.
- **Nx Powered:** Fast builds, code generation, and advanced developer tooling.

---

## 📁 Project Structure

```
helm-workspace/
│
├── apps/
│   ├── api-auth-helm/         # Node.js/Express authentication API
│   ├── api-shared-helm/       # Shared backend logic and models
│   └── helm-front/           # Angular frontend application
│
├── libs/
│   ├── feature-auth/         # Auth logic as a reusable library
│   └── shared-ui/           # UI components for Angular apps
│
├── docs/                     # Documentation and guides
└── nx.json, package.json    # Nx and workspace configuration
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```sh
npm install
```

### 2. Run the Frontend

```sh
npx nx serve helm-front
```

### 3. Run the Backend API

```sh
npx nx serve api-auth-helm
```

### 4. Build for Production

```sh
npx nx build helm-front
npx nx build api-auth-helm
```

### 5. Run Tests

```sh
npx nx test helm-front
npx nx test api-auth-helm
```

---

## 🛠️ Technologies Used

- **Nx Monorepo**
- **Angular**
- **Node.js / Express**
- **TypeScript**
- **Jest**
- **MySQL**
- **SASS**

---

## 📚 Documentation

- [Nx Documentation](https://nx.dev)
- [Angular](https://angular.io/)
- [Express](https://expressjs.com/)

---

## 🤝 Contributing

Contributions are welcome! Please open issues and submit pull requests for improvements or bug fixes.

---

## 📄 License

This project is licensed under the MIT License.
