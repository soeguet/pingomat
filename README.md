# pingomat

![success](pictures/success.png)

## About

This is a quick and dirty desktop program for pinging a local ip adress on the default port. On error you will get a desktop notification and a flashing window bar icon.
This might be useful if you need to be notified as soon as your device is not available anymore or to keep it alive.

## Technologies

- [wails](https://wails.io/)
- [golang](https://go.dev/)
- [typescript](https://www.typescriptlang.org/)
- [react](https://react.dev/)
- [tailwindcss](https://tailwindcss.com/)

### Further Dependencies
- [beeep](https://github.com/gen2brain/beeep)
- [vite](https://vitejs.dev/)

## Building

To build a redistributable, production mode package, use 
```sh
wails build
```

## License

[MIT License](LICENSE)

## Screenshots
![error](pictures/error.png)
![notification](pictures/notification.png)