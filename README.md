# tandem-frontend

Frontend for tandem language exchange chat app written in React, using TypeScript. Final project for Professional
Training in Web Applications Development (_Grado Superior en Desarrollo de Aplicaciones Web_).

Backend repo: https://github.com/javierclavijo/tandem-backend

## Deployment

### Development

It's recommended to use VS Code with its Dev Containers feature, as additional work might be required to make the project work in other environments. The project includes a ready-made configuration to work with this feature out of the box.

1. If a Docker network for the project hasn't been created yet, run `docker network create tandem-network`.
2. On VS Code, open the command palette (F1 or Ctrl+Shift+P) and execute the `Remote-Containers: Clone Repository in Container Volume` command. Enter the repo's URL (https://github.com/javierclavijo/tandem-frontend.git).
3. Create the project's `.env` file from `.env.example`.
4. Run `npm install`.
5. Run `npm start`.

### Production

1. If a Docker network for the project hasn't been created yet, run `docker network create tandem-network`.
2. Create the project's `.env` file from `.env.example`.
3. On the project's root, `run docker-compose -f compose.prod.yaml up`

### Credits

- Font: [Rubik](https://fonts.google.com/specimen/Rubik?category=Sans+Serif,Display#glyphs)
- Icons: [Iconoir](https://iconoir.com/)
- Images:
  - [Default user profile image](https://es.wikipedia.org/wiki/Archivo:Portrait_Placeholder.png)
  - [Pre-login image 1](https://unsplash.com/es/fotos/M8cpBt6RSns)
  - [Pre-login image 2](https://unsplash.com/photos/98Elr-LIvD8)
  - [Pre-login image 3](https://unsplash.com/photos/ANNsvl-6AG0)
