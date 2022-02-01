const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ProvidePlugin } = require("webpack");
const path = require("path");
const buildPath = path.resolve(__dirname, "dist");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { ESBuildMinifyPlugin } = require("esbuild-loader");

module.exports = {
    entry: "./src/index.tsx",
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
    plugins: [
        new HtmlWebpackPlugin({
            template: "public/index.html",
            inject: true,
            minify: false,
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),
        new ProvidePlugin({
            React: "react",
        }),
    ],
    optimization: {
        minimizer: [
            new ESBuildMinifyPlugin({
                css: true,
            }),
        ],
    },
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
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "postcss-loader",
                ],
            },
            {
                test: /\.(png|jpg|svg|jpeg|gif)$/i,
                type: "asset/resource",
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    devtool: "inline-source-map",
};
