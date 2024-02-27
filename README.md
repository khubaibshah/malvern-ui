# malvern-ui

[![HTML](https://img.shields.io/badge/HTML-5-orange?style=flat&logo=html5&logoColor=white)](https://www.w3.org/TR/html52/)
[![CSS](https://img.shields.io/badge/CSS-3-blue?style=flat&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/specs.en.html)
![Bootstrap](https://img.shields.io/badge/javascript-5-orange?style=style=flat&logo=javascript&logoColor=orange)
![vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)


Hello there! 👋 Welcome to Malvern Auto Customer UI repository. 
# Description 
I created this project to develop a user-friendly web application that facilitates online bookings for car repairs. It aimed to streamline the process of scheduling appointments and managing repair services for vehicle owners. The project utilized modern web development technologies such as Vue.js for the frontend, Laravel and Node.js for the backend, and MySql as the database. The application featured an intuitive interface where users could easily select their desired repair services, choose appointment times, and make payments securely. Throughout the development process, I have focused on delivering a seamless user experience while ensuring the reliability and scalability of the application.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Installation](#installation)
- [Visual](#visual)
- [Project Setup](#setup)
- [Dependencies](#dependencies)
- [License](#license)

## Features:
- Service catalog displaying available repair services.
- Shopping cart functionality for selecting services.
- Appointment scheduling with date and time selection.
- Booking summary page displaying selected services and total - cost.
- Email notification system for confirming bookings.
- Payment integration with secure payment gateway.

## Installation:
#### Instructions on how to install and run your project locally. Include any prerequisites or dependencies required.

1. Clone the repository
- ```git clone https://github.com/khubaibshah/malvern-ui```

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```


- ### !! The site will not allow you to make any changes or enter any data as it relies on the [MalverAutos api](https://github.com/khubaibshah/malvern-api) which also relies on the Databse which is only local at the moment.

### Technologies Used
- HTML
- CSS
- JavaScript
- Vue.js
- Vite
- Node
- PrimeVue
- TypeScript
- Api integration (Dvla & Dvsa endpoints to retrieve vehicle data)
- AWS Amplify to host the site and also help remove any errors when deploying live build in future

## Visual
https://youtu.be/sq6nUj52KS4

A walkthrough of the current functionality of the site on local using Api integration to retrieve data back for vehicle from DVSA and also retrieving data from the Malvern Auto api to render category repairs and individual repairs.

<video width="800" height="500" controls>
  <source src="./src/assets/img/malvern_auto_vid.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>


 ## Deployed application

 - Click here [Live Site](https://main.d23ylsy8h1d6lf.amplifyapp.com).


## Dependencies

 - Malvern Auto Api [Malvern Auto Api](https://github.com/khubaibshah/malvern-api).
 - Malvern Auto Admin [Malvern Auto Admin](https://github.com/khubaibshah/malvern-admin-ui).
## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

