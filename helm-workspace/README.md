# helm-workspace

This project is an Nx workspace that contains an Angular application named **helm-front** and two Express applications named **api-shared-help** and **api-auth-helm**. 

## Applications

### helm-front
- An Angular application that serves as the frontend of the project.

### api-shared-help
- An Express application that provides shared help functionalities.

### api-auth-helm
- An Express application that handles authentication for the helm-front application.

## Libraries

### shared
- A shared library that contains common utilities and types used across the applications.

## Getting Started

To get started with this project, follow these steps:

1. Install the dependencies:
   ```bash
   npm install
   ```

2. Run the Angular application:
   ```bash
   nx serve helm-front
   ```

3. Run the Express applications:
   ```bash
   nx serve api-shared-help
   nx serve api-auth-helm
   ```

## Project Structure

The project is structured as follows:

```
helm-workspace
├── apps
│   ├── helm-front
│   ├── api-shared-help
│   └── api-auth-helm
├── libs
│   └── shared
├── nx.json
├── package.json
├── tsconfig.base.json
└── README.md
```

## License

This project is licensed under the MIT License.