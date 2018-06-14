/* @flow */

// Presets
import { source, build, antd, favicon } from '../paths';

// Plugins
import { DefinePlugin, ContextReplacementPlugin } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackTemplate from 'html-webpack-template';

// antd
import { join } from 'path';
import fs from 'fs';
import lessToJs from 'less-vars-to-js';
const antdVariables = lessToJs(
    // eslint-disable-next-line
    fs.readFileSync(join(`${antd}/antdVariables.less`), "utf8"),
);

export const generateCommonConfiguration = () => {
    const BUILD_ENV = process.env.BUILD_ENV;

    let __API_URL__ = null;

    switch (BUILD_ENV) {
        case 'production':
            __API_URL__ = JSON.stringify('https://dev-api.carbook.pro');
            break;

        default:
            __API_URL__ = JSON.stringify('https://dev-api.carbook.pro');
    }

    return {
        entry: {
            source,
            client: 'webpack-dev-server/client?http://localhost:3000',
        },
        output: {
            path:       build,
            publicPath: '/',
        },
        resolve: {
            extensions: [ '.mjs', '.js', '.json', '.css', '.m.css', '.less' ],
            modules:    [ source, 'node_modules' ],
        },
        optimization: {
            nodeEnv: process.env.NODE_ENV,
        },
        module: {
            rules: [
                {
                    test:    /\.m?js$/,
                    include: source,
                    use:     'babel-loader',
                },
                {
                    test:    /\.eot|svg|ttf|woff2?(\?v=\d+\.\d+\.\d+)?$/,
                    include: source,
                    use:     {
                        loader:  'file-loader',
                        options: {
                            name: 'fonts/[name].[hash:5].[ext]',
                        },
                    },
                },
                {
                    test:    /\.jpe?g$/,
                    include: source,
                    use:     {
                        loader:  'file-loader',
                        options: {
                            name: 'images/[name].[hash:5].[ext]',
                        },
                    },
                },
                {
                    test:    /\.png$/,
                    include: source,
                    use:     {
                        loader:  'url-loader',
                        options: {
                            limit: 5000,
                            name:  'images/[name].[hash:5].[ext]',
                        },
                    },
                },
                {
                    test: /\.less$/,
                    use:  [
                        { loader: 'style-loader' },
                        { loader: 'css-loader' },
                        {
                            loader:  'less-loader',
                            options: {
                                javascriptEnabled: true,
                                modifyVars:        antdVariables,
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                inject:      false,
                template:    HtmlWebpackTemplate,
                title:       'Carbook.pro',
                favicon:     favicon,
                appMountIds: [ 'app', 'bridgeTargetNode', 'spinner' ],
                mobile:      true,
            }),
            new ContextReplacementPlugin(/moment\/locale$/, /ru/),
            new DefinePlugin({
                __ENV__:   JSON.stringify(BUILD_ENV),
                __DEV__:   BUILD_ENV === 'development',
                __STAGE__: BUILD_ENV === 'stage',
                __PROD__:  BUILD_ENV === 'production',
                __API_URL__,
            }),
        ],
    };
};
