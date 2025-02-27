import restart from 'vite-plugin-restart'

const path = {
	transform : 'transform-objects/',
	animations: 'animations/',
	cameras   : 'cameras/',
	fullscreen: 'fullscreen-and-resizing/',
	geometries: 'geometries/',
	debug_ui  : 'debug-ui/',
	textures  : 'textures/',
	materials : 'materials/',
	text3D    : 'text3D/',
	lights    : 'lights/',
	shadows   : 'shadows/',
	house     : 'house/',
}

export default {
    root: path.house, // Sources files (typically where index.html is)
    publicDir: '../static/', // Path from "root" to static assets (files that are served as they are)
    server:
    {
        host: true, // Open to local network and display URL
        open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env) // Open if it's not a CodeSandbox
    },
    build:
    {
        outDir: '../dist', // Output in the dist/ folder
        emptyOutDir: true, // Empty the folder first
        sourcemap: true // Add sourcemap
    },
    plugins:
    [
        restart({ restart: [ '../static/**', ] }) // Restart server on static file change
    ],
}