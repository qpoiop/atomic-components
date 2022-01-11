const packageJson = require('./package.json')
const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const env = process.env

const defaultPlugin = [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
        __VERSION__: JSON.stringify(packageJson.version)
    }),
    new webpack.BannerPlugin({
        entryOnly: true,
        raw: true,
        banner: 'typeof window !== "undefined" &&'
    })
]

const defaultConfig = {
    mode: 'development',
    entry: './src/atomic',
    optimization: {
        splitChunks: false
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        strictExportPresence: true,
        rules: [
            {
                test: /\.(ts|js)$/,
                exclude: [path.resolve(__dirname, 'node_modules')],
                loader: 'babel-loader',
                options: {
                    babelrc: false,
                    presets: ['@babel/preset-typescript', [
                        '@babel/preset-env', {
                            loose: true,
                            modules: false,
                            targets: {
                                browsers: [
                                    'chrome >= 47',
                                    'firefox >= 51',
                                    'ie >= 11',
                                    'safari >= 8',
                                    'ios >= 8',
                                    'android >= 4',
                                ]
                            }
                        }]
                    ],
                    plugins: [
                        [
                          '@babel/plugin-proposal-class-properties',
                          {
                            loose: true,
                          },
                        ],
                        '@babel/plugin-proposal-object-rest-spread',
                        ['@babel/plugin-transform-object-assign'],
                        ['@babel/plugin-proposal-optional-chaining']
                    ],
                }
            }
        ],
    },
    node: {
        global: false,
        __filename: false,
        __dirname: false
    }
}
const webpackConfig = [
    {
        name: 'debug',
        mode: 'development',
        output: {
            filename: 'atomic.js',
            chunkFilename: '[name].js',
            sourceMapFilename: '[id].[hash:8].js.map',
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/dist/',
            library: 'Atomic',
            libraryTarget: 'umd',
            libraryExport: 'default',
            globalObject: 'this'
        },
        plugins: defaultPlugin,
        devtool: 'source-map'
    },
    {
        name: 'demo',
        mode: 'development',
        entry: './demo/main',
        output: {
            filename: 'atomic-demo.js',
            chunkFilename: '[name].js',
            sourceMapFilename: '[id].[hash:8].js.map',
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/dist/',
            library: 'AtomicDemo',
            libraryTarget: 'umd',
            libraryExport: 'default',
            globalObject: 'this'
        },
        devtool: 'source-map',
        devServer: {
            compress: true,
            historyApiFallback: true,
            hot: true,
            static: {
                directory: path.resolve(__dirname, 'demo'),
                publicPath: '/'
            }
        }
    },
    {
        name: 'dist',
        mode: 'production',
        output: {
            filename: '[name].js',
            chunkFilename: '[hash:8].js',
            library: 'Atomic',
            libraryTarget: 'umd',
            libraryExport: 'default',
            globalObject: 'this'
        },
        plugins: defaultPlugin
    },
].map((config) => merge(defaultConfig, config))

module.exports = (args) => {
    const requestedConfig = Object.keys(args).filter((key) => !/^WEBPACK_/.test(key))
    let configs

    if( !requestedConfig.length )
        configs = webpackConfig
    else 
        configs = webpackConfig.filter((config) => requestedConfig.includes(config.name))

    console.log(`Building configs: ${configs.map((config) => config.name).join(', ')}.\n`)
    return configs
}