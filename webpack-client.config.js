
var Encore = require('@symfony/webpack-encore');
//const CopyWebpackPlugin = require('copy-webpack-plugin');
//const Dotenv = require('dotenv-webpack');

// Manually configure the runtime environment if not already configured yet by the "encore" command.
// It's useful when you use tools that rely on webpack.config.js file.
if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

Encore
    // directory where compiled assets will be stored
    .setOutputPath('dist/frontend')
    // public path used by the web server to access the output path
    // Dev public path used by the web server to access the output path
    .setPublicPath('http://localhost:3000/frontend')
    
    // only needed for CDN's or sub-directory deploy
    .setManifestKeyPrefix('frontend')

    /*
     * ENTRY CONFIG
     *
     * Add 1 entry for each "page" of your app
     * (including one that's included on every page - e.g. "app")
     *
     * Each entry will result in one JavaScript file (e.g. app.js)
     * and one CSS file (e.g. app.css) if your JavaScript imports CSS.
     */
/*  
     .addPlugin(new CopyWebpackPlugin({
        patterns: [
            //{ from: './resources/images', to: 'images' },
        ]
    }))
*/
    // When enabled, Webpack "splits" your files into smaller pieces for greater optimization.
    //.splitEntryChunks()

    // will require an extra script tag for runtime.js
    // but, you probably want this, unless you're building a single-page app
    .disableSingleRuntimeChunk()

    /*
     * FEATURE CONFIG
     *
     * Enable & configure other features below. For a full
     * list of features, see:
     * https://symfony.com/doc/current/frontend.html#adding-more-features
     */
    //.cleanupOutputBeforeBuild()
    //.enableBuildNotifications()
    .enableSourceMaps(!Encore.isProduction())
    
    // enables hashed filenames (e.g. app.abc123.css)
    //.enableVersioning(true)
    //.enableVersioning(Encore.isProduction())

    // enables @babel/preset-env polyfills
    .configureBabelPresetEnv((config) => {
        config.useBuiltIns = 'usage';
        config.corejs = 3;
    })   

    .addEntry('public',[
        './src/frontend/main.ts',
    ])                  

    // enables Sass/SCSS support
    //.enableSassLoader()

    // uncomment if you use TypeScript
    .enableTypeScriptLoader()

    // uncomment to get integrity="..." attributes on your script & link tags
    // requires WebpackEncoreBundle 1.4 or higher
    //.enableIntegrityHashes(Encore.isProduction())

    // uncomment if you're having problems with a jQuery plugin
    //.autoProvidejQuery()

    // uncomment if you use API Platform Admin (composer req api-admin)
    //.enableReactPreset()
    .enableVueLoader()
    //.addEntry('admin', './assets/js/admin.js')

    //.addPlugin(new Dotenv())
;

var config = Encore.getWebpackConfig();


config.resolve = {
    extensions: ['.ts', '.js', '.vue', '.json', 'scss'],
}

module.exports = config;