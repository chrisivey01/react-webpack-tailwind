const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ProvidePlugin } = require('webpack');
const path = require("path");
const buildPath = path.resolve(__dirname, "dist");

module.exports = {
    entry: "./src/index.tsx",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "esbuild-loader",
                options: {
                    loader: "tsx", // Or 'ts' if you don't need tsx
                    target: "es2015",
                },
            },
            // {
            //     test: /\.(sa|sc|c)ss$/,
            //     use: ["style-loader", "css-loader", "sass-loader"],
            // },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "public/index.html",
            inject: true,
            minify: false,
        }),
        new ProvidePlugin({
            React: "react",
        }),
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "index.js",
        path: path.resolve(buildPath),
        clean: {
            keep(asset) {
                return [
                    asset.includes("client.js"),
                    asset.includes("server.js"),
                ];
            },
        },
    },
    devtool: "inline-source-map",
};